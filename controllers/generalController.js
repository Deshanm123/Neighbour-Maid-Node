const Coursemodel = require('../models/Coursemodel');
const Housemaid = require('../models/HouseMaid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { mailTransporter } = require('../services/mailService');
const request = require('request');


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
        res.cookie('jwt', jwToken, { maxAge: maxAge * 1000, httpOnly: true });
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

/////////////////////////////////////// contact///////////////////////////////////////////////////////////

exports.getContact = (req, res) => {
  res.render('contact-us');
}


const recaptchaSecretKey = '6LcZo-keAAAAAA1fZIXS955CRYxmRZaeF_-pG7wx';

//  recaptcha:secret key
exports.postContact = async (req, res) => {


  if (req.body.captcha === "undefined" || req.body.captcha == '' || req.captcha === null) {
    console.log("please select captcha")
    return res.json({ sucess: false, "msg": "please Select Captcha" });
  }
  // verify url
  const verifyUrl =
    `https://google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${req.body.captcha}&remoteip=${req.ip}`;

  //make request to verify url
  request(verifyUrl, async (err, response, body) => {
    body = JSON.parse(body);
    // console.log(body);
    //  if not successful
    if (body.success !== undefined && !body.success) {
      return res.json({ "success": false, "msg": "Failed Captcha verification" });
    }
    // sucess 
   // return res.json({ "success": true, "msg": "passed Captcha verification" });
    console.log('sending the mail')
   
    //  mail structure
      const output = `
                <p>You have a contact request from ${req.body.name} </p>
                <h2>${req.body.subject}<h2><br>
                <p>${req.body.message}</p><br><br>
                <h3>Contact Details</h3>
                <ul>
                <li>email:${req.body.email}</li>
                <li>phone:${req.body.phone}</li>
                </ul> `;
    
      try{
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
            //     //   // res.render('index', { msg: `email has been sent` });
              } catch (err) {
                  console.log(err);
                  res.status(500).send("Something went wrong With the Mail service.");
                }
            })
}











/////////////////////////////////////// contact///////////////////////////////////////////////////////////