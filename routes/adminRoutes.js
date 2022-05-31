
const express = require('express');
const router = express.Router();
const { upload } = require('../services/imageUploadService');
const adminController = require('../controllers/adminController');



// course home
router.get('/', (req, res) => {
  res.render('admin/admin-dashboard');
});

// get all courses
router.get('/courses', adminController.getAllCourses);
// get single course
router.get('/courses/viewCourse/:id', adminController.getSingleCourse);

// add course
router.get('/courses/addCourse', adminController.getAddCourse);
router.post('/courses/addCourse', upload.single('courseCoverPhoto'), adminController.postAddCourse);

// delete course
router.delete('/courses/:id', adminController.deleteCourse);

// update/edit course
router.get('/courses/editCourse/:id', adminController.getEditCourse);
// router.put('/courses/editCourse/:id', adminController.putEditCourse);
router.put('/courses/editCourse/:id', upload.single('courseCoverPhoto'), adminController.putEditCourse);

// // router.post('/addCourse', upload.single('avatar'));

// // router.post('/addCourse',imgController.upload.single('avatar'),function (req, res) {
// //   // req.file is the name of your file in the form above, here 'uploaded_file'
// //   // req.body will hold the text fields, if there were any 
// //   console.log(req.files);
// // });





module.exports = router;