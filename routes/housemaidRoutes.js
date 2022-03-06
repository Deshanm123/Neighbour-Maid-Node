const express = require('express');
const router = express.Router();
const housemaidController = require('../controllers/housemaidController');
const {requireAuth} = require('./../middleware/authMiddleware');

router.get('/', requireAuth ,(req, res) => {
  res.render('housemaid/maid-dashboard');
});

// logout
router.get('/logout', requireAuth ,housemaidController.logOut);


// courses routes
router.get('/courses', requireAuth, housemaidController.getAllCourses);
router.get('/courses/:id', requireAuth, housemaidController.getSingleCourse);

// myaccount
router.get('/myAccount', (req, res) => {
  res.render('housemaid/maid-my_account');

});





module.exports = router;