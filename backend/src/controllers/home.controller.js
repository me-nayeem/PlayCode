const getHomePage = (req, res, next) => {
  res.render('home/home', {
    isLogin: req.session.isLogin,
  });
  console.log("home get successful");
}

const getDashBoardPage = (req, res) => {
  res.render('dashboard/dashboard', {
    isLogin: req.session.isLogin,
  });
  console.log("home get successful");
}


module.exports = {
  getHomePage,
  getDashBoardPage
}