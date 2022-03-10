const express = require('express');
const router = express.Router();
const housemaidController = require('../controllers/housemaidController');
const imgUpload = require('../services/imageUploadService');
const { requireAuth, tokenUserInfoAccess } = require('./../middleware/authMiddleware');

//for all the get requests
router.get('*', tokenUserInfoAccess)

router.get('/', requireAuth, (req, res) => {
  res.render('housemaid/maid-dashboard');
});

// logout
router.get('/logout', requireAuth, housemaidController.logOut);


// courses routes
router.get('/courses', requireAuth, housemaidController.getAllCourses);
router.get('/courses/:id', requireAuth, housemaidController.getSingleCourse);

// myaccount
router.get('/myAccount', requireAuth,housemaidController.getAccount);

  



router.post('/myAccount/profileImg/upload', imgUpload.upload.single('photo'), housemaidController.uploadProfileImg);
router.post('/myAccount', housemaidController.addDetails);





module.exports = router;