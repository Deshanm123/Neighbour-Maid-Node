const express = require('express');
const router = express.Router();


const generalController = require('../controllers/generalController');


router.get('/register', generalController.getRegistration);
router.post('/register',generalController.postRegistration);

router.get('/login', (req, res) => {
  res.render('login');
})


module.exports = router;