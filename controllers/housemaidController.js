const Coursemodel = require('../models/Coursemodel');
const Housemaid = require('../models/Housemaid');
const Houseowner = require('../models/Houseowner');
const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const moment = require('moment');

// mongoose
const mongoose = require('mongoose');
const uri = 'mongodb+srv://deshanm123:YdG5JMjZ9AE2Hvr6@cluster0.ufsym.mongodb.net/neighbourMaidChat?retryWrites=true&w=majority';
const Chat = require('../models/Chat')
const Appointment = require('../models/Appointment')
// mongoose



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


///////////////////////////////////// dashboard////////////////
// MONGODB Function
async function getAppointmentsByHousemaid(currentmaidId) {
  return new Promise((resolve, reject) => {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        Appointment.find({ 'housemaid_id': currentmaidId })
          .then(results => {
            resolve(results)
          })
      })
      .catch(err => reject(err)
      );
  });
}


async function getAppointmentsOfMaids(results) {

  let appointmentArr = [];

  for (let i = 0; i < results.length; i++) {
    let houseownerName;
    let record = await Houseowner.getHouseOwnerRecordbyId(results[i].houseownerId)
    if (record.length > 0) {
      houseownerName = record[0].userName;
    } else {
      houseownerName = 'personUnknown'
    }


    const appointment = {
      houseownerName: houseownerName,
      houseownerId: results[i].houseownerId,
      message: results[i].appointmentDescription,
      extractedDate: results[i].appointmentDateandTime.toLocaleString()
    }
    // console.log(houseOwnerName + " " + extractedDate)
    appointmentArr.push(appointment)
  }
  return appointmentArr;
}




exports.getDashboard = async (req, res) => {
  const housemaidId = res.locals.user.userId;
  let results = await getAppointmentsByHousemaid(housemaidId);
  // console.log('getAppointmentsByHousemaid')
  // console.log(results)
  let appointments = await getAppointmentsOfMaids(results);

  // console.log(appointments)
  res.render('housemaid/maid-dashboard', { appointments: appointments });
}


///////////////////////////////////// dashboard////////////////
// /////////////////////////////////////coursees sction/////////////////////////////////////////

// getting all the courses
exports.getAllCourses = async (req, res,) => {
  try {
    let page = req.query.page ? Number(req.query.page) : 1;
    if (page < 1) {
      res.status(200).redirect('/housemaid/courses?page=' + encodeURIComponent(1));
    } else {
      let courses = await Coursemodel.getAvialableCourses(page);
      res.status(200).render('housemaid/courses-list', { courses: courses.result, page: courses.page, pageCount: courses.numOfPages });
    }
  } catch (error) {
    res.status(404);
    console.log(error);
  }
}

// select course by id
exports.getSingleCourse = async (req, res) => {

  console.log(" single course view admin")
  try {
    let id = req.params.id;
    let course = await Coursemodel.selectCourseById(id);
    console.log(course)
    let courseCategoryObj = await Housemaid.getServiceCategoryById(course[0].courseCategory);
    let courseId = course[0].courseId;
    let courseCategory = courseCategoryObj[0].serviceCategoryName;
    let courseCategoryColor = courseCategoryObj[0].serviceCategoryColor;
    let courseTitle = course[0].courseTitle;
    let courseIntro = course[0].courseIntro;
    //  correct way of geeting json
    let courseParsedChapters = JSON.parse(course[0].courseDescription);
    let course_Img = course[0].course_Img;


    let numberOfChapters = Object.keys(courseParsedChapters).length;
    console.log("number of chapters " + numberOfChapters);

    console.log("req.query" + req.query);

    let page = req.query.page ? Number(req.query.page) : 1;
    console.log("page" + page)


    let chapterContent = courseParsedChapters[page - 1];
    console.log(chapterContent);
    // if (page < 1) {

    // res.status(200).redirect(`/admin/courses/viewCourse/${courseId}?page=` + encodeURIComponent(1));
    // res.status(200).redirect(`/admin/courses/viewCourse/${courseId}?page=`+1);
    // res.status(200).redirect(`https://www.google.com/`);
    // } else {
    //   let results = await Houseowner.populateDashboard(page);
    //   res.status(200).render('houseowner/houseowner-dashboard', { housemaids: results.result, page: results.page, pageCount: results.numOfPages })
    // }
    if (course == null) res.redirect('/housemaid/courses');
    else {
      res.status(200).render('housemaid/course-view', {
        courseId: courseId, courseTitle: courseTitle, courseIntro: courseIntro, courseCategory: courseCategory, courseCategoryColor: courseCategoryColor, course_Img: course_Img, chapterContent: chapterContent, page: page, pageCount: numberOfChapters
      });
    }
  } catch (error) {
    res.status(404);
    console.log(error);
  }
  //  check













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
  console.log(userId);
  // const { uFName, uLName, uDOB, uPAddress, uPhone, uNIC, uGender, uMaritalStatus, uOverview } = req.body
  try {
    let result = await Housemaid.addPersonalDetails(req.body, userId)
    if (result == null) res.redirect('/');
    else {
      let msg = ` Congratualations! We have sucessfully recorded your personal details.`
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
        let msg = ` Congratualations! We have sucessfully updated  your personal details.`
        res.status(201).send({ msg: msg });
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


// ///////////////////////////////////////////////////PORTIFOLIO///////////////////////////////////////////////////
exports.viewPortifolio = async (req, res) => {

  let userImg = null;
  let token = req.cookies.jwt;
  let userId = await this.userIdFromToken(token);
  // console.log(userId);
  let imgUrl = await Image.getProfilePhotorById(userId);

  if (imgUrl.length > 0) {
    userImg = imgUrl[0].profileImg;
  }

  let personalDetails = await Housemaid.getPersonalDetails(userId);
  let serviceDetails = await Housemaid.getServiceDetails(userId);

  res.render('housemaid/maid-my_portifolio', { profileImg: userImg, personalDetails: personalDetails, serviceDetails: serviceDetails });

}
// ///////////////////////////////////////////////////ENND OF PORTIFOLIO///////////////////////////////////////////////////

// /////////////////////////////////////////MY Services/////////////////////////////////////////////


exports.getMyService = async (req, res) => {
  let token = req.cookies.jwt;
  let userId = await this.userIdFromToken(token);

  let serviceDetails = await Housemaid.getServiceDetails(userId);
  // if user details available direct to edit page
  if (serviceDetails.length > 0) {
    res.status(200).render('housemaid/maid-my_service_edit', { serviceDetails: serviceDetails });
  } else {
    // if user is new direct to the  new entry page
    res.status(200).render('housemaid/maid-my_service');
  }


}

exports.postMyService = async (req, res) => {
  let token = req.cookies.jwt;
  let userId = await this.userIdFromToken(token);

  try {
    let result = await Housemaid.addServiceDetails(userId, req.body)
    if (result == null) res.redirect('/');
    else {
      console.log(result);
      let msg = ` Congratualations! We have sucessfully recorded your service details.`
      res.status(201).send({ msg: msg });
    }
  } catch (error) {
    res.status(404);
    console.log(error);
  }
}


exports.putEditMyService = async (req, res) => {

  try {
    // let userImg = null;
    let token = req.cookies.jwt;
    let userId = await this.userIdFromToken(token);

    // getting filled details
    let result = await Housemaid.updateServiceDetails(req.body, userId);
    console.log(result.affectedRows);

    if (result.affectedRows > 0) {
      if (result == null) res.redirect('/');
      else {
        let msg = ` Congratualations! We have sucessfully updated  your service details.`
        res.status(201).send({ msg: msg });
      }
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.log(err);
  }
  // res.status(200).render('housemaid/maid-my_account_edit', {profileImg: userImg, personalDetails: personalDetails });
}



// /////////////////////////////////////////END OF MY Services/////////////////////////////////








//////////////////////////////////CHaT///////////////////////////////////////////////////////////////




async function getchatSpaces(currentmaidId) {
  return new Promise((resolve, reject) => {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        Chat.distinct('chatParticipants.houseowner_id', { 'chatParticipants.housemaid_id': currentmaidId })
          .then(results => {

            resolve(results)
            // res.render('housemaid/maid-chat', { chatInteractions: results})
          })
      })
      .catch(err => reject(err)
      );
  });
}

async function getHouseOwners(houseownerIds) {
  let houseOwnersObjArr = [];
  for (let i = 0; i < houseownerIds.length; i++) {
    let houseownerId = houseownerIds[i];
    let results = await Houseowner.getHouseOwnerNamebyId(houseownerId)
    let userName = results[0].userName;
    const hoObj = Object.assign({}, {
      'id': houseownerId,
      'name': userName
    });
    houseOwnersObjArr.push(hoObj);
  }
  return houseOwnersObjArr;
}









exports.getChat = async (req, res) => {
  try {
    const currentmaidId = res.locals.user.userId;
    const houseownerIds = await getchatSpaces(currentmaidId);

    let houseOwnerArr = [];
    houseOwnerArr = await getHouseOwners(houseownerIds)
    console.log(houseOwnerArr)
    if (houseOwnerArr.length > 0) {
      res.render('housemaid/maid-chat', { houseOwnerArr: houseOwnerArr, currentmaidId: currentmaidId })
    } else {
      res.render('housemaid/maid-chat', { houseOwnerArr: '', currentmaidId: currentmaidId })
    }
  } catch (err) {
    console.log(err)
  }
}
//////////////////////////////////End of CHaT///////////////////////////////////////////////////////////////



///////Video////////
exports.getVideoChat = (req, res) => {
  let houseownerId = req.params.houseownerId;
  let currentId = res.locals.user.userId;
  res.status(200).render('housemaid/maid-video-chat', { currentId: currentId, otherPartyId: houseownerId });
}

///////Video////////