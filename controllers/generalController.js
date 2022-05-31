const Coursemodel = require('../models/Coursemodel');
const Housemaid = require('../models/HouseMaid');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { mailTransporter } = require('../services/mailService');
const request = require('request');



// const maxAge = 3 * 24 * 60 * 60 ;
// const createJWToken = (id) => {
//   return jwt.sign({ id }, 'net ninja secret', {
//     expiresIn: maxAge
//   });
// };

// //encrypt password
// const encryptPassword = async (password) => {
//   const salt = await bcrypt.genSalt();
//   const hashedpass = await bcrypt.hash(password, salt);
//   return hashedpass;
// }


// // doing registration
// exports.postRegistration = async (req, res) => {
//   // TODO : serverside validation
//   const { email, userName, password, cPassword } = req.body;
//   try {
//     if (!(await Housemaid.isEmailRegistered(email))) {
//       // register
//       // encrypting password
//       let hashedPassword = await encryptPassword(password)

//       let result = await Housemaid.addHouseMaid(email, userName, hashedPassword);
//       // sucessful registration 
//       if (result.affectedRows > 0) {
//         const result = await Housemaid.selectUserIdByEmail(email);
//         const maidId = result[0].userId;
//         console.log(maidId);
//         // creating JWT
//         const jwToken = createJWToken(maidId);
//         // storing JWT inside a cookie
//         res.cookie('jwt', jwToken, { maxAge: maxAge * 1000, httpOnly: true });
//         //sucessfully created
//         res.status(201).json({ userId: maidId });

//       } else {
//         // registration failed
//         console.log(`hosemaid with email ${email} registration failed`)
//       }
//     } else {
//       console.log(`  ${email} has already registered. registration failed`)
//     }
//   } catch (e) {
//     console.log(e);
//   }
// }

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

/////////////////////////////////////// contact///////////////////////////////////////////////////////////

exports.getContact = (req, res) => {
  res.render('contact-us');
}


const recaptchaSecretKey = '6LcZo-keAAAAAA1fZIXS955CRYxmRZaeF_-pG7wx';

//  recaptcha:secret key
exports.postContact = async (req, res) => {

  try {
  if(req.body.captcha === "undefined" || req.body.captcha == '' || req.captcha === null) {
    // throw "please select captcha";
    res.status(500).send({ sucess: false, msg: "please Select Captcha" });
  }else{

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
      if (err){
        res.status(400).send({msgType: 'danger', msg: `Your message is unable to sent. Please Try again Later`});
      }else{
        res.status(200).send({ msgType: 'success',msg: `Your message is sucessfully sent.Neighbour Maid Team will contact you soon as possible..` });
      }
      // }
    })
  }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msgType: 'danger', msg: `Something went wrong With the Mail service.${err}`});
  }
}











/////////////////////////////////////// contact///////////////////////////////////////////////////////////