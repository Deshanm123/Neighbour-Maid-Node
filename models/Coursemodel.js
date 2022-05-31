const pool = require('../config/db');


class Coursemodel {
  constructor(courseCategory, courseTitle, courseDate, courseIntro, courseDescription) {
    this.courseCategory = courseCategory;
    this.courseTitle = courseTitle;
    this.courseDate = courseDate;
    this.courseIntro = courseIntro;
    this.courseDescription = courseDescription;
  }


  // get all courses -housemaid view
  static getAvialableCourses(page) {
    let resultsPerPage = 2;
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("SELECT * FROM course_tb", (err, rows) => {
          connection.release();
          if (!err) {
            const numOfData = rows.length;
            const numOfPages = Math.ceil(numOfData / resultsPerPage);

            const startLimit = (page - 1) * resultsPerPage;
            let sql = `SELECT * FROM course_tb LIMIT ${startLimit},${resultsPerPage} `;
            connection.query(sql, (err, result) => {
              if (err) throw err;
              resolve({ result, page, numOfPages });

            });
          }
          else {
            reject(err);
          }
        });
      })
    });
  }
  static getAvialableCoursesAdmin() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("SELECT * FROM course_tb", (err, rows) => {
          connection.release();
          if (!err) {
            resolve(rows);
          } else {
            reject(err);
          }
        });
      });
    });
  }


  // get course by id
  static selectCourseById(courseId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(" SELECT * FROM course_tb WHERE courseId = ?", [courseId], (err, rows) => {
          // return connection to tthe pool
          connection.release();
          if (!err) {
            resolve(rows);
          }
          else {
            reject(err);
          }
        });
      });
    });
  }

// chapters json
  static addCourse(courseCategory, courseTitle, courseIntro, chapters, imgFileName) {
    // able to remove the imagee under  error
    console.log("addCourse")
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("INSERT INTO course_tb (courseCategory,courseTitle,courseIntro,courseDescription,course_Img) VALUES (?,?,?,?,?)", [courseCategory, courseTitle, courseIntro, chapters, imgFileName], (err, rows) => {
          connection.release();
          if (!err) {
            resolve(rows);
          }
          else {
            reject(err);
          }
        });
      });
    });
  }

  static updateCourse(courseArr) {
    // array Destrcturing
    const [courseCategory, courseTitle, courseIntro, courseDescription, courseId] = courseArr;
    return new Promise((resolve, reject) => {
      let updateQry =
        "UPDATE course_tb SET courseCategory = ? , courseTitle = ?,  courseIntro= ? ,courseDescription = ?  WHERE courseId = ?";

      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("UPDATE course_tb SET courseCategory = ? , courseTitle = ?, courseIntro = ? , courseDescription = ? WHERE courseId = ?", [courseCategory, courseTitle, courseIntro, courseDescription, courseId], (err, res) => {
          // return connection to tthe pool
          connection.release();
          if (!err) {
            resolve(res);
          }
          else {
            reject(err);
          }
        });
      });
    });
  }

  static removeCourse(courseId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("DELETE FROM course_tb WHERE courseId  = ?", [courseId], (err, row) => {
          // return connection to tthe pool
          connection.release();
          if (!err) {
            resolve(row);
          }
          else {
            reject(err);
          }
        });
      });
    });
  }


}
module.exports = Coursemodel;