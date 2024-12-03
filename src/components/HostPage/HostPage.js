import React, { useState, useEffect } from "react";

const HostPage = ({ peer, generatedPin, setStatusMessage, onBackClick }) => {
  const [file, setFile] = useState(null);
  const [hostingStatus, setHostingStatus] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setHostingStatus(true);
  };

  useEffect(() => {
    peer.on("connection", (conn) => {
      conn.on("open", () => {
        setStatusMessage("A user has connected!");
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            conn.send({ fileName: file.name, fileData: event.target.result });
            setStatusMessage("File sent!");
          };
          reader.readAsArrayBuffer(file);
        } else {
          setStatusMessage("No file selected.");
        }
      });
    });
  }, [peer, file, setStatusMessage]);

  return (
    <div className="text-center">
      <h2 className="mb-4">Host a File</h2>
      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange}
        />
      </div>
      {hostingStatus && (
        <p className="alert alert-info">
          Hosting as ID: <strong>{generatedPin}</strong>
        </p>
      )}
      <div>
        <button className="btn btn-secondary me-2" onClick={onBackClick}>
          Back
        </button>
      </div>
    </div>
  );
};

export default HostPage;
