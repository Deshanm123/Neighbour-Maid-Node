// const request = require('request');

// //  recaptcha:secret key
// const recaptchaSecretKey = '6LcZo-keAAAAAA1fZIXS955CRYxmRZaeF_-pG7wx';


// const reCaptcha= (req, res, next) => {

//   if (req.body.captcha === "undefined" || req.body.captcha == '' || req.captcha === null) {
//     return res.json({ sucess: false, "msg": "please Select Captcha" });
//   }
//   // verify url
//   const verifyUrl =
//     `https://google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${req.body.captcha}&remoteip=${req.ip}`;

//   //make request to verify url
//   request(verifyUrl, async (err, response, body) => {
//     body = JSON.parse(body);
//     console.log(body);
//     //  if not successful
//     if (body.success !== undefined && !body.success) {
//         console.log('donot send mail')
//       // return res.json({ "success": false, "msg": "Failed Captcha verification" });
//     } else {
//       console.log('send the mail');
//       // mailing stuff
//     }
// })
//     next();


  
//   // } else {
//   //   // if token is not avaialbe redirect user to login and obtin the token
//   //   res.redirect('/login');
//   // }
// }


// module.exports = { reCaptcha};