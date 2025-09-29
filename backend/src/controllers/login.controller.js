const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const getLoginPage = (req, res, next) => {
  if (req.session.isLogin || req.isAuthenticated()) {
    return res.redirect('/');
  }

  res.render("loginPage/login", {
    isLogin: req.session.isLogin || false,
    error: req.query.error || "", 
    message: req.query.message || "", 
    output: {
      email: ""
    }
  });
  console.log("login page get successful");
};

const postLoginPage = (req, res, next) => {
  console.log("inside the login controller");
  
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.log("Authentication error:", err);
      return res.render('loginPage/login', {
        error: "Something went wrong. Please try again.",
        isLogin: false,
        output: {
          email: req.body.email || ""
        }
      });
    }
    
    if (!user) {

      return res.render('loginPage/login', {
        error: info ? info.message : "Email or Password Invalid!",
        isLogin: false,
        output: {
          email: req.body.email || ""
        }
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.log("Login error:", err);
        return res.render('loginPage/login', {
          error: "Login failed. Please try again.",
          isLogin: false,
          output: {
            email: req.body.email || ""
          }
        });
      }
      
      req.session.isLogin = true;
      req.session.userId = user._id;
      
      console.log("User logged in successfully:", user.email);
      
      const redirectTo = req.session.returnTo || '/';
      delete req.session.returnTo; 
      return res.redirect(redirectTo);
    });
  })(req, res, next);
};

const postLogout = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        console.log("Logout error:", err);
        return next(err);
      }
      
      req.session.isLogin = false;
      req.session.destroy((err) => {
        if (err) {
          console.log("Session destroy error:", err);
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
      });
    });
  } else {
    req.session.isLogin = false;
    req.session.destroy((err) => {
      if (err) {
        console.log("Session destroy error:", err);
      }
      res.redirect('/login');
    });
  }
};


const isAuthenticated = (req) => {
  return req.session.isLogin || req.isAuthenticated();
};

module.exports = {
  getLoginPage,
  postLoginPage, 
  postLogout,
  isAuthenticated
};