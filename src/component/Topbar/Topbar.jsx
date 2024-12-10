import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function Topbar() {
  const token = Cookies.get("login");
  const [profile, setProfile] = useState({
    name: "Matheo Peterson",
    image: "https://assets.codepen.io/285131/almeria-avatar.jpeg",
  });

  useEffect(() => {
    // Fungsi untuk mendapatkan data profil
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "https://farmdistribution-40a43a4491b1.herokuapp.com/profile",
          {
            method: "GET",
            headers: {
              login: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();

        // Set nama dan gambar profil
        setProfile({
          name: data.nama,
          image: data.image,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <header className="app-header">
      <div className="app-header-navigation">
        <div className="dashboard-submenu submenu">Overview</div>
      </div>
      <div className="app-header-navigation">
        <div className="dashboard-submenu submenu">Product</div>
      </div>
      <div className="app-header-navigation">
        <div className="dashboard-submenu submenu">Profile</div>
      </div>
      <div className="app-header-actions">
        <Link to="/dashboard/profile" className="user-profile">
          <span>{profile.name}</span>
          <span>
            <img src={profile.image} alt="User Profile" />
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
