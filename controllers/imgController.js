// const multer = require('multer');
// const path = require("path");



// exports.upload = (req, res) => {

//   console.log(req.file.filename);
//   if (req.file) {
//     pool.getConnection((err, connection) => {
//       // not connected to db
//       if (err) throw err;
//       connection.query("INSERT INTO uprofile_tb (uImg) VALUES ? ; ", 'req.file.filename', (err, rows) => {
//         // once done,release the conncetion
//         connection.release();
//         if (!err) {
//           res.status(201).json({ message: "Image uploaded successfully", url: req.file });
//         } else {
//           console.log(err);
          
//           console.log(`removing ${req.file.filename}`);
//           fs.unlink(path.join(`./uploads`, req.file.filename), err => {
//             console.error(err);
//           })
//           // remove img
//           res.status(500).json({
//             message: "Something went Wrong"
//           });
//         }
//       });
//     });
//   } else {
//     throw 'image is not found';
//   }
// }


















// // setting storage engine for multer
// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, './public/uploads')
//   },
//   filename: function (req, file, cb) {
//     // adding image name for the image upload 
//     cb(null, file.filename + path.extname(file.originalname));
//   }
// });

// // // init upload
// exports.upload = multer({
//   storage: storage,
//   //  image capacity in byttes(2 Mb)
//   // limits: { fileSize: 1024*1024*10 },
//   fileFilter: function (req, file, cb) {
//     fileTypeValidator(file, cb);
//   }
// });

// function fileTypeValidator(file, cb) {
//   // allowed  extensions
//   const fileType = /jpeg|jpg|png|gif/;
//   // checking exension using regex
//   const extensionType = fileType.test(path.extname(file.originalname).toLowerCase());
//   // MIME TYPE FOR IMAGES isimages/jpeg
//   const extensionName = fileType.test(file.mimetype);


//   if(extensionType && extensionName){
//     // valid image
//     return cb(null, true);
//   } else {
//     // not an image
//     cb('Error: Please Upload Image Files only');
//   }
// }







