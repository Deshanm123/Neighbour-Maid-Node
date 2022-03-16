const express = require('express');
const router = express.Router();
const houseownerController = require('../controllers/houseownerController');

router.get('/', houseownerController.getsimpleDashboardView);
router.get('/search/:searchInput', houseownerController.getSearchResults);
 



















module.exports = router;