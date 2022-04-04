var express = require('express');
var router = express.Router();


// normally routes /chat/0000
router.get('/', (req, res) => {

  res.render('houseowner/chat-interface');
})


// router.get('/:id', (req, res) => {
//   const chatId = req.params.id;


//   // const houseownerId = "1000"
//   // const chatRoom = `${houseownerId}__${maidId}`;
//   console.log(chatId);
//   // create

//   res.render('chat-interface');
// })





























module.exports = router;
