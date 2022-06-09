const express = require('express');
const router = express.Router();
const multer = require('../services/multer');
const houseownerController = require('../controllers/houseownerController');
const { requireAuth, tokenUserInfoAccess } = require('./../middleware/authMiddleware');
const { houseownerPackageInfoAccess } = require('./../middleware/houseownerMiddleware');


router.get('*', tokenUserInfoAccess, requireAuth)

// router.get('/', (req, res) => { res.render('/houseowner/houseowner-dashboard') });
router.get('/', houseownerController.getsimpleDashboardView);

router.get('/search', houseownerController.getSearchResults);
// router.get('/searchByRequirements', houseownerController.getRequirementSearchResults);
router.post('/searchByRequirements', houseownerController.postRequirementSearchResults);
// router.get('/getRequirementTable', houseownerController.getRequirementTable);

// chat
router.get('/chat', houseownerPackageInfoAccess, houseownerController.getChat);

//video chat
router.get('/videoChat/:housemaidId', houseownerPackageInfoAccess, houseownerController.getVideoChat);

//make appointment
router.post('/makeHousmaidInterviewAppointment', tokenUserInfoAccess, houseownerController.postInterviewAppointment)


// upgrade package
router.get('/upgradePackage', houseownerController.getUpgradePackage);
router.post('/upgradePackage', multer.upload.single('payment'), tokenUserInfoAccess, houseownerController.postUpgradePackage);








router.get('/:maidId', houseownerPackageInfoAccess, houseownerController.getMaidPortiolioView);

















module.exports = router;