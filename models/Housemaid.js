const pool = require('../config/db');
const uuid = require('uuid');


class Housemaid {
  // constructor(courseCategory, courseTitle, courseDate, courseIntro, courseDescription) {
  //   this.courseCategory = courseCategory;
  //   this.courseTitle = courseTitle;
  //   this.courseDate = courseDate;
  //   this.courseIntro = courseIntro;
  //   this.courseDescription = courseDescription;
  // }


  // registering maid
  static addHouseMaid(email, userName, password) {
    let userId = uuid.v4();
    let userRole = 'housemaid';
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("INSERT INTO user_tb (userId,userEmail,userName,userPassword,userRole) VALUES (?,?,?,?,?)", [userId, email, userName, password, userRole], (err, rows) => {
          // return connection to tthe pool
          connection.release();
          if (!err) {
            resolve(rows);
            // res.send(`course with course Name ${courseTitle} has been sucessfully added `);
          }
          else {
            reject(err);
          }
        });
      });
    });
  }

  static selectUserIdByEmail(userEmail) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(" SELECT userId FROM user_tb WHERE userEmail = ?", [userEmail], (err, rows) => {
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

  static isEmailRegistered(userEmail) {

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("SELECT * FROM user_tb WHERE userEmail = ?", [userEmail], (err, rows) => {
          // return connection to the pool
          connection.release();
          if (!err) {
            rows.length > 0 ? resolve(true) : resolve(false);
          }
          else {
            // not return jusyt throw
            reject(err);
          }
        });
      });
    });
  }

  // login
  static getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(" SELECT * FROM user_tb WHERE userEmail = ?  ", [email], (err, rows) => {
          // return connection to the pool
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



















}

















module.exports = Housemaid;