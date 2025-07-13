const router = require('express').Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: process.env.CLIENT_URL + '/login',
    }),
    (req, res) => {
        console.log('Google authentication successful! User:', req.user.username);
        
        if (req.user) {
            req.session.user = {
                username: req.user.username,
                id: req.user._id,
                email: req.user.email
            };
            req.session.save(err => {
                if (err) {
                    console.error("Session save error:", err);
                    return res.status(500).json({ message: "Login successful but failed to save session." });
                }
                console.log(req.session);
                res.redirect(process.env.CLIENT_URL);
            });
        } else {
            res.redirect(process.env.CLIENT_URL + '/login');
        }
    }
);

module.exports = router;