import React, { useState } from "react";

const DownloadPage = ({
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
      setStatusMessage("Connected to host, starting download...");
    });

    conn.on("data", (data) => {
      if (data.fileName && data.fileData) {
        setFileData(data.fileData);
        setFileName(data.fileName);
        setStatusMessage("");
      }
    });

    conn.on("close", () => {
      setStatusMessage("Connection closed by host.");
    });

    conn.on("error", (err) => {
      console.error("Peer error:", err);
      setStatusMessage(`Peer Error`);
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
    <div className="text-center">
      <h2 className="mb-4">Download a File</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter ID here"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={handleConnect}>
          Connect
        </button>
        <button className="btn btn-secondary" onClick={onBackClick}>
          Back
        </button>
      </div>
      {fileData && (
        <div className="mt-4">
          <button className="btn btn-success" onClick={handleDownload}>
            Download {fileName}
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadPage;
