import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../component/Sidebar/Sidebar";
import Topbar from "../../component/Topbar/Topbar";
import { DecodeRole } from "../../helper/Decode";
import Cookies from "js-cookie";

function Dashboard({ children }) {
  const navigate = useNavigate();
  const { getRole } = DecodeRole();
  const [setLoading] = React.useState(true);
  const token = Cookies.get("login");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
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

        if (!data || data.length === 0) {
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

    if (!getRole) {
      console.log("Role belum tersedia, tunggu...");
      return;
    }

    if (
      getRole.toLowerCase() !== "admin" &&
      getRole.toLowerCase() !== "penjual"
    ) {
      console.log("Redirecting due to invalid role:", getRole);
      navigate("/");
    } else {
      fetchData();
    }
  }, [getRole, navigate]);

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