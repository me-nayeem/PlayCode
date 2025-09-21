const getHomePage = (req, res, next) => {
  res.render('home/home');
  console.log("home get successful");
}


module.exports = {
  getHomePage,
}