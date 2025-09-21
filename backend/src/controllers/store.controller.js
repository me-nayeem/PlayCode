const getStorePage = (req, res, next) => {
  res.render('store/store');
  console.log("store page get successful");
}

module.exports = {
  getStorePage,
}