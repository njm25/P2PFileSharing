import React, { useState, useEffect } from "react";
import Peer from "peerjs";
import MainMenu from "./components/MainMenu";
import HostPage from "./components/HostPage/HostPage";
import DownloadPage from "./components/DownloadPage/DownloadPage";
import "./App.css";

const App = () => {
  const [menu, setMenu] = useState("main");
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
    setMenu("main");
    setStatusMessage("");
  }

  return (
    <div className="container">
      {menu === "main" && (
        <MainMenu
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

export default App;
