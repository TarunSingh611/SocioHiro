const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

// For Instagram Graph API, we use Facebook OAuth since Instagram Business accounts
// are connected to Facebook Pages

passport.use(new FacebookStrategy({
    clientID: process.env.INSTAGRAM_APP_ID,
    clientSecret: process.env.INSTAGRAM_APP_SECRET,
    callbackURL: process.env.INSTAGRAM_CALLBACK_URL,
    scope: ['pages_show_list', 'pages_read_engagement', 'instagram_basic', 'instagram_content_publish', 'pages_manage_posts', 'pages_manage_metadata'],
    profileFields: ['id', 'displayName', 'photos', 'emails']
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      // Check if user already exists
      let user = await User.findOne({ facebookId: profile.id });
      
      if (!user) {
        // Create new user
        user = new User({
          facebookId: profile.id,
          username: profile.displayName,
          accessToken: accessToken,
          refreshToken: refreshToken,
          profilePic: profile.photos?.[0]?.value
        });
        await user.save();
      } else {
        // Update existing user's tokens
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        user.username = profile.displayName;
        user.profilePic = profile.photos?.[0]?.value;
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport; 