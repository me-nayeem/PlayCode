const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth routes
router.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.isLogin = true;
    req.session.userId = req.user._id;
    res.redirect('/'); 
  }
);

// GitHub OAuth routes
router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.isLogin = true;
    req.session.userId = req.user._id;
    res.redirect('/');
  }
);


router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.redirect('/login');
  });
});

module.exports = router;