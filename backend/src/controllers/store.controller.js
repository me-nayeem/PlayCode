const getStorePage = (req, res, next) => {
  res.render('store/store',  {
    isLogin: req.session.isLogin,
  });
  console.log("store page get successful");
}

module.exports = {
  getStorePage,
}