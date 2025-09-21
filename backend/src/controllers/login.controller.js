const getLoginPage = (req, res, next) => {
  res.render('loginPage/login');
  console.log("login page get successful");
}

module.exports = {
  getLoginPage,
}