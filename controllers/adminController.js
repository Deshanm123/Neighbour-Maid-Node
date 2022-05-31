
const Coursemodel = require('../models/Coursemodel');

const moment = require('moment');

exports.getAllCourses = async (req, res) => {
  try {
    let courses = await Coursemodel.getAvialableCoursesAdmin();
    console.log(courses)
    // res.status(200).render('admin/admin-courses', { courses: courses ,alert:{} });
    res.status(200).render('admin/admin-courses', { courses: courses, alert:''});
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

exports.getEditCourse = async (req, res,) => {
  try {
    let courseId = req.params.id;
    let courses = await Coursemodel.selectCourseById(courseId);
    res.status(200).render('admin/admin-course-edit', { courses: courses, alert: '' });
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
      // sucess
      if (result.affectedRows > 0) {
        // notifying update
        let msg = `course with course Id  ${courseId} has been sucessfully update.`;
        let course = await Coursemodel.selectCourseById(courseId);
        // let course = await Course.selectCourseById(id);
        if (course != null) {
          res.status(200).render('admin/admin-course-edit', {
            courses: course,
            alert: {
              msgType: 'success',
              msg: msg
            }
          });
        } else {
          console.log("updated but failed to load updated course")
          res.redirect('/');
        }
      } else {
        let msg = `The course with course Id  ${courseId} is unable update.`;
        res.status(200).render('admin/admin-course-edit', {
          courses: courseFromDb,
          alert: {
            msgType: 'danger',
            msg: msg
          }
        });
      }

    } else {
      console.log(" There are no changes to update");
    }
  } catch (error) {
    res.status(404);
    console.log(error);
  }
}


exports.getSingleCourse = async (req, res) => {
  // please note that add function check numerical input if it;s string return 404
  console.log(" single course view admin")
  let id = req.params.id;
  try {
    let course = await Coursemodel.selectCourseById(id);
    console.log(course)
    
    let courseId = course[0].courseId;
    let courseCategory = course[0].courseCategory;
    let courseTitle = course[0].courseTitle ;
    let courseIntro = course[0].courseIntro;
    let courseChapters= JSON.parse(course[0].courseDescription);
    let course_Img = course[0].course_Img;

    
    console.log(courseChapters);
    let page = req.query.page ? Number(req.query.page) : 1;
    if (page < 1) {
      let courseId = course[0].courseId;
      res.status(200).redirect(`/admin/courses/viewCourse/${courseId}?page=` + encodeURIComponent(1));
    } else {
    //   let results = await Houseowner.populateDashboard(page);
    //   res.status(200).render('houseowner/houseowner-dashboard', { housemaids: results.result, page: results.page, pageCount: results.numOfPages })
    // }

    console.log("chapters"+courseChapters.length)
    if (course == null) res.redirect('/admin/courses/');
    else {
      // res.status(200).render('admin/admin-course-view', { courses: course });
      res.status(200).render('admin/admin-course-view', {
        courseId: courseId, courseTitle: courseTitle, courseIntro: courseIntro, courseCategory: courseCategory, course_Img: course_Img, courseChapters: courseChapters, page:page, pageCount: courseChapters.length
        });
      }
    }  
  } catch (error) {
    res.status(404);
    console.log(error);
  }
}


// adding a course
exports.getAddCourse = async (req, res,) => {
  try {
    res.status(200).render('admin/admin-course-add', { course: new Coursemodel(), alert: '' });
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
  if (req.fileError) {throw req.fileError }

  let imgFileName;
  if(req.file){
    imgFileName= req.file.filename;
  }else{
    imgFileName = '';
  }
  const { courseTitle,courseIntro, courseCategory,chapters } = req.body;


    console.log(chapters)  
  // the below format is essential fo the mysql
  // let courseDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  // let course = new Coursemodel(courseCategory, courseTitle, courseIntro, chapters, imgFileName);

    let result = await Coursemodel.addCourse(courseCategory, courseTitle, courseIntro, chapters, imgFileName);
  //   console.log(result)
    if (result.affectedRows > 0) {
      res.status(201).json({ msgType: 'success', msg: `${courseTitle} course has been sucessfully added.`});
    } else {
  //  406 Not Acceptable Not sure
      res.status(405).send({ msgType: "fail",  msg: `Error: ${courseTitle} course is not added .` });
    }
  } catch (e) {
    console.log(e);
  }
}














function isChangesExists(courseJSONFromDB, arr) {
  let changesPresent = false;
  if (arr[0] !== courseJSONFromDB.courseCategory || arr[1] !== courseJSONFromDB.courseTitle || arr[2] !== courseJSONFromDB.courseIntro || arr[3] !== courseJSONFromDB.courseDescription) {
    changesPresent = true;
  }
  return changesPresent;
}

