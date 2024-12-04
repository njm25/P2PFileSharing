import React, { useState, useEffect } from "react";
import Peer from "peerjs";
import OptionsPage from "./OptionsPage/OptionsPage";
import HostPage from "./HostPage/HostPage";
import DownloadPage from "./DownloadPage/DownloadPage";
import "./Main.css";

const Main = () => {
  const [menu, setMenu] = useState("options");
  const [peer] = useState(new Peer());
  const [connection, setConnection] = useState(null);
  const [generatedPin, setGeneratedPin] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    peer.on("open", (id) => {
      setGeneratedPin(id);
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
      setStatusMessage(`Peer Error`);
    });
  }, [peer]);

  const handleBack = () => {
    setMenu("options");
    setStatusMessage("");
  }

  return (
    <div className="container">
      {menu === "options" && (
        <OptionsPage
          onHostClick={() => setMenu("host")}
          onDownloadClick={() => setMenu("download")}
        />
      )}
      {menu === "host" && (
        <HostPage
          peer={peer}
          generatedPin={generatedPin}
          setStatusMessage={setStatusMessage}
          onBackClick={() => handleBack()}
        />
      )}
      {menu === "download" && (
        <DownloadPage
          peer={peer}
          connection={connection}
          setConnection={setConnection}
          setStatusMessage={setStatusMessage}
          onBackClick={() => handleBack()}
        />
      )}
      <p>{statusMessage}</p>
    </div>
  );
};

export default Main;
