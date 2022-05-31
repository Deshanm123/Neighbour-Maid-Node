const express = require('express');
const router = express.Router();
const housemaidController = require('../controllers/housemaidController');
const imgUpload = require('../services/imageUploadService');
const { requireAuth, tokenUserInfoAccess } = require('./../middleware/authMiddleware');

//for all the get requests
router.get('*', tokenUserInfoAccess)

router.get('/', requireAuth, housemaidController.getDashboard);
// portifolio
router.get('/portifolio', requireAuth, housemaidController.viewPortifolio);



// courses routes
router.get('/courses', requireAuth, housemaidController.getAllCourses);
router.get('/courses/:id', requireAuth, housemaidController.getSingleCourse);

// myaccount //my account edit  -get directed according to specs
router.get('/myAccount', requireAuth, housemaidController.getAccount);
// my accounnt-edit
router.get('/myAccount/edit', requireAuth, housemaidController.getAccount);
router.put('/myAccount/edit', requireAuth, housemaidController.puteditAccount);

router.post('/myAccount/profileImg/upload', imgUpload.upload.single('photo'), housemaidController.uploadProfileImg);
router.post('/myAccount', housemaidController.addPersonalDetails);


// myservices
router.get('/myService', requireAuth, housemaidController.getMyService);
router.post('/myService', requireAuth, housemaidController.postMyService);
router.put('/myService/edit', requireAuth, housemaidController.putEditMyService);



// chat
router.get('/chat', requireAuth, housemaidController.getChat);
//video chat
router.get('/videoChat/:houseownerId', requireAuth, housemaidController.getVideoChat);




module.exports = router;