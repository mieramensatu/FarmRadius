import React from "react";
import { Link } from "react-router-dom";

function Topbar() {
  return (
    <header className="app-header">
      <div className="app-header-navigation">
        <div className="dashboard-submenu submenu">Overview</div>
      </div>
      <div className="app-header-navigation">
        <div className="dashboard-submenu submenu">product</div>
      </div>
      <div className="app-header-navigation">
        <div className="dashboard-submenu submenu">profile</div>
      </div>
      <div className="app-header-actions">
        <Link to="/profile" className="user-profile">
          <span>Matheo Peterson</span>
          <span>
            <img src="https://assets.codepen.io/285131/almeria-avatar.jpeg" />
          </span>
        </Link>
        <div className="app-header-actions-buttons">
          <div className="icon-button">
            <i className="ph ph-magnifying-glass"></i>
          </div>
          <div className="icon-button">
            <i className="ph ph-bell"></i>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
