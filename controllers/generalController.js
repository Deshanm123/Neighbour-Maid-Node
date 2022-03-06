const Coursemodel = require('../models/Coursemodel');
const Housemaid = require('../models/HouseMaid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// create json web token for 3 days
const maxAge = 3 * 24 * 60 * 60;
const createJWToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};

//encrypt password
const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const hashedpass = await bcrypt.hash(password, salt);
  return hashedpass;
}

//get registration page
exports.getRegistration = async (req, res) => {
  res.render('register');
}
//get login page
exports.getlogin = async (req, res) => {
  res.render('login');
}


// doing registration
exports.postRegistration = async (req, res) => {
  // TODO : serverside validation
  const { email, userName, password, cPassword } = req.body;
  try {
    if (!(await Housemaid.isEmailRegistered(email))) {
      // register
      // encrypting password
      let hashedPassword = await encryptPassword(password)

      let result = await Housemaid.addHouseMaid(email, userName, hashedPassword);
      // sucessful registration 
      if (result.affectedRows > 0) {
        const result = await Housemaid.selectUserIdByEmail(email);
        const maidId = result[0].userId;
        console.log(maidId);
        // creating JWT
        const jwToken = createJWToken(maidId);
        // storing JWT inside a cookie
        res.cookie('jwt', jwToken, { maxAge: maxAge, httpOnly: true });
        //sucessfully created
        res.status(201).json({ userId: maidId });

      } else {
        // registration failed
        console.log(`hosemaid with email ${email} registration failed`)
      }
    } else {
      console.log(`  ${email} has already registered. registration failed`)
    }
  } catch (e) {
    console.log(e);
  }
}

// DOING LOGIN
exports.postLogin = async (req, res) => {
  // TODO : serverside validation
  const { email, password } = req.body;
  //check user email already exists
  if (await Housemaid.isEmailRegistered(email)) {

    const user = await Housemaid.getUserByEmail(email);
    const isValidPassword = await bcrypt.compare(password, user[0].userPassword);
    if (isValidPassword) {
      // let resData ={
      //   test:"test"
      // }
      // creating JWT
      const jwToken = createJWToken(user[0].userId);
      // storing JWT inside a cookie
      res.cookie('jwt', jwToken, { maxAge: maxAge, httpOnly: true });

      console.log(" sucess login " + jwToken);
      //sucessfully created
      // res.status(200).json({ userId: user[0].userId });
      res.status(200).send(JSON.stringify({ userId: user[0].userId }));

    } else {
      console.log('Please enter the correct password');
      
     }
  } else {
    console.log(`${email} is not registered.login failed`);
  }
}

