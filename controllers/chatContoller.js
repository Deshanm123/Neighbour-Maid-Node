const Chat = require('../models/Chat');

const mongoose = require('mongoose');
const uri = 'mongodb+srv://deshanm123:YdG5JMjZ9AE2Hvr6@cluster0.ufsym.mongodb.net/neighbourMaidChat?retryWrites=true&w=majority';

mongoose.connect(uri, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true
})
  .then(() => console.log('connected to db '))
  .catch(e => console.log(e)
  );



const chatSpace = '';

module.exports.respond = (socket, endpoint) => {


  // // chat space
  socket.on('joinChatSpace', (chatSpace) => {

    chatSpace = chatSpace;
    console.log("in chatspace " + chatSpace + " socket id" + socket.id)
    // join to a room
    socket.join(chatSpace);

    // // finding records according to room
    Chat.find({ interaction: chatSpace })
      .then(res => {
        endpoint.to(chatSpace).emit('outputStoredData', res)
      })
      .catch(err => {
        console.log(err)
      });


  })
  // chat space



  // test for chat space
  // input msgs in a room
  socket.on('input', (data) => {
    let name = data.name;
    let message = data.message;
    let chatSpace = data.chatSpace;

    //  check for name and message
    if (name == '' || message == '') {
      console.log('please enter name and message in the chatspace')
      // sendStatus('please enter name and message')
    } else {

      let chatMessage = new Chat({
        interaction: chatSpace,
        time_stamp: Date(),
        chatParticipants: {
          housemaid_id: data.housemaidId,
          houseowner_id: data.houseownerId
        },
        chat_details: {
          name: data.name,
          message: data.message
        },
      })

      // console.log(data.chat_details.message);
      chatMessage.save()
        .then(res => {

          endpoint.emit('message', res);
          // endpoint.to(chatSpace).emit('output', [data]);
          console.log(res);
          console.log("CHATSPACE");

          // sendStatus({
          //   message: 'Message sent',
          //   clear: true
          // })
        })
        .catch(err => console.log(err))
    }
  })

}