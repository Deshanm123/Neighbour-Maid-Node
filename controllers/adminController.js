
const Coursemodel = require('../models/Coursemodel');
const uuid = require('uuid');
const moment = require('moment');
const { Admin } = require('mongodb');
const Housemaid = require('../models/Housemaid');
const Houseowner = require('../models/Houseowner');
const User = require('../models/User');
const Image = require('../models/Image');


async function getCourseswithCategoryNames(courses) {
  let modifiedCoursesArr = [];
  for (let i = 0; i < courses.length; i++) {

    let courseCategory = await Housemaid.getServiceCategoryById(courses[i].courseCategory)
    console.log("courseCategory")
    console.log(courseCategory)
    let course = {
      courseId: courses[i].courseId,
      courseTitle: courses[i].courseTitle,
      courseCategory: courseCategory[0].serviceCategoryName,
      courseIntro: courses[i].courseIntro,
      courseDescription: courses[i].courseDescription,
      course_Img: courses[i].course_Img
    }
    console.log(course)
    modifiedCoursesArr.push(course)
  }
  console.log(modifiedCoursesArr);
  return modifiedCoursesArr;
}


exports.getAllCourses = async (req, res) => {
  try {
    let courses = await Coursemodel.getAvialableCoursesAdmin();
    // console.log(courses)
    let coursesWithCategory = await getCourseswithCategoryNames(courses);
    console.log(coursesWithCategory)
    // res.status(200).render('admin/admin-courses', { courses: courses ,alert:{} });
    res.status(200).render('admin/admin-courses', { courses: coursesWithCategory, alert: '' });
    // res.status(200).json({ courses: courses });
  } catch (err) {
    res.status(401).send({ msgType: "danger", msg: `${err.message}` });;
  }
}

exports.deleteCourse = async (req, res) => {
  // res.send(`Record with course Id  ${courseId} has been sucessfully removed.`);
  try {
    let id = req.params.id;
    let result = await Coursemodel.removeCourse(id);
    let courses = await Coursemodel.getAvialableCoursesAdmin();
    if (result.affectedRows > 0) {
      // res.status(200).render('admin/admin-courses', { courses: courses ,alert:{msg:msg ,type:success} });
      res.status(200).render('admin/admin-courses',
        {
          courses: courses,
          alert: {
            msgType: 'success',
            msg: `course with course Id  ${id} has been sucessfully Removed.`
          }
        });
      // res.redirect('/admin/courses');
      // res.status(200).json({ courses: courses });

    } else {
      res.status(401).render('admin/admin-courses',
        {
          courses: courses,
          alert: {
            msgType: 'danger',
            msg: 'Course is not Removed'
          }
        });
    }
  } catch (err) {
    res.status(401).render('admin/admin-courses',
      {
        courses: courses,
        alert: {
          msgType: 'danger',
          msg: err.message
        }
      });
  }
}




// view single course
exports.getSingleCourse = async (req, res) => {
  // please note that add function check numerical input if it;s string return 404
  console.log(" single course view admin")
  let id = req.params.id;
  try {
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
    if (course == null) res.redirect('/admin/courses/');
    else {
      res.status(200).render('admin/admin-course-view', {
        courseId: courseId, courseTitle: courseTitle, courseIntro: courseIntro, courseCategory: courseCategory, courseCategoryColor: courseCategoryColor, course_Img: course_Img, chapterContent: chapterContent, page: page, pageCount: numberOfChapters
      });
    }
  } catch (error) {
    res.status(404);
    console.log(error);
  }
}


// adding a course
exports.getAddCourse = async (req, res,) => {
  try {
    // getting service categories
    let serviceResults = await Housemaid.viewServiceCategories();
    console.log(serviceResults);
    // res.render('admin/admin-services', { serviceCategory: serviceResults });




    res.status(200).render('admin/admin-course-add', { course: new Coursemodel(), servicesList: serviceResults, alert: '' });
  } catch (error) {
    res.status(404);
    console.log(error);
  }
}

// post add course
exports.postAddCourse = async (req, res) => {
  try {
    // getting data from POST
    console.log("post add course")
    if (req.fileError) { throw req.fileError }

    let imgFileName;
    if (req.file) {
      imgFileName = req.file.filename;
    } else {
      imgFileName = '';
    }
    const { courseTitle, courseIntro, courseCategory, chapters } = req.body;


    console.log(chapters)
    // the below format is essential fo the mysql
    // let courseDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    // let course = new Coursemodel(courseCategory, courseTitle, courseIntro, chapters, imgFileName);

    let result = await Coursemodel.addCourse(courseCategory, courseTitle, courseIntro, chapters, imgFileName);
    //   console.log(result)
    if (result.affectedRows > 0) {
      res.status(201).json({ msgType: 'success', msg: `${courseTitle} course has been sucessfully added.` });
    } else {
      //  406 Not Acceptable Not sure
      res.status(405).send({ msgType: "fail", msg: `Error: ${courseTitle} course is not added .` });
    }
  } catch (e) {
    console.log(e);
  }
}


// get update course
exports.getEditCourse = async (req, res,) => {
  try {
    let courseIdVal = req.params.id;
    let course = await Coursemodel.selectCourseById(courseIdVal);
    console.log(course)
    let serviceResults = await Housemaid.viewServiceCategories();
    console.log(serviceResults);

    let courseId = course[0].courseId;
    let courseCategory = course[0].courseCategory;
    let courseTitle = course[0].courseTitle;
    let courseIntro = course[0].courseIntro;
    //  correct way of geeting json
    let courseParsedChapters = JSON.parse(course[0].courseDescription);
    let numberOfChapters = Object.keys(courseParsedChapters).length;
    let course_Img = course[0].course_Img;
    console.log(courseParsedChapters)

    res.status(200).render('admin/admin-course-edit', {
      courseId: courseId, courseTitle: courseTitle, courseIntro: courseIntro, courseCategory: courseCategory, course_Img: course_Img, chapters: courseParsedChapters, pageCount: numberOfChapters, categoryList: serviceResults
    });

  } catch (error) {
    res.status(404);
    console.log(error);
  }
}



// update single course
exports.putEditCourse = async (req, res) => {
  try {
    console.log("admin edit course by Id")
    if (req.fileError) { throw req.fileError }
    let imgFileName;
    if (req.file) {
      imgFileName = req.file.filename;
    } else {
      imgFileName = '';
    }
    // obtaining course id through url
    let courseId = req.params.id;
    console.log(courseId);
    console.log(req.body);

    // let courseFromDb = await Coursemodel.selectCourseById(courseId);
    // // getting data as object from req.body
    const { courseTitle, courseIntro, courseCategory, chapters } = req.body;

    let result = await Coursemodel.updateCourse(courseId, courseTitle, courseIntro, courseCategory, chapters, imgFileName);
    // //   // sucess
    if (result.affectedRows > 0) {
      res.status(200).json({ msgType: 'success', msg: `${courseTitle} course has been sucessfully update.` });
    } else {
      //  406 Not Acceptable Not sure
      res.status(405).send({ msgType: "danger", msg: `Error: ${courseTitle} course update dangered .` });
    }

  } catch (error) {
    res.status(404).send({ msgType: "danger", msg: `Error: ${error.message} course update failed .` });;
  }
}

// USERS-ADMIN
// housemaids
exports.getAllHousemaids = async (req, res) => {
  try {
    let housemaids = await Housemaid.getAllHousemaidsByAdmin();
    console.log(housemaids)

    res.status(200).render('admin/admin-housemaids-views', { housemaids: housemaids });
    // res.status(200).render('admin/admin-housemaids-views', { courses: courses, alert: '' });
    // res.status(200).json({ courses: courses });
  } catch (err) {
    res.status(401).send({ msgType: "danger", msg: `${err.message}` });;
  }
}
exports.getHousemaidPortifolio = async (req, res) => {
  try {
    console.log("get house maid portifolio by ADMIN")
    const { housemaidId } = req.params;
    let imgUrl = await Image.getProfilePhotorById(housemaidId);
    let userImg = "https://mdbootstrap.com/img/new/avatars/6.jpg";
    if (imgUrl.length > 0) {
      userImg = imgUrl[0].profileImg;
    }

    let personalDetails = await Housemaid.getPersonalDetails(housemaidId);
    let serviceDetails = await Housemaid.getServiceDetails(housemaidId);

    res.status(200).render('admin/maid-Portifolio', { profileImg: userImg, personalDetails: personalDetails, serviceDetails: serviceDetails })

  } catch (err) {
    res.status(401).send({ msgType: "danger", msg: `${err.message}` });;
  }
}

// houseowners
exports.getAllHouseowners = async (req, res) => {
  try {
    // get all housemaids and get all house oqners are two different ones
    let houseowners = await Houseowner.getAllHouseownersByAdmin();
    console.log(houseowners)

    res.status(200).render('admin/admin-houseowners-views', { houseowners: houseowners });
    // res.status(200).render('admin/admin-housemaids-views', { courses: courses, alert: '' });
    // res.status(200).json({ courses: courses });
  } catch (err) {
    res.status(401).send({ msgType: "danger", msg: `${err.message}` });;
  }
}



// SERVICES
exports.getServices = async (req, res) => {
  try {
    let serviceResults = await Housemaid.viewServiceCategories();
    console.log(serviceResults);
    res.render('admin/admin-services', { serviceCategory: serviceResults });

  } catch (err) {
    res.status(500).send({ msgType: "danger", msg: `${err.message}` });;
  }

}
exports.getPostServices = async (req, res) => {
  try {

    res.render('admin/admin-services-add');

  } catch (err) {
    res.status(500).send({ msgType: "danger", msg: `${err.message}` });;
  }

}


exports.postService = async (req, res) => {
  try {
    let serviceId = uuid.v4()
    const { serviceCategoryName, color } = req.body;

    let result = await Housemaid.addServiceCategory(serviceId, serviceCategoryName, color);
    //   console.log(result)
    if (result.affectedRows > 0) {
      res.status(201).json({
        msgType: 'success', msg: `${serviceCategoryName} course has been sucessfully added.`, service: {
          serviceId, serviceCategoryName, color
        }
      });
    } else {
      //  406 Not Acceptable Not sure
      res.status(405).send({ msgType: "fail", msg: `Error: ${serviceCategoryName} course is not added .` });
    }
  } catch (err) {
    res.status(500).send({ msgType: "danger", msg: `${err.message}` });;
  }
}




exports.deleteService = async (req, res) => {
  try {
    console.log("Delete Service Category")

    console.log(req.params)
    let { serviceCategoryId } = req.params;
    let result = await Housemaid.deleteServiceCategory(serviceCategoryId);
    if (result.affectedRows > 0) {
      res.redirect('/admin/services/serviceCategory');
    } else {
      //  406 Not Acceptable Not sure
      res.status(405).send({ msgType: "fail", msg: `Error: selected service category  is not removed .` });
    }


  } catch (err) {
    res.status(500).send({ msgType: "danger", msg: `${err.message}` });;
  }
}

// exports.editService = async (req, res) => {
//   try {
//     console.log("Update Service Category")
//     let { serviceCategoryId } = req.body;
//     let result = await Housemaid.deleteServiceCategory(serviceCategoryId);
//     if (result.affectedRows > 0) {
//       res.status(201).json({
//         msgType: 'success', msg: `service Category ${serviceCategoryName} is no longer avaialable.`, service: {
//           serviceId, serviceCategoryName, color
//         }
//       });
//     } else {
//       //  406 Not Acceptable Not sure
//       res.status(405).send({ msgType: "fail", msg: `Error: ${serviceCategoryName}  is not removed successfully  .` });
//     }


//   } catch (err) {
//     res.status(500).send({ msgType: "danger", msg: `${err.message}` });;
//   }
// }


exports.getUpdateService = async (req, res) => {
  try {
    console.log("Update Service Category")

    let { serviceCategoryId } = req.params;
    let result = await Housemaid.getServiceCategoryById(serviceCategoryId);

    if (result.affectedRows > 0) {
      res.status(200).json({
        msgType: 'success', msg: `selected service Category is successfully update.please refresh`
      });
    } else {
      //  406 Not Acceptable Not sure
      res.status(405).send({ msgType: "fail", msg: `Error: selected service category  is not update .` });
    }
  } catch (err) {
    res.status(500).send({ msgType: "danger", msg: `${err.message}` });;
  }
}


exports.putUpdateService = async (req, res) => {
  try {
    console.log("Update Service Category")

    let { serviceCategoryId } = req.params;
    let result = await Housemaid.getServiceCategoryById(serviceCategoryId);
    console.log(result)
    res.render('admin/admin-services-update', { serviceCategory: result[0] })


  } catch (err) {
    res.status(500).send({ msgType: "danger", msg: `${err.message}` });;
  }
}


// PAYMENTS -admin

async function getProofRecords(results) {
  let proofObjArr = [];
  for (let i = 0; i < results.length; i++) {
    let nameResults = await Houseowner.getHouseOwnerNamebyId(results[i].userId)
    let userhouseownerName = nameResults[0].userName;

    const record ={
      paymentId: results[i].paymentId,
      userId: results[i].userId,
      houseownerName: userhouseownerName,
      paymentFile: results[i].paymentFile,
      paymentStatus: results[i].paymentStatus,
    }
    proofObjArr.push(record);
  }
  return proofObjArr;
}







exports.getConsumerPackagePayments= async (req, res) => {
  try {
    console.log("consumer package  payment")

   
    
    let proofResults= await Houseowner.getProofOfPayments();
    let resultswithMaidName = await getProofRecords(proofResults);
    
    res.render('admin/admin-consumer-package-view', { payments: resultswithMaidName})
   
  } catch (err) {
    res.status(500).send({ msgType: "danger", msg: `${err.message}` });;
  }
}

exports.putConsumerPackagePayments= async (req, res) => {
  try {
    console.log("activate conumer package via payment")
    const {paymentId}= req.params;
    // update statement
    let resultswithMaidName = await Houseowner.activateProofOfPayment(paymentId);
    console.log(resultswithMaidName)
    if (resultswithMaidName.affectedRows >0){
      res.status(200).redirect("/admin/payments/consumerPackage")
    }
   
  } catch (err) {
    res.status(500).send({ msgType: "danger", msg: `${err.message}` });;
  }
}
// exports.getConsumerPackagePayments= async (req, res) => {
//   try {
//     console.log("consumer package  payment")

   
//     let result = await Houseowner.getProofOfPayments();
//     console.log(results)

//     if (result.affectedRows > 0) {
//       res.status(200).json({
//         msgType: 'success', msg: `selected service Category is successfully update.please refresh`
//       });
//     } else {
//       //  406 Not Acceptable Not sure
//       res.status(405).send({ msgType: "fail", msg: `Error: selected service category  is not update .` });
//     }
//   } catch (err) {
//     res.status(500).send({ msgType: "danger", msg: `${err.message}` });;
//   }
// }

// Reports
exports.getUsersReport=async(req,res)=>{
  let houseownerCountResults = await User.getUserCount('Houseowner');
  let housemaidCountResults = await User.getUserCount('Housemaid');

  let userRatio = ['Houseowner','Housemaid']
  let userCountRatio = [houseownerCountResults[0]['COUNT(*)'], housemaidCountResults[0]['COUNT(*)']];

  
  res.render('admin/admin-report-user', {
    userRatio, userCountRatio
});
}