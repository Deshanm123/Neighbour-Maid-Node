const multer = require('multer');
const path = require('path');


const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
});

const upload = multer({
  storage: fileStorageEngine,
  limits: { fileSize: 5000000 },//5mb
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = { upload };

// validations 
function checkFileType(file, cb) {
  // allowed  extensions
  const fileType = /jpeg|jpg|png|gif/;
  // checking exension using regex
  const extensionType = fileType.test(path.extname(file.originalname).toLowerCase());
  // MIME TYPE FOR IMAGES isimages/jpeg
  const extensionName = fileType.test(file.mimetype);


  if (extensionType && extensionName) {
    // valid image
    return cb(null, true);
  } else {
    // not an image
    cb('Error: Please Upload Image Files only');
  }
}


// TODO:Display validations