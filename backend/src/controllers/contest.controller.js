const getContestPage = (req, res, next) => {
  res.render('contest/contest',  {
    isLogin: req.session.isLogin,
  });
  console.log("contest page get successful");
}

module.exports = {
  getContestPage,
}