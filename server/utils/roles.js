// Who may do what. A company account (signed in with a Company ID) posts
// roles and reviews applicants; every other account is a candidate that
// saves and applies. Accounts created before roles existed count as
// candidates.
const isCompany = (u) => u?.role === 'employer' && !!u.companyId;
const canPost = (u) => isCompany(u);
const canApply = (u) => !!u && !isCompany(u);

// Express guards: 403 with a clear message instead of a silent failure.
const requirePoster = (req, res, next) => (canPost(req.user) ? next()
  : res.status(403).json({ message: 'Only company accounts can post and manage roles' }));
const requireApplicant = (req, res, next) => (canApply(req.user) ? next()
  : res.status(403).json({ message: 'Company accounts cannot apply to roles' }));

module.exports = { isCompany, canPost, canApply, requirePoster, requireApplicant };
