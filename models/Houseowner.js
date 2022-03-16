const pool = require('../config/db');

class Houseowner {


  // HOUSEMAID FILTER VIEW
  // CREATE VIEW housemaid_detailed_view AS
  // SELECT  maid_service_tb.userId, maid_service_tb.userEmpService, maid_service_tb.userSkills, user_personal_details_tb.uDOB, user_personal_details_tb.uFName, user_personal_details_tb.uLName, user_personal_details_tb.uGender, user_personal_details_tb.uLanguage,user_profile_img_tb.profileImg FROM maid_service_tb join user_personal_details_tb on  maid_service_tb.userId = user_personal_details_tb.userId
  // join user_profile_img_tb on   user_personal_details_tb.userId = user_profile_img_tb.userId;




  // "SELECT user_tb.userId, user_tb.userName,user_profile_img_tb.profileImg FROM user_tb join  user_profile_img_tb on  user_tb.userId = user_profile_img_tb.userId"
  static viewAvialableMaids() {
    let userRole = 'housemaid'
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("SELECT  userId ,userEmail,userName FROM user_tb where userRole = ?", userRole, (err, rows) => {
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
  static getMaidProfilebyId(userId) {
    let userRole = 'housemaid'
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("SELECT  profileImg FROM user_profile_img_tb where userId = ?", userId, (err, rows) => {
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

  // filter view was deleted
  // static searchOne(input) {
  //   return new Promise((resolve, reject) => {
  //     pool.getConnection((err, connection) => {
  //       if (err) throw err;
  //       connection.query("SELECT  housemaidfilter_view  where userId = ?", input, (err, rows) => {
  //         // return connection to tthe pool
  //         connection.release();
  //         if (!err) {
  //           resolve(rows);
  //           // res.send(`course with course Name ${courseTitle} has been sucessfully added `);
  //         }
  //         else {
  //           reject(err);
  //         }
  //       });
  //     });
  //   });
  // }




  static populateDashboard(page) {
    let resultsPerPage = 1;
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("SELECT uFName,uLName,profileImg FROM housemaid_dashboard_view", (err, rows) => {
          // return connection to tthe pool
          connection.release();
          if (!err) {
            // resolve(rows);
            // res.send(`course with course Name ${courseTitle} has been sucessfully added `);
            // result
            const numOfData = rows.length;
            const numOfPages = Math.ceil(numOfData / resultsPerPage);
            const startLimit = (page - 1) * resultsPerPage;
            let sql = `SELECT uFName,uLName,profileImg FROM housemaid_dashboard_view LIMIT ${startLimit},${resultsPerPage} `;
            connection.query(sql, (err, result) => {
              if (err) throw err;
              resolve({ result, page, numOfPages });
            });
          }
          else {
            reject(err);
          }
        });
      });
    });

  }




















}





module.exports = Houseowner;