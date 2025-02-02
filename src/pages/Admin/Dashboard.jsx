import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../component/Sidebar/Sidebar";
import Topbar from "../../component/Topbar/Topbar";
import { DecodeRole } from "../../helper/Decode";
import Cookies from "js-cookie";

function Dashboard({ children }) {
  const navigate = useNavigate();
  const { getRole } = DecodeRole(); // Menggunakan destructuring sesuai DecodeRole yang ada
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
        if (role === "Admin") {
          console.log("Admin role detected, granting access to dashboard.");
          setLoading(false);
          return;
        }

        if (!token) {
          console.log("No token found, redirecting to login...");
          navigate("/login");
          return;
        }

        const response = await fetch(
          "https://farmsdistribution-2664aad5e284.herokuapp.com/peternakan/get",
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
    return ;
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
