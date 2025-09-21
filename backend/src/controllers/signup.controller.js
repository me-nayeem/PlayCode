const getSignUpPage = (req, res, next) => {
  res.render('signupPage/signup');
  console.log("signup page get successful");
}

module.exports = {
  getSignUpPage,
}