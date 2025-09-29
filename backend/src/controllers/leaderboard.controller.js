const getleaderboardPage = (req, res, next) => {
  res.render('leaderboardPage/leaderboard',  {
    isLogin: req.session.isLogin,
  });
  console.log("contest page get successful");
}

module.exports = {
  getleaderboardPage,
}