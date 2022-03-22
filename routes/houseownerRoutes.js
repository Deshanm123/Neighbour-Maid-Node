const express = require('express');
const router = express.Router();
const houseownerController = require('../controllers/houseownerController');

router.get('/', houseownerController.getsimpleDashboardView);
// router.post('/', houseownerController.getSearchResults);
router.get('/search', houseownerController.getSearchResults);
// router.get('/searchByRequirements', houseownerController.getRequirementSearchResults);
router.post('/searchByRequirements', houseownerController.postRequirementSearchResults);
// router.get('/getRequirementTable', houseownerController.getRequirementTable);
router.get('/:maidId', houseownerController.getMaidPortiolioView);




















module.exports = router;