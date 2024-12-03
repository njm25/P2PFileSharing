import React from "react";

const MainMenu = ({ onHostClick, onDownloadClick }) => (
  <div className="main-menu text-center">
    <h1>Peer to Peer File Sharing</h1>
    <button className="btn btn-success mx-2" onClick={onHostClick}>
      Host a File
    </button>
    <button className="btn btn-primary mx-2" onClick={onDownloadClick}>
      Download a File
    </button>
  </div>
);

export default MainMenu;
