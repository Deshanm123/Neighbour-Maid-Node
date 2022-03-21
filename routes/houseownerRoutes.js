const express = require('express');
const router = express.Router();
const houseownerController = require('../controllers/houseownerController');

router.get('/', houseownerController.getsimpleDashboardView);
// router.post('/', houseownerController.getSearchResults);
router.get('/search', houseownerController.getSearchResults);
router.get('/searchByRequirements', houseownerController.getRequirementSearchResults);




















module.exports = router;