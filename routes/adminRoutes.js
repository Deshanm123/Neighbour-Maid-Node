
const express = require('express');
const router = express.Router();
const { upload } = require('../services/imageUploadService');
const adminController = require('../controllers/adminController');


// COURSES//
// course home
router.get('/', adminController.getSiteTraffic);
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

// /// Housemaid-Services 
router.get('/services/serviceCategory', adminController.getServices);
router.get('/services/serviceCategory/getAddServices',adminController.getPostServices);
router.post('/services/serviceCategory/addServices', adminController.postService);
// NO NEED OF AJAX
router.delete('/services/serviceCategory/:serviceCategoryId', adminController.deleteService);

router.get('/services/serviceCategory/update/:serviceCategoryId', adminController.getUpdateService);
router.get('/services/serviceCategory/update/:serviceCategoryId', adminController.putUpdateService);


// housemaids
router.get('/users/housemaids', adminController.getAllHousemaids);
router.get('/users/housemaids/:housemaidId', adminController.getHousemaidPortifolio);


// houseowners
router.get('/users/houseowners', adminController.getAllHouseowners);

// payments
router.get('/payments/consumerPackage', adminController.getConsumerPackagePayments);
router.put('/payments/consumerPackage/:paymentId', adminController.putConsumerPackagePayments);

// reports
router.get('/userReports', adminController.getUsersReport);

module.exports = router;