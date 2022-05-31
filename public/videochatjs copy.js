const socket = io.connect('/');
const videoGrid = document.getElementById('video-grid')
const conStatusMsg = document.getElementById('conn-status-msg');




var peer = new Peer(myPeerId, {
  host: 'localhost',
  port: 5066,
  path: '/peerjs',
  config: {},
  debug: 3
});

// display video stream
function displayStream(stream, elementId) {
  console.log(stream);
  let video = document.getElementById(elementId);
  video.srcObject = stream;
  window.peer_stream = stream;
}

// display my video
function getmyVideoStream(callbacks) {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  let constraints = {
    video: true,
    audio: true,
  }
  navigator.getUserMedia(constraints, callbacks.success, callbacks.error)
}

//method calling to display my video
getmyVideoStream({
  success: (stream) => {
    window.localStream = stream;
    displayStream(stream, 'myStream')
  },
  error: (error) => {
    alert("unable to access the camera");
    console.log("My VIDEO STREAM ERROR " + error);
  }
})

let peerId, conn;

function displaymessage(msg) {
  conStatusMsg.textContent = msg;
}



//   // // send video stram to other party
socket.on('user-connected', (peerId) => {
  // peer.on('open', (peerId) => {

  let call = peer.call(peerId, window.localStream);

  call.on('stream', (stream) => {
    window.peer_stream = stream;
    console.log(stream)
    displayStream(stream, 'remoteVideo')
  })

  call.on("error", (err) => {
    console.log("Error on call:" + err);
  });

  // socket.on('user-disconnected', () => {
  //   alert("The user has leave the call");


  // })
  // })
})



function handlePeerDisconnect() {
  // manually close the peer connections
  for (let conns in peer.connections) {
    peer.connections[conns].forEach((conn, index, array) => {
      console.log(`closing ${conn.connectionId} peerConnection (${index + 1}/${array.length})`, conn.peerConnection);
      conn.peerConnection.close();

      // close it using peerjs methods
      if (conn.close)
        conn.close();
    });
  }
}




// });

peer.on('error', (error) => {
  if (error.type == 'peer-unavailable') {
    displaymessage(`The peer you're trying to connect to does not exist.`)
  }
  if (error.type == 'disconnected') {
    displaymessage(`The peer you're trying to connect to is disconnected`)
  }
  console.log("PEER ON ERROR: " + error);
})



document.getElementById('connectBtn').addEventListener('click', () => {
  // assigning peerId value to peerId input
  peerId = document.getElementById("connectionId").value;

  if (peerId) {
    conn = peer.connect(peerId) //establishing  the connetion betwwen two 
    conn.on('open', () => {
      let ROOM_ID = 'Room-202';
      socket.emit('join-room', ROOM_ID, peerId);

    });
    conn.on('close', () => {
      console.log("conn close event");
      handlePeerDisconnect();
    });
    //after connect connection get triggered
  } else {
    conStatusMsg.textContent = 'please enter peer Id';
    // conStatusMsg.textContent = 'connection with other party is currently unavailable';
    return false;
  }
})

// peer.on('close', function () {
//   alert("user is cuurently unavailable");
// });

peer.on('call', (call) => {
  // let acceptVideoCall = confirm("Do You want to answer this call?")

  //   if (acceptVideoCall) {
  call.answer(window.localStream);

  call.on('stream', (stream) => {
    // storing on global variable
    window.peer_stream = stream;
    displayStream(stream, 'remoteVideo');
  })

  call.on('error', (error) => {
    conStatusMsg.textContent = err.message;
    console.log(error);
  })

  call.on('close', () => {
    handlePeerDisconnect();
    // 
  })
  // })

  //   } else {
  //     conStatusMsg.textContent = 'call denied';
  //     console.log('call denied');
  //   }
});




document.getElementById('endCallBtn').addEventListener('click', () => {
  // console.log("end btn clicked");
  handlePeerDisconnect();
  // socket.emit('user-disconnected');
});

// mute
const muteAction = () => {
  const enabled = window.localStream.getAudioTracks()[0].enabled;
  //0 is the users(my) audio track
  if (enabled) {
    window.localStream.getAudioTracks()[0].enabled = false;
    // enabled = false;  
    setUnmuteButton();
  } else {
    // enabled = true;
    window.localStream.getAudioTracks()[0].enabled = true;
    setMuteButton();
  }

}

const setUnmuteButton = () => {
  const unmute = `
    <i class ="fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.getElementById(`main_mute_button`).innerHTML = unmute;
}


const setMuteButton = () => {
  const mute = `
    <i class ="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.getElementById(`main_mute_button`).innerHTML = mute;
}
// mute

// video

const playStop = () => {
  let enabled = window.localStream.getVideoTracks()[0].enabled;
  if (enabled) {
    window.localStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    window.localStream.getVideoTracks()[0].enabled = true;
    setStopVideo();
  }

}



const setStopVideo = () => {
  const stopVideo = `
    <i class ="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.getElementById('main__video_button').innerHTML = stopVideo;
}

const setPlayVideo = () => {
  const playVideo = `
    <i class ="fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.getElementById('comain__video_button').innerHTML = playVideo;
}