const socket = io.connect();

(() => {
  const status = document.getElementById('status');
  const messages = document.getElementById('messages');
  const textarea = document.getElementById('textarea');
  const userName = document.getElementById('userName');
  const clearBtn = document.getElementById('clear');

  // set default status
  let statusDefault = status.textContent;

  let setStatus = (s) => {
    // Set status
    status.textContent = s;

    if (s !== statusDefault) {
      var delay = setTimeout(() => {
        setStatus(statusDefault)
      }, 4000)
    }
  }

  // produce chat space room //
  // let chatSpace = "mars";//generated via houseowner_housewife
  let chatSpace = "neptune"//generated via houseowner_housewife



  socket.emit('joinChatSpace', chatSpace)

  // join room


  socket.on('outputStoredData', (data) => {

    if (socket !== undefined) {
      messages.innerHTML = '';
      if (data.length > 0) {



        for (let x = 0; x < data.length; x++) {
          const message = document.createElement('div');
          message.setAttribute('class', 'chat-message');
          message.textContent = data[x].chat_details.name + ":" + data[x].chat_details.message;
          messages.appendChild(message);
          messages.insertBefore(message, messages.firstChild);
        }
      }

    }
  });



  socket.on('message', (message) => {
    console.log('message called');
    outputMessage(message.chat_details.name, message.chat_details.message);
    // outputMessage(message.chat_details.name, message.chat_details.message);

    // Scroll down
    // chatMessages.scrollTop = chatMessages.scrollHeight;
  });




  function outputMessage(name, chat) {
    const message = document.createElement('div');
    message.setAttribute('class', 'chat-message');
    message.textContent = name + ":" + chat;
    messages.appendChild(message);
    messages.insertBefore(message, messages.firstChild);
  }





  // Get status From sErver
  socket.on('status', (data) => {
    setStatus((typeof data === 'object') ? data.message : data);
    if (data.clear) {
      textarea.value = '';
    }
  })




  // Handle input
  textarea.addEventListener('keydown', function (e) {

    if (e.key == 'Enter') {
      // Input Typing
      socket.emit('input', {
        name: userName.value,
        message: textarea.value,
        // newly adaded
        chatSpace: chatSpace
      });

      e.preventDefault();
    }

  });


  // handle chat  Clear
  clearBtn.addEventListener('click', () => {
    socket.emit('clear');
  })

  // Clear Message
  socket.on('cleared', () => {
    messages.textContent = '';
  })

})();