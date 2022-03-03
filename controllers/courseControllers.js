const Coursemodel = require('../models/Coursemodel');
const moment = require('moment');


// adding a course
exports.getAddCourse = async (req, res,) => {
  try {
    res.status(200).render('courses/course-add', { course: new Coursemodel(), alert: '' });
  } catch (error) {
    res.status(404);
    console.log(error);
  }
}

// post add course
exports.postAddCourse = async (req, res) => {
  // getting data from POST

  // if (req.fileError) {
  //   console.log(req.fileError)
  // }

  // const { courseCategory, courseTitle, courseIntro, courseDescription } = req.body;
  // // checking multer returns with errors
  console.log(req.files);
  console.log(req.body);



  // // // the below format is essential fo the mysql
  // let courseDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

  // let course = new Coursemodel(courseCategory, courseTitle, courseDate, courseIntro, courseDescription);
  // try {
  //   let result = await Coursemodel.addCourse(course);
  //   if (result.affectedRows > 0) {
  //     // notifying added
  //     // ?201 is header status for created
  //     res.status(201).render('courses/course-add',
  //       {
  //         course: new Coursemodel(),
  //         alert: `${courseTitle} course has been sucessfully added.`
  //       },
  //     );
  //     // console.log(`course with course Id  ${courseTitle} has been sucessfully added.`);
  //   } else {
  //     // 406 Not Acceptable Not sure
  //     res.status(406).render('courses/course-add',
  //       {
  //         course: course,
  //         alert: `Error: course is not added .`
  //       },
  //     );
  //   }
  // } catch (e) {
  //   console.log(e);
  // }
}


//get edit course
exports.getEditCourse = async (req, res,) => {
  try {
    let courseId = req.params.id;
    let courses = await Coursemodel.selectCourseById(courseId);
    res.status(200).render('courses/course-edit', { courses: courses });
  } catch (error) {
    res.status(404);
    console.log(error);
  }
}


exports.putEditCourse = async (req, res,) => {
  try {
    // obtaining course id through url
    let courseId = req.params.id;
    // getting data as object from req.body
    const { courseCategory, courseTitle, courseIntro, courseDescription } = req.body;
    // get the exisitn post data and compare with new data if changes are there proceed unless diplay error 
    let courseFromDb = await Coursemodel.selectCourseById(courseId);
    // trim inputs
    let arr = [courseCategory, courseTitle.trim(), courseIntro.trim(), courseDescription.trim(), courseId];

    if (isChangesExists(courseFromDb[0], arr)) {
      let result = await Coursemodel.updateCourse(arr);
      if (result.affectedRows > 0) {
        // notifying update
        console.log(`course with course Id  ${courseId} has been sucessfully update.`);
        let course = await Coursemodel.selectCourseById(courseId);
        // let course = await Course.selectCourseById(id);
        if (course == null) {
          res.redirect('/');
        } else {
          res.status(200).render('courses/course-view', { courses: course });
        }
      }

    } else {
      console.log(" There are no changes to update");
    }
  } catch (error) {
    res.status(404);
    console.log(error);
  }
}



// getting all the courses
exports.getAllCourses = async (req, res,) => {
  try {
    let courses = await Coursemodel.getAvialableCourses();
    res.status(200).render('courses/courses-list', { courses: courses });
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
      res.status(200).render('courses/course-view', { courses: course });
    }
  } catch (error) {
    res.status(404);
    console.log(error);
  }

}


// remove course
exports.deleteCourse = async (req, res) => {
  id = req.params.id;
  // res.send(`Record with course Id  ${courseId} has been sucessfully removed.`);
  try {
    let result = await Coursemodel.removeCourse(id);
    if (result.affectedRows > 0) {
      console.log(`course with course Id  ${id} has been sucessfully Removed.`);
      //direct to homepage
      try {
        let courses = await Coursemodel.getAvialableCourses();
        res.status(200).render('courses/courses-list', { courses: courses });
        // res.status(200).json({ courses: courses });
      } catch (error) {
        res.status(404);
        console.log(error);
      }

    } else {
      console.log('Course is not Removed')
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

