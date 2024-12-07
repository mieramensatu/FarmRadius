import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../component/Sidebar/Sidebar";
import Topbar from "../../component/Topbar/Topbar";
import { DecodeRole } from "../../helper/Decode";

function Dashboard({ children }) {
  const navigate = useNavigate();
  const { getRole } = DecodeRole();

  React.useEffect(() => {
    if (!getRole) {
      console.log("Role belum tersedia, tunggu...");
      return;
    }

    if (getRole.toLowerCase() !== "admin" && getRole.toLowerCase() !== "penjual") {
      console.log("Redirecting due to invalid role:", getRole);
      navigate("/");
    }
  }, [getRole, navigate]);

  if (!getRole) {
    return <div>Loading role...</div>;
  }

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
