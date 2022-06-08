const pool = require('../config/db');
const uuid = require('uuid');

class User {


  static isEmailRegistered(userEmail) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("SELECT userId,userEmail,userEmailVerificationCode,userEmailVeifiedStatus FROM user_tb WHERE userEmail = ?", [userEmail], (err, rows) => {
          // return connection to the pool
          connection.release();
          if (!err) {
            resolve(rows);
            // rows.length > 0 ? resolve(true) : resolve(false);
          }
          else {
            reject(err);
          }
        });
      });
    });
  }


  static addUser(email, userName, password, userRole, userEmailVerificationCode) {
    let userId = uuid.v4();
    // userEmailVeifiedStatus is default attribute of the table initially generted as 0/false
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("INSERT INTO user_tb (userId,userEmail,userName,userPassword,userRole,userEmailVerificationCode) VALUES (?,?,?,?,?,?)", [userId, email, userName, password, userRole, userEmailVerificationCode], (err, rows) => {
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

  // verify 
  static verifyUserbyId(userId){
     return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("UPDATE user_tb SET userEmailVeifiedStatus = '1' WHERE userId = ?", [userId], (err, rows) => {
          // return connection to the pool
          connection.release();
          if (!err) {
            resolve(rows);
          }
          else {
            console.log(err)
            reject(err);
          }
        });
      });
    });

  }











}
module.exports = User;