const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');




router.get('/registerUser', userController.getRegistrationUser);
router.post('/registerUser', userController.postRegistrationUser);


router.get('/loginUser', userController.getloginUser);
router.post('/loginUser', userController.postLoginUser);

router.get('/logout',userController.logOut);

















module.exports = router;