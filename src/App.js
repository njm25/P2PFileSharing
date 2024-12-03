import React, { useState } from "react";
import Peer from "peerjs";
import MainMenu from "./components/MainMenu";
import HostFile from "./components/HostFile";
import DownloadFile from "./components/DownloadFile";
import "./App.css";

const App = () => {
  const [menu, setMenu] = useState("main");
  const [peer] = useState(new Peer());
  const [connection, setConnection] = useState(null);
  const [generatedPin, setGeneratedPin] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  React.useEffect(() => {
    peer.on("open", (id) => {
      setGeneratedPin(id);
      console.log("Peer instance opened with ID:", id);
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
      setStatusMessage(`Error: ${err.message}`);
    });
  }, [peer]);

  return (
    <div className="container">
      {menu === "main" && (
        <MainMenu
          onHostClick={() => setMenu("host")}
          onDownloadClick={() => setMenu("download")}
        />
      )}
      {menu === "host" && (
        <HostFile
          peer={peer}
          generatedPin={generatedPin}
          setStatusMessage={setStatusMessage}
          onBackClick={() => setMenu("main")}
        />
      )}
      {menu === "download" && (
        <DownloadFile
          peer={peer}
          connection={connection}
          setConnection={setConnection}
          setStatusMessage={setStatusMessage}
          onBackClick={() => setMenu("main")}
        />
      )}
      <p>{statusMessage}</p>
    </div>
  );
};

export default App;
