const Coursemodel = require('../models/Coursemodel');
const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
// getting all the courses
exports.getAllCourses = async (req, res,) => {
  try {
    let courses = await Coursemodel.getAvialableCourses();
    res.status(200).render('housemaid/courses-list', { courses: courses });
    // res.status(200).json({ courses: courses });
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
exports.addDetails = async (req, res) => {
  // please note that add function check numerical input if it;s string return 404
  console.log(req.body);
  const { uFName, uLName, uDOB, uPAddress, uPhone, uNIC, uGender, uMaritalStatus, uOverview } = req.body
  // try {
  //   let course = await Coursemodel.selectCourseById(id);
  //   if (course == null) res.redirect('/');
  //   else {
  //     res.status(200).render('housemaid/course-view', { courses: course });
  //   }
  // } catch (error) {
  //   res.status(404);
  //   console.log(error);
  // }
}




// logout function
exports.logOut = (req, res) => {
  // we cant delete the cookie frm server 
  // but we can replace the cookie with soontobe expire cookie
  res.cookie('jwt', '', { maxAge: 1 }); //giving a blank value andone millisec duration
  res.redirect('/login'); //redirect to login

}


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

  res.status(200).render('housemaid/maid-my_account', { profileImg: userImg });

}


// profile image Upload
exports.uploadProfileImg = async (req, res) => {
  if (req.file) {
    try {
      // console.log(req.file.filename)
      let result = await Image.uploadImage(req.file.filename,1);
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