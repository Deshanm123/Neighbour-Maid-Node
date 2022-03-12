const pool = require('../config/db');
const uuid = require('uuid');


class Image {

  // upload
  static uploadImage(fileName, userId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw ` Pool Connection Error:${err}`;
        connection.query("INSERT INTO user_profile_img_tb (userId,profileImg) VALUES (?,?)", [userId, fileName], (err, rows) => {
          console.log("inside query" + userId)
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

  static getProfilePhotorById(userId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(" SELECT profileImg FROM user_profile_img_tb  WHERE userId = ?  ", [userId], (err, rows) => {
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
module.exports = Image;