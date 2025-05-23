import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../component/Sidebar/Sidebar";
import Topbar from "../../component/Topbar/Topbar";
import { DecodeRole } from "../../helper/Decode";
import Cookies from "js-cookie";

function Dashboard({ children }) {
  const navigate = useNavigate();
  const { getRole } = DecodeRole();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("login");

  useEffect(() => {
    if (getRole) {
      setRole(getRole);
    }
  }, [getRole]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          console.log("No token found, redirecting to login...");
          navigate("/login");
          return;
        }

        // Admin dan Penjual langsung bisa akses dashboard
        if (role === "Admin" || role === "Pembeli") {
          console.log("Authorized role detected, granting access to dashboard.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://farm-distribution-d0d1df93c0f1.herokuapp.com/peternakan/get",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              login: token,
            },
          }
        );

        if (response.status === 401) {
          console.log("Unauthorized, redirecting to /signup-seller...");
          navigate("/signup-seller");
          return;
        }

        const data = await response.json();

        if (!data || data.data === null) {
          console.log("No data found, redirecting to /signup-seller...");
          navigate("/signup-seller");
        } else {
          console.log("Data found, accessing dashboard...");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/signup-seller");
      } finally {
        setLoading(false);
      }
    };

    if (role) {
      fetchData();
    }
  }, [role, navigate, token]);

  if (loading) {
    return <div>Loading...</div>; 
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
