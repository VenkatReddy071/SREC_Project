
const authenticateUser = (req, res, next) => {
    console.log(req.session)
    if (!req.session || !req.session.user) {
        return res.status(401).json({ msg: 'Not authenticated, please log in' });
    }
    req.user = { id: req.session.user?.id, isAdmin: req.session.isAdmin || false };
    next();
};

const authorizeAdmin = (req, res, next) => {
    if (!req.session || !req.session.user || !req.session.isAdmin) {
        return res.status(403).json({ msg: 'Access denied, admin privilege required' });
    }
    next();
};

module.exports = { authenticateUser, authorizeAdmin };