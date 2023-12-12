require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserOauth = require('../../model/UserOauth');

module.exports = (passport) => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: 'http://localhost:8080/google/callback',
            },
            async function (accessToken, refreshToken, profile, done) {
                let user;
                try {
                    // console.log(profile)
                    user = await UserOauth.findOne({
                        googleId: profile.id,
                    });
                    if (user) {
                        console.log('helo' + user);
                        done(null, user);
                    } else {
                        console.log('isside new user' + profile.id);
                        const newUser = {
                            googleId: profile.id,
                            name: profile.displayName,
                            photo: profile.photos[0].value,
                        };
                        user = await UserOauth.create(newUser);
                        done(null, user);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        )
    );

    passport.serializeUser(function (user, done) {
        console.log('serializeUser' + user);
        done(null, user._id);
    });

    passport.deserializeUser(async function (id, done) {
        console.log('deserializeUser' + id);
        await UserOauth.findById(id).then((res) => {
            done(null, res);
        });
    });
};
