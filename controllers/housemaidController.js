const Coursemodel = require('../models/Coursemodel');
const Housemaid = require('../models/Housemaid');
const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');


exports.userIdFromToken = async (token) => {
  // console.log(token)
  let userId = null;
  if (token) {
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if (!err) {
        userId = decodedToken.id;
      }
    });
  }
  return userId;
};


// logout function
exports.logOut = (req, res) => {
  // we cant delete the cookie frm server 
  // but we can replace the cookie with soontobe expire cookie
  res.cookie('jwt', '', { maxAge: 1 }); //giving a blank value andone millisec duration
  res.redirect('/login'); //redirect to login

}
// /////////////////////////////////////coursees sction/////////////////////////////////////////

// getting all the courses
exports.getAllCourses = async (req, res,) => {
  try {
    let courses = await Coursemodel.getAvialableCourses();

  } catch (error) {
    res.status(404);
    console.log(error);
  }
}

// select course by id
exports.getSingleCourse = async (req, res) => {
  // please note that add function check numerical input if it;s string return 404
  id = req.params.id;
  try {
    let course = await Coursemodel.selectCourseById(id);
    if (course == null) res.redirect('/');
    else {
      res.status(200).render('housemaid/course-view', { courses: course });
    }
  } catch (error) {
    res.status(404);
    console.log(error);
  }
}
// /////////////////////////////////////coursees sction/////////////////////////////////////////

////////////////////////////////////////myacccount section///////////////////////////////////////


// profile image Upload
exports.uploadProfileImg = async (req, res) => {
  if (req.file) {
    try {
      let token = req.cookies.jwt;
      let userId = await this.userIdFromToken(token);
      // console.log(req.file.filename)
      let result = await Image.uploadImage(req.file.filename, userId);
      // console.log("restlt " + result)
      if (result.affectedRows > 0) {
        res.redirect('back');
        // res.status(201).json({ message: "Image uploaded successfully", url: req.file });
        // res.status(201).json({ message: "Image uploaded successfully", url: req.file });
      }
    } catch (err) {
      console.log(err + `removing ${req.file.filename}`);
      fs.unlink(path.join(`./uploads`, req.file.filename), err => {
        console.error(err);
      })
      // remove img
      res.status(500).json({
        message: "Something went Wrong"
      });
    }
  } else {
    throw 'image is not found';
  }
}

// adding personal details
exports.addPersonalDetails = async (req, res) => {
  let token = req.cookies.jwt;
  let userId = await this.userIdFromToken(token);
  console.log(req.body);
  // const { uFName, uLName, uDOB, uPAddress, uPhone, uNIC, uGender, uMaritalStatus, uOverview } = req.body
  try {
    let result = await Housemaid.addPersonalDetails(req.body, userId)
    if (result == null) res.redirect('/');
    else {
      let msg = ` Congratualations user-${userId}! We have sucessfully recorded your personal details.`
      res.status(201).send({ msg: msg });
    }
  } catch (error) {
    res.status(404);
    console.log(error);
  }
}


// Mya account
exports.getAccount = async (req, res) => {
  let userImg = null;
  let token = req.cookies.jwt;
  let userId = await this.userIdFromToken(token);
  // console.log(userId);
  let imgUrl = await Image.getProfilePhotorById(userId);

  if (imgUrl.length > 0) {
    userImg = imgUrl[0].profileImg;
  }
  let personalDetails = await Housemaid.getPersonalDetails(userId);
  // if user details available direct to edit page
  if (personalDetails.length > 0) {
    res.status(200).render('housemaid/maid-my_account_edit', { profileImg: userImg, personalDetails: personalDetails });
  } else {
    // if user is new direct to the  new entry page
    res.status(200).render('housemaid/maid-my_account', { profileImg: userImg });
  }
}

// exports.geteditAccount = async (req, res) => {
//   let userImg = null;
//   let token = req.cookies.jwt;
//   let userId = await this.userIdFromToken(token);
//   // console.log(userId);
//   let imgUrl = await Image.getProfilePhotorById(userId);
//   if (imgUrl.length > 0) {
//     userImg = imgUrl[0].profileImg;
//   }
//   // getting filled details
//   let personalDetails = await Housemaid.getPersonalDetails(userId);
//   // console.log(personalDetails);
//   res.status(200).render('housemaid/maid-my_account_edit', { profileImg: userImg, personalDetails: personalDetails });
// }


exports.puteditAccount = async (req, res) => {

  try {

    // let userImg = null;
    let token = req.cookies.jwt;
    let userId = await this.userIdFromToken(token);
    console.log(req.body);
    // getting filled details
    let result = await Housemaid.updatePersonalDetails(req.body, userId);
    // console.log(result.affectedRows);

    if (result.affectedRows > 0) {
      if (result == null) res.redirect('/');
      else {
        let msg = ` Congratualations user:${userId}! We have sucessfully updated  your personal details.`
        res.status(200).send({ msg: msg });
      }
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.log(err);
  }
  // res.status(200).render('housemaid/maid-my_account_edit', {profileImg: userImg, personalDetails: personalDetails });
}




// Display profile Image
// exports.uploadProfileImg = async (req, res) => {
//   if (req.file) {
//     try {
//       // console.log(req.file.filename)
//       let result = await Image.uploadImage(req.file.filename);
//       // console.log("restlt " + result)
//       if (result.affectedRows > 0) {
//         res.status(201).json({ message: "Image uploaded successfully", url: req.file });
//       }
//     } catch (err) {
//       console.log(err + `removing ${req.file.filename}`);
//       fs.unlink(path.join(`./uploads`, req.file.filename), err => {
//         console.error(err);
//       })
//       // remove img
//       res.status(500).json({
//         message: "Something went Wrong"
//       });
//     }
//   } else {
//     throw 'image is not found';
//   }
// }