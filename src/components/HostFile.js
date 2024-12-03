import React, { useState } from "react";

const HostFile = ({ peer, generatedPin, setStatusMessage, onBackClick }) => {
  const [file, setFile] = useState(null);
  const [hostingStatus, setHostingStatus] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setHostingStatus(true);
  };

  React.useEffect(() => {
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
    <div className="host-interface">
      <h2>Host a File</h2>
      <input type="file" onChange={handleFileChange} />
      {hostingStatus && (
        <p>
          Hosting as PIN: <strong>{generatedPin}</strong>
        </p>
      )}
      <button onClick={onBackClick}>Back</button>
    </div>
  );
};

export default HostFile;
