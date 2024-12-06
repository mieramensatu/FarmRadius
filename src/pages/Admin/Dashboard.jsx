import React from "react";
import Sidebar from "../../component/Sidebar/Sidebar";
import Topbar from "../../component/Topbar/Topbar";

function Dashboard({children}) {
  return (
    <div className="dashboard">
      <div className="topbar">
        <Topbar />
      </div>

      <div className="sidebar">
        <Sidebar />
      </div>

      <div className="content">{children}</div>
    </div>
  );
}

export default Dashboard;
