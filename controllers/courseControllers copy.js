const Course = require('../models/Course');
const Coursemodel = require('../models/Coursemodel');
const moment = require('moment');



// adding a course
exports.getAddCourse = async (req, res,) => {
  try {
    res.status(200).render('courses/course-add', { course: new Course() });
  } catch (error) {
    res.status(404);
    console.log(error);
  }
}

//get edit course
exports.getEditCourse = async (req, res,) => {
  try {
    let courseId = req.params.id;
    let [course, _] = await Course.selectCourseById(courseId);
    res.status(200).render('courses/course-edit', { course: course });
  } catch (error) {
    res.status(404);
    console.log(error);
  }
}



exports.putEditCourse = async (req, res,) => {
  try {
    // obtaining course id through url /req body
    let courseId = req.params.id;

    // getting data as object from req.body
    const { courseCategory, courseTitle, courseIntro, courseDescription } = req.body;

    // get the exisitn post data and compare with new data if changes are there proceed unless diplay error 
    let [courseArr, _] = await Course.selectCourseById(courseId);
    // let courseWithoutPublishDate = JSON.parse(course);
    let courseJSONFromDB = courseArr.shift();

    // trim inputs
    let arr = [courseCategory, courseTitle.trim(), courseIntro.trim(), courseDescription.trim(), courseId];

    if (isChangesExists(courseJSONFromDB, arr)) {
      let result = await Course.updateCourse(arr);
      if (result[0].affectedRows > 0) {
        // notifying update
        console.log('successful update');
        let [course, _] = await Course.selectCourseById(courseId);
        // let course = await Course.selectCourseById(id);
        if (course == null) res.redirect('/');
        else {
          res.status(200).render('courses/course-view', { courses: course });
        }
      }
    } else {
      console.log(" do not update");
    }
  } catch (error) {
    res.status(404);
    console.log(error);
  }
}

function isChangesExists(courseJSONFromDB, arr) {
  let changesPresent = false;
  if (arr[0] !== courseJSONFromDB.courseCategory || arr[1] !== courseJSONFromDB.courseTitle || arr[2] !== courseJSONFromDB.courseIntro || arr[3] !== courseJSONFromDB.courseDescription) {
    changesPresent = true;
  }
  return changesPresent;
}


exports.postAddCourse = async (req, res) => {
  // getting data from POST
  const { courseCategory, courseTitle, courseIntro, courseDescription } = req.body

  // // the below format is essential fo the mysql
  let courseDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

  let course = new Course(courseCategory, courseTitle, courseDate, courseIntro, courseDescription);
  try {
    let [headerdata, _] = await Course.addCourse(course);
    if (course == null) res.redirect('/');
    else {
      let [course, _] = await Course.selectCourseById(headerdata.insertId);
      // let course = await Course.selectCourseById(id);
      if (course == null) res.redirect('/');
      else {
        res.status(200).render('courses/course-view', { courses: course });
      }
    }
  } catch (e) {
    console.log(e);
  }

}




// getting all the courses
exports.getAllCourses = async(req, res,) => {
  
  let courses = await Coursemodel.getAvialableCourses();
    console.log(courses);
    
    // res.send(courses)
    // res.status(200).json({ courses: courses });
  // } catch (error) {
  //   res.status(404);
  //   console.log(error);

  // }
}
// // getting all the courses
// exports.getAllCourses = async (req, res,) => {
//   try {
//     let [courses, _] = await Course.getAll();
//     res.status(200).render('courses/courses-list', { courses: courses });
//     // res.status(200).json({ courses: courses });
//   } catch (error) {
//     res.status(404);
//     console.log(error);

//   }
// }

// select course by id
exports.getSingleCourse = async (req, res) => {
  // please note that add function check numerical input if it;s string return 404
  id = req.params.id;
  try {
    let course = await Coursemodel.selectCourseById(id);
    // let course = await Course.selectCourseById(id);
    if (course == null) res.redirect('/');
    else {
        console.log("---------working------")
        console.log(course);
      // res.status(200).render('courses/course-view', { courses: course });
    }
  } catch (error) {
    res.status(404);
    console.log(error);
  }

}
// exports.getSingleCourse = async (req, res) => {
//   // please note that add function check numerical input if it;s string return 404
//   id = req.params.id;
//   try {
//     let [course, _] = await Course.selectCourseById(id);
//     // let course = await Course.selectCourseById(id);
//     if (course == null) res.redirect('/');
//     else {
//       res.status(200).render('courses/course-view', { courses: course });
//     }
//   } catch (error) {
//     res.status(404);
//     console.log(error);
//   }

// }

// remove course
exports.deleteCourse = async (req, res) => {

  console.log("check this out");

}