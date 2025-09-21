const getProblemPage = (req, res, next) => {
  res.render('problemPage/problem');
  console.log("Problem page get successful");
}

module.exports = {
  getProblemPage,
}