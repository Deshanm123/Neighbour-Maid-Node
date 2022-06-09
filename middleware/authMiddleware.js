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
        res.redirect('/user/loginUser');
      } else {
        next();
      }
    })
  } else {
    // if token is not avaialbe redirect user to login and obtin the token
    res.redirect('/user/loginUser');
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
        // user table obtained  via userTb
        let user = await Housemaid.getUserInfo(decodedToken.id);
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