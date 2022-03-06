const Coursemodel = require('../models/Coursemodel');

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

exports.logOut = (req, res) => {
  // we cant delete the cookie frm server 
  // but we can replace the cookie with soontobe expire cookie
  res.cookie('jwt', '', { maxAge: 1 }); //giving a blank value andone millisec duration
  res.redirect('/login'); //redirect to login

}
