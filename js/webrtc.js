// webrtc.js

let peerConnection;
let dataChannel;

// Function to create an offer (Host side)
async function createOffer(file) {
  peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });

  dataChannel = peerConnection.createDataChannel("fileTransfer");

  dataChannel.onopen = () => {
    console.log("Data channel is open. Starting file transfer...");
    sendFile(file);
  };

  dataChannel.onclose = () => {
    console.log("Data channel is closed.");
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      document.getElementById("offer").value = JSON.stringify(peerConnection.localDescription);
    }
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  document.getElementById("offer").value = JSON.stringify(peerConnection.localDescription);
}

// Function to set the answer (Downloader side)
async function setAnswer(offer) {
  peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });

  peerConnection.ondatachannel = (event) => {
    dataChannel = event.channel;
    dataChannel.onmessage = (event) => {
      console.log("File chunk received: ", event.data);
      // Handle received data (e.g., append to file)
    };
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      document.getElementById("answer").value = JSON.stringify(peerConnection.localDescription);
    }
  };

  await peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  document.getElementById("answer").value = JSON.stringify(peerConnection.localDescription);
}

// Function to finalize the connection (Host side)
async function finalizeConnection(answer) {
  if (peerConnection.signalingState === "have-remote-offer" || peerConnection.signalingState === "have-local-offer") {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
    console.log("Connection established!");
  } else {
    console.error("Invalid signaling state for setting remote description.");
  }
}

// Function to send a file over the data channel
function sendFile(file) {
  const chunkSize = 16384;
  const reader = new FileReader();
  let offset = 0;

  reader.onload = (event) => {
    if (event.target.result) {
      dataChannel.send(event.target.result);
      offset += chunkSize;
      if (offset < file.size) {
        readSlice(offset);
      } else {
        console.log("File transfer completed.");
      }
    }
  };

  const readSlice = (o) => {
    const slice = file.slice(o, o + chunkSize);
    reader.readAsArrayBuffer(slice);
  };

  readSlice(0);
}

// Event Listeners
document.getElementById("createOffer").addEventListener("click", () => {
  const file = document.getElementById("fileInput").files[0];
  if (file) {
    createOffer(file);
  }
});

document.getElementById("connect").addEventListener("click", () => {
  const answer = document.getElementById("answer").value;
  if (answer) {
    finalizeConnection(answer);
  }
});

document.getElementById("offer").addEventListener("input", (event) => {
  const offer = document.getElementById("offer").value;
  if (offer) {
    try {
      setAnswer(offer);
    } catch (error) {
      console.error("Invalid offer format.", error);
      updateStatus("Invalid offer metadata. Please check and paste again.");
    }
  } else {
    updateStatus("Please paste the offer metadata.");
  }
});
