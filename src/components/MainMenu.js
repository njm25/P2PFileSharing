import React from "react";

const MainMenu = ({ onHostClick, onDownloadClick }) => (
  <div className="main-menu">
    <h1>Temp File Hosting Service</h1>
    <button onClick={onHostClick}>Host a File</button>
    <button onClick={onDownloadClick}>Download a File</button>
  </div>
);

export default MainMenu;
