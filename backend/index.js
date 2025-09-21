const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

app.use((req, res, next) => {
  console.log("-------------");
  console.log(`=== REQUEST ===`);
  console.log("URL:", req.url);
  console.log("Method:", req.method);
  console.log("   ");
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join("./src/public")));

app.set("view engine", "ejs");
app.set("views", "src/views");

const HomePageRouter = require("./src/routes/home.route");
const ProblemPageRouter = require("./src/routes/problem.route");
const ContestPageRouter = require("./src/routes/contest.route");
const getLoginPage = require("./src/routes/login.route");
const getSignUpPage = require("./src/routes/signup.route");
const LeaderboardPageRouter = require("./src/routes/leaderboard.route");
const StorePageRouter = require("./src/routes/store.route");

app.use(HomePageRouter);
app.use(ProblemPageRouter);
app.use(ContestPageRouter);
app.use(LeaderboardPageRouter);
app.use(StorePageRouter);
app.use(getLoginPage);
app.use(getSignUpPage);

app.use((req, res, next) => {
  res.json({ message: "page not found" });
});

const port = process.env.PORT || 5000;
const DBpath = process.env.DB_URL;
mongoose.connect(DBpath).then(() => {
  console.log("mongoose is connected");
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
