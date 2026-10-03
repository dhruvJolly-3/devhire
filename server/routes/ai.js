const router = require('express').Router();
const Anthropic = require('@anthropic-ai/sdk');
const auth = require('../middleware/auth');
const { requireApplicant } = require('../utils/roles');
const Job = require('../models/Job');

// Reads ANTHROPIC_API_KEY from the environment.
const client = new Anthropic();
const MODEL = 'claude-opus-5';

const MAX_RESUME_CHARS = 20000;

// Shared by both routes: logged-in user, valid job, non-empty resume text.
async function loadJobAndResume(req, res) {
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(503).json({ message: 'AI features are not configured on this server' });
    return null;
  }
  // A pasted resume wins; otherwise use the one saved on the profile.
  const resume = (req.body.resume || req.user.resumeText || '').trim();
  if (!resume) {
    res.status(400).json({ message: 'Add your resume on your profile, or paste it here' });
    return null;
  }
  if (resume.length > MAX_RESUME_CHARS) {
    res.status(400).json({ message: 'Resume is too long — please shorten it' });
    return null;
  }
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    res.status(404).json({ message: 'Job not found' });
    return null;
  }
  return { job, resume };
}

function jobText(job) {
  return [
    `Title: ${job.title}`,
    `Company: ${job.company}`,
    `Location: ${job.location} (${job.type})`,
    job.expLevel && `Experience level: ${job.expLevel}`,
    job.tags?.length && `Stack: ${job.tags.join(', ')}`,
    `Description:\n${job.description}`,
  ].filter(Boolean).join('\n');
}

// Calls Claude and returns the text of the reply.
// `fallbacks: "default"` lets the API retry on another model if the first declines.
async function askClaude({ system, prompt, format }) {
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low', ...(format && { format }) },
    system,
    messages: [{ role: 'user', content: prompt }],
  });
  if (response.stop_reason === 'refusal') {
    throw new Error('The AI declined this request');
  }
  const text = response.content.find(b => b.type === 'text');
  return text ? text.text : '';
}

// POST /api/ai/match/:jobId  { resume } → { score, summary, strengths, gaps }
router.post('/match/:jobId', auth, requireApplicant, async (req, res) => {
  try {
    const data = await loadJobAndResume(req, res);
    if (!data) return;

    const text = await askClaude({
      system: 'You are a fair technical recruiter. Compare a candidate resume with a job description. Be honest and specific; base every point on what the resume actually says.',
      prompt: `JOB:\n${jobText(data.job)}\n\nRESUME:\n${data.resume}\n\nScore how well this candidate matches the job from 0 to 100, give a one-sentence summary, up to 4 strengths and up to 4 gaps.`,
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            score: { type: 'integer' },
            summary: { type: 'string' },
            strengths: { type: 'array', items: { type: 'string' } },
            gaps: { type: 'array', items: { type: 'string' } },
          },
          required: ['score', 'summary', 'strengths', 'gaps'],
          additionalProperties: false,
        },
      },
    });

    const result = JSON.parse(text);
    result.score = Math.max(0, Math.min(100, result.score));
    res.json(result);
  } catch (err) {
    console.error('AI match failed:', err.message);
    res.status(502).json({ message: 'Could not generate a match score right now' });
  }
});

// POST /api/ai/cover-letter/:jobId  { resume } → { letter }
router.post('/cover-letter/:jobId', auth, requireApplicant, async (req, res) => {
  try {
    const data = await loadJobAndResume(req, res);
    if (!data) return;

    const letter = await askClaude({
      system: 'You write concise, genuine cover letters for developers. Use only facts from the resume — never invent experience, companies or numbers. Plain text, no placeholders like [Your Name].',
      prompt: `Write a cover letter (under 250 words) from ${req.user.name} for this job.\n\nJOB:\n${jobText(data.job)}\n\nRESUME:\n${data.resume}`,
    });

    res.json({ letter: letter.trim() });
  } catch (err) {
    console.error('AI cover letter failed:', err.message);
    res.status(502).json({ message: 'Could not generate a cover letter right now' });
  }
});

module.exports = router;
