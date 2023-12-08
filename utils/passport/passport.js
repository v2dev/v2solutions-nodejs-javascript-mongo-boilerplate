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
                let user
                try {
                    console.log(accessToken)
                     user = await UserOauth.findOne({
                        googleid: profile.id,
                    });
                    if (user) {
                        done(null, user);
                    } else {
                        console.log('isside new user' + profile.id)
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
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        UserOauth.findById(id, function (err, user) {
            done(err, user);
        });
    });
};
