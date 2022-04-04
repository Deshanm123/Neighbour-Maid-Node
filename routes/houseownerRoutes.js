const express = require('express');
const router = express.Router();
const houseownerController = require('../controllers/houseownerController');
const { requireAuth, tokenUserInfoAccess } = require('./../middleware/authMiddleware');


router.get('*', tokenUserInfoAccess,requireAuth)

// router.get('/', (req, res) => { res.render('/houseowner/houseowner-dashboard') });
router.get('/', houseownerController.getsimpleDashboardView);

router.get('/search', houseownerController.getSearchResults);
// router.get('/searchByRequirements', houseownerController.getRequirementSearchResults);
router.post('/searchByRequirements', houseownerController.postRequirementSearchResults);
// router.get('/getRequirementTable', houseownerController.getRequirementTable);
router.get('/:maidId', houseownerController.getMaidPortiolioView);

// chat
router.get('/chat', requireAuth, houseownerController.getChat);


















module.exports = router;