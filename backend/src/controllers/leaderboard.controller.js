const getleaderboardPage = (req, res, next) => {
  res.render('leaderboardPage/leaderboard');
  console.log("contest page get successful");
}

module.exports = {
  getleaderboardPage,
}