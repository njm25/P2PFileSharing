document.addEventListener("DOMContentLoaded", () => {
  const mainMenu = document.getElementById("main-menu");
  const hostInterface = document.getElementById("host-interface");
  const downloadInterface = document.getElementById("download-interface");

  const hostBtn = document.getElementById("host-btn");
  const downloadBtn = document.getElementById("download-btn");
  const backToMainHostBtn = document.getElementById("back-to-main-host");
  const backToMainDownloadBtn = document.getElementById("back-to-main-download");

  const generatedPinElem = document.getElementById("generated-pin");
  const hostingStatusElem = document.getElementById("hosting-status");
  const statusIcon = document.getElementById("status-icon");
  const connectBtn = document.getElementById("connect-btn");
  const pinInput = document.getElementById("pin-input");
  const fileInput = document.getElementById("file-input");
  const statusElem = document.getElementById("status");
  const downloadLink = document.getElementById("download-link");

  let peer = new Peer(); // Create Peer instance globally
  let connection;

  // Event: Peer opened
  peer.on('open', (id) => {
    console.log("Peer instance opened with ID:", id);
    generatedPinElem.textContent = id; // Set the PIN but don't display it yet
  });

  peer.on('error', (err) => {
    console.error("Error in Peer instance:", err);
  });

  // Hosting a file
  hostBtn.addEventListener("click", () => {
    mainMenu.classList.add("hidden");
    hostInterface.classList.remove("hidden");

    peer.on('connection', (conn) => {
      connection = conn;

      conn.on('open', () => {
        statusElem.textContent = "A user has connected!";
        const file = fileInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (event) {
            conn.send({ fileName: file.name, fileData: event.target.result });
            statusElem.textContent = "File sent!";
          };
          reader.readAsArrayBuffer(file);
        } else {
          statusElem.textContent = "No file selected.";
        }
      });
    });
  });

  // Show hosting status only when a file is selected
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      hostingStatusElem.classList.remove("hidden");
      statusIcon.classList.remove("hidden");
    } else {
      hostingStatusElem.classList.add("hidden");
      statusIcon.classList.add("hidden");
    }
  });

  backToMainHostBtn.addEventListener("click", () => {
    hostInterface.classList.add("hidden");
    mainMenu.classList.remove("hidden");

    hostingStatusElem.classList.add("hidden");
    statusIcon.classList.add("hidden");
    fileInput.value = ""; // Clear the file input
  });

  // Downloading a file
  downloadBtn.addEventListener("click", () => {
    mainMenu.classList.add("hidden");
    downloadInterface.classList.remove("hidden");
  });

  backToMainDownloadBtn.addEventListener("click", () => {
    downloadInterface.classList.add("hidden");
    mainMenu.classList.remove("hidden");

    // Reset status messages
    statusElem.textContent = "";
    downloadLink.classList.add("hidden");
  });

  connectBtn.addEventListener("click", () => {
    console.log("Connect button clicked");

    const hostId = pinInput.value.trim();
    if (!hostId) {
      alert("Please enter a valid PIN.");
      return;
    }

    console.log("Attempting to connect to hostId:", hostId);

    connection = peer.connect(hostId);

    if (!connection) {
      console.error("Connection object is undefined. Connection attempt failed.");
      return;
    }

    console.log("Connection object created:", connection);

    connection.on('open', () => {
      console.log("Connection opened");
      statusElem.textContent = "Connected to host, waiting for file...";
    });

    connection.on('data', (data) => {
      console.log("Data received:", data);
      if (data.fileName && data.fileData) {
        // Create a blob and generate a download link
        const blob = new Blob([data.fileData]);
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = data.fileName;
        downloadLink.classList.remove("hidden");
        statusElem.textContent = "File received! Click below to download.";
      }
    });

    connection.on('close', () => {
      console.log("Connection closed by the host");
      statusElem.textContent = "Connection closed by host.";
    });

    connection.on('error', (err) => {
      console.error("Connection error:", err);
      statusElem.textContent = `Error: ${err}`;
    });
  });
});
