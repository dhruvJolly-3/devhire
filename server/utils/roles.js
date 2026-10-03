// Who may do what. A company account (has a companyId) posts and reviews; a
// candidate saves and applies. Legacy accounts (role "employer", no companyId)
// were created before roles existed and keep both abilities.
const isCompany = (u) => u?.role === 'employer' && !!u.companyId;
const canPost = (u) => u?.role === 'employer';
const canApply = (u) => !!u && !isCompany(u);

// Express guards: 403 with a clear message instead of a silent failure.
const requirePoster = (req, res, next) => (canPost(req.user) ? next()
  : res.status(403).json({ message: 'Only company accounts can post and manage roles' }));
const requireApplicant = (req, res, next) => (canApply(req.user) ? next()
  : res.status(403).json({ message: 'Company accounts cannot apply to roles' }));

module.exports = { isCompany, canPost, canApply, requirePoster, requireApplicant };
