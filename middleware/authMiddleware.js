const jwt = require('jsonwebtoken');
const Housemaid = require('../models/Housemaid');
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



//getuser //display user info 
const tokenUserInfoAccess = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if (err) {
        // console.log(err)
        res.locals.user = null;
        // move on to next handler 
        next();
      } else {
        // console.log("decoded Token " + decodedToken.id);
        let user = await Housemaid.getUserInfo(decodedToken.id)
        console.log('user from decoded Token', user[0])
        res.locals.user = user[0];
        next();
      }
    });
  } else {
    // user not logged in
    res.locals.user = null;
    next();
  }
};

















module.exports = { requireAuth, tokenUserInfoAccess };