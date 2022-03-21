const User = require('../models/User');
const { mailTransporter } = require('../services/mailService')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




// UTLITY FUNCTIONS//

//encrypt password
const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const hashedpass = await bcrypt.hash(password, salt);
  return hashedpass;
}

async function generateEmailVerificationCode() {
  // generatte seven digit password
  return Math.floor(Math.random() * 10000000 + 1);
}

const maxAge = 10 * 24 * 60 * 60; //millsieconds
const createJWToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};



// ////////////////////////////////////REGISTER/////////////////////////////////////////////////////
//get registration page
exports.getRegistrationUser = async (req, res) => {
  res.render('register-user');
}

exports.postRegistrationUser = async (req, res) => {
  console.log(req.body);
  const { email, userName, password, cPassword, userType } = req.body;

  try {
    let userRegisteredResults = await User.isEmailRegistered(email);
    console.log(userRegisteredResults);
    if (userRegisteredResults.length === 0) {
      console.log('user can register');
      // encrypting password
      let hashedPassword = await encryptPassword(password);
      let emailVerificationCode = await generateEmailVerificationCode();
      console.log('Email-erification-code:' + emailVerificationCode);

      // Mail
      let mailOption = {
        from: 'paypaldeshanm123@gmail.com', // sender address
        to: `${email}`, // list of receivers
        subject: "Account Validation", // Subject line
        text: "Hello world?", // plain text body
        html:
          `
        <h1>Please  verify the account by clicking entering the verficationh code </h1><br>
        <h1>emailVerificationCode = ${emailVerificationCode}</h1>
        `, // html body
      }

      // perform Mail
      mailTransporter.sendMail(mailOption, async (err, mailResult) => {
        if (err) { throw err }
        else {
          console.log("Verification Message sent: %s", mailResult);
          //if verification code sent sucessful then register the account as not verfied
          let result = await User.addUser(email, userName, hashedPassword, userType, emailVerificationCode);
          //sucessful registration 
          if (result.affectedRows > 0) {
            const result = await User.selectUserIdByEmail(email);
            const userId = result[0].userId;
            // creating JWT
            const jwToken = createJWToken(userId);
            // storing JWT inside a cookie
            res.cookie('jwt', jwToken, { maxAge: maxAge * 1000, httpOnly: true });
            //sucessfully created
            // res.status(201).json({ userId: userId });
            res.status(201).send({ msgType: "success", msg: `Congratulations! your account has been successfully created. Please Login ` });

          } else {
            // registration failed
            console.log(`user  with email ${email} registration failed`)
          }
        }
      });


    } else {
      // console.log('user already in the dblist ');
      // if (userRegisteredResults[0].userEmailVeifiedStatus == 0) {
      //   console.log('user have to verify  the verification code')
      // } else {
      console.log('User is already registered member.direct to login')
      res.status(200).send({ msgType: "danger", msg: `${email} is already registered. Please Login ` });
      // }

    }
  } catch (e) {
    console.log(e);
  }
  // res.render('register-houseowner');
}






///////////////////////////////////////////////login//////////////////////////////////

exports.getloginUser = async (req, res) => {
  res.render('login-user');

};


exports.postLoginUser = async (req, res) => {

  // TODO : serverside validation
  const { email, password } = req.body;
  //check user email already exists
  try {
    let userRegisteredResults = await User.isEmailRegistered(email);
    console.log(userRegisteredResults);
    if (userRegisteredResults.length === 0) {
      console.log('user is not registered to login')
      res.status(200).send({ msgType: "danger", msg: `${email} is not registered. Please Register` });
    } else {
      if (userRegisteredResults[0].userEmailVeifiedStatus == 1) {
        // verified user -get userType
        const userRecord = await User.getUserByEmail(email);
        const isValidPassword = await bcrypt.compare(password, userRecord[0].userPassword);
        if (isValidPassword) {
          // console.log(userRecord);
          // creating JWT
          console.log(userRecord[0].userId);
          const jwToken = createJWToken(userRecord[0].userId);
          // storing JWT inside a cookie
          res.cookie('jwt', jwToken, { maxAge: maxAge, httpOnly: true });
          console.log(" sucess login " + jwToken);
          //sucessfully created
          // this was earlier used-must use stringify
          res.status(200).send(JSON.stringify({ userType: userRecord[0].userRole, userId: userRecord[0].userId }));
          // res.status(200).send({ userType: userRecord[0].userRole, userId: userRecord[0].userId });
          // res.status(200).send({ userType: userRecord[0].userRole, userId: userRecord[0].userId });
          // res.status(303).redirect('/housemaid');
          // res.render('housemaid/maid-dashboard', { user: 'user' });

        } else {
          console.log('Please enter the correct password');
        }

      } else {
        console.log('user have to verify  the verification code')

        // res.status(200).send({ msgType: "danger", msg: `${email} is already registered. Please Login ` });
      }
    }

  } catch (e) {
    console.log(e);
  }

}