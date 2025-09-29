const getProblemPage = (req, res, next) => {
  res.render('problemPage/problem',  {
    isLogin: req.session.isLogin,
  });
  console.log("Problem page get successful");
}

module.exports = {
  getProblemPage,
}