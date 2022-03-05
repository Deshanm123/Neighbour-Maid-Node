

//get registrationn page
exports.getRegistration = async (req, res) => {
  res.render('register');
}
// doing registration
exports.postRegistration = async (req, res) => {
  console.log(req.body);
}

// // adding a user
// exports.getRegistration = async (req, res) => {
//   res.render('register');
// }