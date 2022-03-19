const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');




router.get('/registerUser', userController.getRegistrationUser);
router.post('/registerUSer', userController.postRegistrationUser);























module.exports = router;