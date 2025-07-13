const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../models/User/LoginModel');
require('dotenv').config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    }).catch(err => {
        done(err, null);
    });
});

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://srec-project.onrender.com/auth/google/callback',
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
             let currentUser = await User.findOne({ googleId: profile.id });
    let userToPass;

    if (currentUser) {
        currentUser.lastLogin = Date.now();
        await currentUser.save();
        userToPass = currentUser;
    } else {
        let userEmail = null;
        if (profile.emails && profile.emails.length > 0) {
            userEmail = profile.emails[0].value;
        }

        const existingUserWithEmail = await User.findOne({ email: userEmail });

        if (existingUserWithEmail) {
            existingUserWithEmail.googleId = profile.id;
            existingUserWithEmail.username = existingUserWithEmail.username || profile.displayName;
            existingUserWithEmail.verified = true;
            existingUserWithEmail.lastLogin = Date.now();
            await existingUserWithEmail.save();
            userToPass = existingUserWithEmail;
        } else {
            const newUser = new User({
                googleId: profile.id,
                username: profile.displayName,
                email: userEmail,
                verified: true,
                lastLogin: Date.now(),
                type: 'user',
                subscribe: false,
                isBlock: false,
                isAdmin: false,
            });
            await newUser.save();
            userToPass = newUser;
        }
    }
    
    done(null, userToPass);

} catch (err) {
    console.error('Error during Google OAuth callback:', err);
    done(err, null);
}
})
);
