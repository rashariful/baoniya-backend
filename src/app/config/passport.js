import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { User } from "../modules/user/user.model.js";


// ========================
// GOOGLE STRATEGY
// ========================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // আগে দেখো এই googleId দিয়ে user আছে কিনা
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user); // আগেই registered, সরাসরি return
        }

        // Email দিয়েও check করো (হয়তো normal account আছে)
        const email = profile.emails?.[0]?.value;
        user = await User.findOne({ email });

        if (user) {
          // Existing user এর সাথে Google account link করো
          user.googleId = profile.id;
          if (!user.thumbnail && profile.photos?.[0]?.value) {
            user.thumbnail = profile.photos[0].value;
          }
          await user.save({ validateBeforeSave: false });
          return done(null, user);
        }

        // একদম নতুন user — create করো
        const newUser = await User.create({
          name: profile.displayName,
          email,
          googleId: profile.id,
          thumbnail: profile.photos?.[0]?.value || "",
          isEmailVerified: true, // Google verified email
          role: "user",
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// ========================
// FACEBOOK STRATEGY
// ========================
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ facebookId: profile.id });

        if (user) {
          return done(null, user);
        }

        const email = profile.emails?.[0]?.value;

        // Email থাকলে existing account check করো
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.facebookId = profile.id;
            if (!user.thumbnail && profile.photos?.[0]?.value) {
              user.thumbnail = profile.photos[0].value;
            }
            await user.save({ validateBeforeSave: false });
            return done(null, user);
          }
        }

        // নতুন user
        const newUser = await User.create({
          name: profile.displayName,
          email: email || `fb_${profile.id}@placeholder.com`,
          facebookId: profile.id,
          thumbnail: profile.photos?.[0]?.value || "",
          isEmailVerified: !!email,
          role: "user",
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;