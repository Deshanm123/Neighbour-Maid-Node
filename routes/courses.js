const express = require('express');
const router = express.Router();
const courseControllers = require('../controllers/courseControllers');
const imgController = require('../controllers/imgController');
// const multer = require('multer');
// const bodyParser = require('body-parser');
// const upload = multer({ dest: './public/uploads' })


// course home
router.get('/', courseControllers.getAllCourses);
// add course
router.get('/addCourse', courseControllers.getAddCourse);

router.post('/addCourse', imgController.upload.single('avatar'), courseControllers.postAddCourse);
// router.post('/addCourse', upload.single('avatar'));

// router.post('/addCourse',imgController.upload.single('avatar'),function (req, res) {
//   // req.file is the name of your file in the form above, here 'uploaded_file'
//   // req.body will hold the text fields, if there were any 
//   console.log(req.files);
// });

// update/edit course
router.get('/editCourse/:id', courseControllers.getEditCourse);
router.put('/editCourse/:id', courseControllers.putEditCourse);
// delete course
router.delete('/remove/:id', courseControllers.deleteCourse);
// get single course
router.get('/view/:id', courseControllers.getSingleCourse);




module.exports = router;