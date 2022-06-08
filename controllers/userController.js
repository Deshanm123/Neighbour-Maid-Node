const User = require('../models/User');
const Housemaid = require('../models/Housemaid');
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
// without mail registration
exports.postRegistrationUser = async (req, res) => {
  console.log("POST REGISTRATION USER")
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

      // // Mail
      // let mailOption = {
      //   from: 'paypaldeshanm123@gmail.com', // sender address
      //   to: `${email}`, // list of receivers
      //   subject: "Account Validation", // Subject line
      //   text: "Hello world?", // plain text body
      //   html:
      //     `
      //   <h1>Please  verify the account by clicking entering the verficationh code </h1><br>
      //   <h1>emailVerificationCode = ${emailVerificationCode}</h1>
      //   `, // html body
      // }

      // // perform Mail
      // mailTransporter.sendMail(mailOption, async (err, mailResult) => {
      //   if (err) { throw err }
      //   else {
      //     console.log("Verification Message sent: %s", mailResult);
      //     //if verification code sent sucessful then register the account as not verfied
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
        res.status(401).json({ msgType: "danger", msg: `user  with email ${email} registration failed ` });
      }
      //   }
      // });
    } else {
      // console.log('user already in the dblist ');
      // if (userRegisteredResults[0].userEmailVeifiedStatus == 0) {
      //   console.log('user have to verify  the verification code')
      // } else {
      console.log('User is already registered member.direct to login')
      res.status(401).json({ msgType: "danger", msg: `${email} is already registered. Please <a href="/user/userLogin">Login</a> ` });
      // }

    }
  } catch (e) {
    res.status(401).json({ msgType: "danger", msg: `${e.message} ` });
  }
  // res.render('register-houseowner');
}

// exports.postRegistrationUser = async (req, res) => {
//   console.log("POST REGISTRATION USER")
//   console.log(req.body);
//   const { email, userName, password, cPassword, userType } = req.body;

//   try {
//     let userRegisteredResults = await User.isEmailRegistered(email);
//     console.log(userRegisteredResults);
//     if (userRegisteredResults.length === 0) {
//       console.log('user can register');
//       // encrypting password
//       let hashedPassword = await encryptPassword(password);
//       let emailVerificationCode = await generateEmailVerificationCode();
//       console.log('Email-erification-code:' + emailVerificationCode);

//       // Mail
//       let mailOption = {
//         from: 'paypaldeshanm123@gmail.com', // sender address
//         to: `${email}`, // list of receivers
//         subject: "Account Validation", // Subject line
//         text: "Hello world?", // plain text body
//         html:
//           `
//         <h1>Please  verify the account by clicking entering the verficationh code </h1><br>
//         <h1>emailVerificationCode = ${emailVerificationCode}</h1>
//         `, // html body
//       }

//       // perform Mail
//       mailTransporter.sendMail(mailOption, async (err, mailResult) => {
//         if (err) { throw err }
//         else {
//           console.log("Verification Message sent: %s", mailResult);
//           //if verification code sent sucessful then register the account as not verfied
//           let result = await User.addUser(email, userName, hashedPassword, userType, emailVerificationCode);
//           //sucessful registration 
//           if (result.affectedRows > 0) {
//             const result = await User.selectUserIdByEmail(email);
//             const userId = result[0].userId;
//             // creating JWT
//             const jwToken = createJWToken(userId);
//             // storing JWT inside a cookie
//             res.cookie('jwt', jwToken, { maxAge: maxAge * 1000, httpOnly: true });
//             //sucessfully created
//             // res.status(201).json({ userId: userId });
//             res.status(201).send({ msgType: "success", msg: `Congratulations! your account has been successfully created. Please Login ` });

//           } else {
//             // registration failed
//             console.log(`user  with email ${email} registration failed`)
//             res.status(401).json({ msgType: "danger", msg: `user  with email ${email} registration failed ` });
//           }
//         }
//       });
//     } else {
//       // console.log('user already in the dblist ');
//       // if (userRegisteredResults[0].userEmailVeifiedStatus == 0) {
//       //   console.log('user have to verify  the verification code')
//       // } else {
//       console.log('User is already registered member.direct to login')
//       res.status(401).json({ msgType: "danger", msg: `${email} is already registered. Please Login ` });
//       // }

//     }
//   } catch (e) {
//     console.log(e);
//   }
//   // res.render('register-houseowner');
// }






///////////////////////////////////////////////login//////////////////////////////////

exports.getloginUser = async (req, res) => {
  res.render('login-user');

};


exports.postLoginUser = async (req, res) => {
  console.log("POST LOGIN USER")

  // TODO : serverside validation
  const { email, password } = req.body;
  //check user email already exists
  try {
    let userRegisteredResults = await User.isEmailRegistered(email);
    console.log(userRegisteredResults);
    if (userRegisteredResults.length === 0) {
      console.log('user is not registered to login')

      res.status(401).json({ msgType: "danger", msg: `UNAUTHORIZED:${email} is not registered. Please Register` });
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

          res.status(200).json({ userType: userRecord[0].userRole, userId: userRecord[0].userId });

        } else {
          res.status(401).send({ msgType: "danger", msg: 'Please enter the correct password' });
        }

      } else {
        res.status(403).send({
          msgType: "danger", msg: `user have to verify  the verification code.click <a href='/user/verifyUser/${userRegisteredResults[0].userId}'> here</a> to verify`
        })
      }
    }

  } catch (err) {
    console.log(err);
    res.status(406).send({ msgType: "danger", msg: `LOGIN ERROR: ${err.message}.` });
  }

}
///////////////////////getverificationCodeInput
exports.getverificationCodeInput = (req, res) => {
  res.render('verification-input');

};
exports.postverificationCodeInput = async (req, res) => {
  console.log("called POST VERIFICATION")
  const { verificationCodeInput } = req.body;
  const { userId } = req.params;

  try {

    let userRegisteredResults = await Housemaid.getUserInfo(userId);
    console.log(userRegisteredResults);
    // if user is not verified
    if (userRegisteredResults[0].userEmailVeifiedStatus == 0) {
      // check matching
      if (userRegisteredResults[0].userEmailVerificationCode == verificationCodeInput.trim()) {
        console.log("user code is verified")
        let verifyResults = await User.verifyUserbyId(userId);
        console.log('verify results');
        console.log(verifyResults);
        if (verifyResults.changedRows > 0) {
          res.status(200).send({ msgType: "success", msg: "Congratulations! your account has been successfully verified." });
        }
      } else {  
        // not matching
        res.status(401).send({ msgType: "danger", msg: "user verification code is incorrect." });
      }
    } else {
      // user already verfied
      console.log("user already verified")
      res.status(401).send({ msgType: "danger", msg: 'user is already verified' });
    }

  } catch (err) {
    console.log(err);
    res.status(406).send({ msgType: "danger", msg: `verification  ERROR: ${err.message}.` });
  }

};

// contact us page


exports.getContact = (req, res) => {
  res.render('contact-us');
}



//  recaptcha:secret key
exports.postContact = async (req, res) => {
  console.log("contact us ")
  const recaptchaSecretKey = '6LcZo-keAAAAAA1fZIXS955CRYxmRZaeF_-pG7wx';

  try {
    if (req.body.captcha === "undefined" || req.body.captcha == '' || req.captcha === null) {
      // throw "please select captcha";
      res.status(500).send({ sucess: false, msg: "please Select Captcha" });
    } else {

      const verifyUrl =
        `https://google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${req.body.captcha}&remoteip=${req.ip}`;

      //make request to verify url
      request(verifyUrl, async (err, response, body) => {
        body = JSON.parse(body);
        //  if not successful
        if (body.success !== undefined && !body.success) {
          // return res.json({ "success": false, "msg": "Failed Captcha verification" });
          res.status(500).send({ msgType: 'danger', msg: `Failed Captcha verification` });
        }
        //  mail structure
        const output = `
    <p>You have a contact request from ${req.body.name} </p>
    <h2>${req.body.subject}<h2><br><p>${req.body.message}</p><br><br>
    <h3>Contact Details</h3>
      <ul><li>email:${req.body.email}</li><li>phone:${req.body.phone}</li></ul> 
      `;

        // sending mail
        let info = await mailTransporter.sendMail({
          from: `NeighbourMaidConsumer" <${req.body.email}>`, // sender address
          to: "deshanm123@gmail.com", // list of receivers rocess.env.EMAIL,
          subject: `Contact Form -${req.body.subject}`, // Subject line
          text: "Hello world?", // plain text body
          html: output, // html body
        });
        // mail sent id and stattus
        console.log("Message sent: %s", info.messageId);
        if (err) {
          res.status(400).send({ msgType: 'danger', msg: `Your message is unable to sent. Please Try again Later` });
        } else {
          res.status(200).send({ msgType: 'success', msg: `Your message is sucessfully sent.Neighbour Maid Team will contact you soon as possible..` });
        }
        // }
      })
    }
  } catch (err) {

    res.status(500).send({ msgType: 'danger', msg: `Something went wrong With the Mail service.${err}` });
  }
}
















// ////////////////////logout
exports.logOut = (req, res) => {
  // we cant delete the cookie frm server 
  // but we can replace the cookie with soontobe expire cookie
  res.cookie('jwt', '', { maxAge: 1 }); //giving a blank value andone millisec duration
  res.redirect('/user/loginUser'); //redirect to login

}