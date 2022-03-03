const express = require('express');
const router = express.Router();
const housemaidController = require('../controllers/housemaidController');

router.get('/', (req, res) => {
  res.render('housemaid/maid-dashboard');

});

// courses routes
router.get('/courses', housemaidController.getAllCourses);
router.get('/courses/:id', housemaidController.getSingleCourse);

// myaccount
router.get('/myAccount', (req, res) => {
  res.render('housemaid/maid-my_account');

});





module.exports = router;