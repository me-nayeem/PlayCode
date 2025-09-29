const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const getSignUpPage = (req, res, next) => {
  res.render("signupPage/signup", {
    isLogin: req.session.isLogin,
    errors: "",
    oldInput: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
    },
  });
  console.log("signup page get successful");
};

const PostSignUpPage = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("username")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    const { firstName, lastName, username, email, password } = req.body;

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).render("signupPage/signup", {
        isLogin: req.session.isLength,
        errors: errors.array(),
        oldInput: {
          firstName,
          lastName,
          username,
          email,
        },
      });
    }

    try {
      console.log("Validation passed!");
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      });
      user.save().then(() => {
        console.log("saved user signup Data..");
      });
      res.redirect("/login");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

module.exports = {
  getSignUpPage,
  PostSignUpPage,
};
