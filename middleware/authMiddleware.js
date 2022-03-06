const jwt = require('jsonwebtoken');
// const User = require()

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exsits and is verified
  if (token) {
    jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
      if (err) {
        // token is invalid /expired
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    })
  } else {
    // if token is not avaialbe redirect user to login and obtin the token
    res.redirect('/login');
  }
}

module.exports = { requireAuth };