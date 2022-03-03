const db = require('../config/db');

class Course {
  constructor(courseCategory, courseTitle, courseDate, courseIntro, courseDescription) {
    this.courseCategory = courseCategory;
    this.courseTitle = courseTitle;
    this.courseDate = courseDate;
    this.courseIntro = courseIntro;
    this.courseDescription = courseDescription;
  }
  static getAll() {
    let selectSQl = "SELECT * FROM course_tb";
    return db.execute(selectSQl);
    //  please use differnet syntax like ? scenario view it on the video on traversy
  }

  static selectCourseById(id) {
    let selectCourseQry = " SELECT * FROM course_tb WHERE courseId = '" + id + "' "
    return db.execute(selectCourseQry);
    // let [course, _] = db.execute(selectCourseQry);
    // return course;
  }

  static addCourse(course) {
    const { courseCategory, courseTitle, courseDate, courseIntro, courseDescription } = course;

    let insertQry =
      "INSERT INTO course_tb (courseCategory,courseTitle,courseDate,courseIntro,courseDescription) VALUES ('" + courseCategory + "', '" + courseTitle + "','" + courseDate + "', '" + courseIntro + "', '" + courseDescription + "')";
      
    return db.execute(insertQry);
  }

  static updateCourse(courseArr) {
    // array Destrcturing
    const [courseCategory, courseTitle, courseIntro, courseDescription, courseId ] = courseArr;
    
    let updateQry =
      "UPDATE course_tb SET courseCategory = '" + courseCategory + "' , courseTitle = '" + courseTitle + "',  courseIntro='" + courseIntro + "',courseDescription = '" + courseDescription + "' WHERE courseId = '" + courseId +"'  ";

     return db.execute(updateQry);
    // let [resultFieldArr, _] = db.execute(updateQry);
    // // return Json object
    // return resultFieldArr.shift();
  }

  static removeCourse(courseId){
    let deleteQry = `DELETE FROM course_tb WHERE courseId = ${courseId}`;
    return db.execute(deleteQry);
  }



}

module.exports = Course;