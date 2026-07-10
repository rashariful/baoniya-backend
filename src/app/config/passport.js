import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { User } from "../modules/user/user.model.js";
import config from "./index.js";   // ✅ centralized config use koro

// ========================
// GOOGLE STRATEGY (optional register - crash proof)
// ========================
if (config.google.client_id && config.google.client_secret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.client_id,
        clientSecret: config.google.client_secret,
        callbackURL: config.google.callback_url,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          }

          const email = profile.emails?.[0]?.value;
          user = await User.findOne({ email });

          if (user) {
            user.googleId = profile.id;

            if (!user.thumbnail && profile.photos?.[0]?.value) {
              user.thumbnail = profile.photos[0].value;
            }

            await user.save({ validateBeforeSave: false });
            return done(null, user);
          }

          const newUser = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            thumbnail: profile.photos?.[0]?.value || "",
            isEmailVerified: true,
            role: "user",
          });

          return done(null, newUser);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.warn("⚠️  Google OAuth env vars missing - Google login disabled");
}

// ========================
// FACEBOOK STRATEGY (optional register - crash proof)
// ========================
if (config.facebook.app_id && config.facebook.app_secret) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: config.facebook.app_id,
        clientSecret: config.facebook.app_secret,
        callbackURL: config.facebook.callback_url,
        profileFields: ["id", "displayName", "photos", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ facebookId: profile.id });

          if (user) {
            return done(null, user);
          }

          const email = profile.emails?.[0]?.value;

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
} else {
  console.warn("⚠️  Facebook OAuth env vars missing - Facebook login disabled");
}

export default passport;