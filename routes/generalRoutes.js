
const cookieParser = require('cookie-parser');
const express = require('express');
const router = express.Router();



const generalController = require('../controllers/generalController');


router.get('/register', generalController.getRegistration);
router.post('/register', generalController.postRegistration);

router.get('/login', generalController.getlogin);
router.post('/login', generalController.postLogin);
// router.get('/setcookie', function (req, res) {
//   // setting cookies
//   res.cookie('username', 'john doe', { maxAge: 900000, httpOnly: true });
//   return res.send('Cookie has been set');
// });


module.exports = router;