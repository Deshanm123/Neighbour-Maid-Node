const express = require('express');
const router = express.Router();
const courseControllers = require('../controllers/courseControllers');
const imgController = require('../controllers/imgController');


// course home
// router.get('/', courseControllers.getAllCourses);
// add course
router.get('/addCourse', courseControllers.getAddCourse);

// router.post('/addCourse', imgController.upload.single('avatar'), courseControllers.postAddCourse);

// update/edit course
router.get('/editCourse/:id', courseControllers.getEditCourse);
router.put('/editCourse/:id', courseControllers.putEditCourse);
// delete course
router.delete('/remove/:id', courseControllers.deleteCourse);
// get single course
router.get('/view/:id', courseControllers.getSingleCourse);




module.exports = router;