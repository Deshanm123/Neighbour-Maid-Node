const multer = require('multer');
const path = require("path");


// setting storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    // adding image name for the image upload 
    cb(null, file.filename + path.extname(file.originalname));
  }
});

// // init upload
exports.upload = multer({
  storage: storage,
  //  image capacity in byttes(2 Mb)
  // limits: { fileSize: 1024*1024*10 },
  fileFilter: function (req, file, cb) {
    fileTypeValidator(file, cb);
  }
});

function fileTypeValidator(file, cb) {
  // allowed  extensions
  const fileType = /jpeg|jpg|png|gif/;
  // checking exension using regex
  const extensionType = fileType.test(path.extname(file.originalname).toLowerCase());
  // MIME TYPE FOR IMAGES isimages/jpeg
  const extensionName = fileType.test(file.mimetype);


  if(extensionType && extensionName){
    // valid image
    return cb(null, true);
  } else {
    // not an image
    cb('Error: Please Upload Image Files only');
  }
}







