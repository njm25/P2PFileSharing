// ui.js

// Function to initialize the UI components
function initUI() {
    // Event listener for file input
    document.getElementById("fileInput").addEventListener("change", handleFileInput);
  
    // Event listener for creating offer
    document.getElementById("createOffer").addEventListener("click", () => {
      const file = document.getElementById("fileInput").files[0];
      if (file) {
        createOffer(file);
      } else {
        updateStatus("Please select a file to share.");
      }
    });
  
    // Event listener for connecting
    document.getElementById("connect").addEventListener("click", () => {
      const answer = document.getElementById("answer").value;
      if (answer) {
        finalizeConnection(answer);
      } else {
        updateStatus("Please paste the answer to connect.");
      }
    });
  
    // Event listener for setting answer
    document.getElementById("answer").addEventListener("input", () => {
      const offer = document.getElementById("offer").value;
      if (offer) {
        setAnswer(offer);
      } else {
        updateStatus("Please paste the offer metadata.");
      }
    });
  }
  
  // Function to handle file input
  function handleFileInput(event) {
    const file = event.target.files[0];
    if (file) {
      updateStatus(`Selected file: ${file.name}`);
    }
  }
  
  // Function to update the connection status on the UI
  function updateStatus(message) {
    document.getElementById("status").textContent = message;
  }
  
  // Initialize UI on page load
  window.onload = initUI;
  