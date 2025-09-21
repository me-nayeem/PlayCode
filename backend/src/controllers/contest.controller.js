const getContestPage = (req, res, next) => {
  res.render('contest/contest');
  console.log("contest page get successful");
}

module.exports = {
  getContestPage,
}