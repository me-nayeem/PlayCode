require('dotenv').config();

console.log('=== DEBUGGING OAUTH CREDENTIALS ===');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET');
console.log('GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID);
console.log('GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET ? 'SET' : 'NOT SET');
console.log('CALLBACK_URL:', process.env.CALLBACK_URL);
console.log('=====================================');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');


passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new LocalStrategy(
  { 
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        return done(null, false, { message: 'Email or Password Invalid!' });
      }
      
      if (user.provider && user.provider !== 'local') {
        return done(null, false, { 
          message: `Please sign in using ${user.provider}` 
        });
      }
      
      if (!user.password) {
        return done(null, false, { 
          message: 'Please sign in using your social account' 
        });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Email or Password Invalid!' });
      }
      
      return done(null, user);
    } catch (error) {
      console.log("Local strategy error:", error);
      return done(error);
    }
  }
));


// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.CALLBACK_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      user.googleId = profile.id;
      user.avatar = profile.photos[0].value;
      await user.save();
      return done(null, user);
    }

    user = new User({
      googleId: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      username: profile.emails[0].value.split('@')[0], // Generate username from email
      avatar: profile.photos[0].value,
      provider: 'google',
      isVerified: true
    });

    await user.save();
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.CALLBACK_URL}/auth/github/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    
    if (email) {
      user = await User.findOne({ email });
      if (user) {
        user.githubId = profile.id;
        user.avatar = profile.photos[0].value;
        await user.save();
        return done(null, user);
      }
    }

    user = new User({
      githubId: profile.id,
      firstName: profile.displayName || profile.username,
      lastName: '',
      email: email || `${profile.username}@github.local`,
      username: profile.username,
      avatar: profile.photos[0].value,
      provider: 'github',
      isVerified: true
    });

    await user.save();
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

module.exports = passport;