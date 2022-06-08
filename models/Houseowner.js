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



  // search
  // filter view was deleted
  static searchOne(input) {
    return new Promise((resolve, reject) => {

      let sqlSearch = `SELECT * FROM housemaid_dashboard_view WHERE CONCAT_WS(' ', housemaid_dashboard_view.uFName ,housemaid_dashboard_view.uLName) LIKE '%${input}%' `;
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(sqlSearch, (err, rows) => {
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


  // search
  // filter view was deleted
  static searchByGenderAndEmpConditions(maidGender, maidEmpNature) {
    return new Promise((resolve, reject) => {
      let sqlSearch = `SELECT * FROM housemaid_dashboard_view WHERE  uGender  = '${maidGender}'  AND  userEmpService = '${maidEmpNature}'  `;
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(sqlSearch, (err, rows) => {
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



  // displaying the housemaids

  static populateDashboard(page) {
    let resultsPerPage = 2;
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("SELECT userId,uFName,uLName,profileImg FROM housemaid_dashboard_view", (err, rows) => {
          // return connection to tthe pool
          connection.release();
          if (!err) {
            // resolve(rows);
            // res.send(`course with course Name ${courseTitle} has been sucessfully added `);
            // result
            const numOfData = rows.length;
            const numOfPages = Math.ceil(numOfData / resultsPerPage);
            const startLimit = (page - 1) * resultsPerPage;
            let sql = `SELECT userId,uFName,uLName,profileImg FROM housemaid_dashboard_view LIMIT ${startLimit},${resultsPerPage} `;
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


  // CHAT SERVICE
  static getHouseOwnerNamebyId(houseOwnerId) {

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query('SELECT userName FROM user_tb WHERE userId = ? ', houseOwnerId, (err, rows) => {
          connection.release();
          if (!err) {
            resolve(rows[0].userName);
          }
          else {
            reject(err);
          }
        });
      });
    });

  }

  // Admin users:House Owners
  static getAllHouseownersByAdmin() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query('SELECT userId,userEmail,userName,userEmailVeifiedStatus FROM user_tb WHERE userRole = ? ', 'Houseowner', (err, rows) => {
          connection.release();
          if (!err) {
            resolve(rows);
          }
          else {
            console.log(err);
            reject(err);
          }
        });
      });
    });
  }








}





module.exports = Houseowner;