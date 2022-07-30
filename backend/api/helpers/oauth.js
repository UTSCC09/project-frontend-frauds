import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import config from "../../config/index.js";
import { User } from "../../models/index.js";
const GoogleStrategy = passportGoogle.Strategy;

export const strategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true,
      },
      async function (request, _accessToken, _refreshToken, profile, done) {
        try {
          if (false) {
            // TODO: Send job to queue
            console.log("I have arrived at insert");
            if (request.body.operator === "true") {
              await User.insertUser(
                profile.email,
                profile.name,
                ["admin", "user"],
                profile.picture
              );
            } else {
              console.log("I have arrived at insert user");
              await User.insertUser(
                profile.email,
                profile.name,
                ["user"],
                profile.picture
              );
            }
          }
          // await User.findUser();
          return done(null, profile);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};
