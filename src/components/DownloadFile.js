import React, { useState } from "react";

const DownloadFile = ({
  peer,
  connection,
  setConnection,
  setStatusMessage,
  onBackClick,
}) => {
  const [pin, setPin] = useState("");
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleConnect = () => {
    const conn = peer.connect(pin.trim());
    setConnection(conn);

    conn.on("open", () => {
      setStatusMessage("Connected to host, waiting for file...");
    });

    conn.on("data", (data) => {
      if (data.fileName && data.fileData) {
        setFileData(data.fileData);
        setFileName(data.fileName);
        setStatusMessage("File received! Click the button below to download.");
      }
    });

    conn.on("close", () => {
      setStatusMessage("Connection closed by host.");
    });

    conn.on("error", (err) => {
      setStatusMessage(`Error: ${err.message}`);
    });
  };

  const handleDownload = () => {
    if (fileData && fileName) {
      const blob = new Blob([fileData]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
    }
  };

  return (
    <div className="download-interface">
      <h2>Download a File</h2>
      <input
        type="text"
        placeholder="Enter PIN here"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
      <button onClick={handleConnect}>Connect</button>
      <button onClick={onBackClick}>Back</button>
      {fileData && (
        <div>
          <button onClick={handleDownload}>Download {fileName}</button>
        </div>
      )}
    </div>
  );
};

export default DownloadFile;
