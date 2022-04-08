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

// chat
router.get('/chat',  houseownerController.getChat);

//video chat
router.get('/videoChat', houseownerController.getVideoChat);


router.get('/:maidId', houseownerController.getMaidPortiolioView);
















module.exports = router;