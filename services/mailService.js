require('dotenv').config();
const nodemailer = require('nodemailer');


let mailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, //587
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_SERVICE_ADDRESS, // generated ethereal user- process.env.EMAIL,
    pass: process.env.MAIL_SERVICE_PASS, // generated ethereal password
  },
  // enable below only if u are running on local host
  tls: { rejectUnauthorized: true }
});











module.exports = { mailTransporter };