require("dotenv").config();

const path = require("path");
const express = require("express");
const passport = require('./src/config/passport');
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();

app.use((req, res, next) => {
  console.log("-------------");
  console.log(`=== REQUEST ===`);
  console.log("URL:", req.url);
  console.log("Method:", req.method);
  console.log("   ");
  next();
});

const store = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: "sessions",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join("./src/public")));

app.use(
  session({
    secret: process.env.sessionKey,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use((req, res, next) => {
  console.log("login status: ", req.session.isLogin);
  next();
});

const HomePageRouter = require("./src/routes/home.route");
const ProblemPageRouter = require("./src/routes/problem.route");
const ContestPageRouter = require("./src/routes/contest.route");
const LoginPage = require("./src/routes/login.route");
const getSignUpPage = require("./src/routes/signup.route");
const LeaderboardPageRouter = require("./src/routes/leaderboard.route");
const StorePageRouter = require("./src/routes/store.route");
const ForgotPassword = require("./src/routes/forgotpassword.route");
const AuthRouter = require("./src/routes/auth.route");

app.use(LoginPage);
app.use(getSignUpPage);
app.use(AuthRouter);
app.use(HomePageRouter);
app.use(ProblemPageRouter);
app.use(ContestPageRouter);
app.use(LeaderboardPageRouter);
app.use(StorePageRouter);
app.use(ForgotPassword);

app.use((req, res, next) => {
  if (req.session.isLogin) {
    next();
  } else {
    res.redirect("/login");
  }
});

app.use((req, res, next) => {
  res.json({ message: "page not found" });
});

const port = process.env.PORT || 5000;
const DBpath = process.env.DB_URL;
mongoose
  .connect(DBpath)
  .then(() => {
    console.log("mongoose is connected");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("error while connect mongodb, ", err);
  });
