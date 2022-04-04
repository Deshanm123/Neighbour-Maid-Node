const socket = io.connect();

(() => {
  const status = document.getElementById('status');
  const messages = document.getElementById('messages');
  const textarea = document.getElementById('textarea');
  const clearBtn = document.getElementById('clear');




  // get search query values
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const houseownerId = urlParams.get('ho')
  const housemaidId = urlParams.get('hm')
  const sentby = urlParams.get('sentby');
  //create chatspace
  function createChatSpace(houseownerId, housemaidId) {
    //generated via houseowner_housewife
    return `${houseownerId}_${housemaidId}`;
  }

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

  function displaymyMessage(myMessage) {
    const message = document.createElement('div');
    message.classList.add('media', 'w-50', 'ml-auto', 'mb-3');
    message.innerHTML = `
            <div class="media-body">
            
            <div class="bg-primary rounded py-2 px-3 mb-2">
            <p class="text-small mb-0 text-white">${myMessage}</p>
            </div>
            <p class="small text-muted">12:00 PM | Aug 13</p>
            </div>
            `;
    messages.appendChild(message);
  }

  function displayOtherPartyMessage(OtherPartyMessage) {
    const message = document.createElement('div');
    message.classList.add('media', 'w-50', 'mb-3');
    message.innerHTML =
      `
            <div class="media-body ml-3">
                <div class="bg-light rounded py-2 px-3 mb-2">
                  <p class="text-small mb-0 ">${OtherPartyMessage}</p>
                </div>
                  <p class="small text-muted">12:00 PM | Aug 13</p>
            </div>
            `;
    messages.appendChild(message);
  }





  // produce chat space room //
  // let chatSpace = "mars";//generated via houseowner_housewife
  let chatSpace = createChatSpace(houseownerId, housemaidId)
  // alert(window.location.href.toString());


  socket.emit('joinChatSpace', chatSpace)

  // join room

  socket.on('outputStoredData', (data) => {

    if (socket !== undefined) {
      messages.innerHTML = '';
      if (data.length > 0) {

        for (let x = 0; x < data.length; x++) {

          let messageSentby = sentby === 'ho' ? houseownerId : housemaidId;

          if (data[x].chat_details.name == messageSentby) {
            displaymyMessage(data[x].chat_details.message);
          } else {
            displayOtherPartyMessage(data[x].chat_details.message);
          }

        }
      }
      messages.scrollTop = messages.scrollHeight;
    }
  });



  socket.on('message', (message) => {

    let messageSentby = sentby === 'ho' ? houseownerId : housemaidId;

    if (message.chat_details.name == messageSentby) {
      displaymyMessage(message.chat_details.message);
    } else {
      displayOtherPartyMessage(message.chat_details.message);
    }
    // Scroll down
    messages.scrollTop = messages.scrollHeight;
  });





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
      // if (textarea.value ==! ''){
      let messageSentby = sentby === 'ho' ? houseownerId : housemaidId;
      console.log("message " + messageSentby);

      // Input Typing
      socket.emit('input', {
        name: messageSentby,
        message: textarea.value,
        // newly adaded
        houseownerId: houseownerId,
        housemaidId: housemaidId,
        chatSpace: chatSpace
      });
      // }else{
      //   console.log("please enter the message")
      // }
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