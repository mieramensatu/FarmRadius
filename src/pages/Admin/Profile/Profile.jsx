import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

function Profile() {
  const token = Cookies.get("login"); // Ambil token dari cookie
  const [profileData, setProfileData] = useState(null); // Simpan data profile
  const [error, setError] = useState(null); // Simpan error jika ada

  useEffect(() => {
    if (!token) {
      console.error("Token is missing!");
      setError("You are not authenticated. Please log in.");
      return;
    }

    axios
      .get("https://farmdistribution-40a43a4491b1.herokuapp.com/profile", {
        headers: {
          "Content-Type": "application/json",
          login: token,
        },
      })
      .then((res) => {
        console.log("Profile data:", res.data);
        setProfileData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile data.");
      });
  }, [token]);

  if (error) {
    return <p>{error}</p>; // Tampilkan pesan error
  }

  if (!profileData) {
    return <p>Loading...</p>; // Tampilkan loading jika data belum tersedia
  }

  return (
    <Dashboard>
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-picture">
            <img
              src={profileData.image || "https://via.placeholder.com/120"}
              alt="Profile"
            />
            <div className="camera-icon">
              <i className="fa fa-camera"></i>
            </div>
          </div>

          <div className="profile-details">
            <p>
              <strong>Name:</strong> {profileData.nama || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {profileData.email || "N/A"}
            </p>
            <p>
              <strong>Phone Number:</strong> {profileData.no_telp || "N/A"}
            </p>
            <p>
              <strong>Role:</strong> {profileData.role_name || "N/A"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {profileData.address
                ? `${profileData.address.street}, ${profileData.address.city}, ${profileData.address.state}, ${profileData.address.postal_code}, ${profileData.address.country}`
                : "N/A"}
            </p>
          </div>

          <div className="upload-buttons">
            <button className="upload-logo">Logo</button>
            <button className="upload-documents">Vendor Documents</button>
          </div>

          <div className="edit-profile-container">
            <Link to="/edit-profile" className="edit-profile">
              <i className="fa fa-edit"></i> Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default Profile;
