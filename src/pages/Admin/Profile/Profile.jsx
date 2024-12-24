import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "./_profile.scss";
import { Link } from "react-router-dom";

function ProfileAdmin() {
  const token = Cookies.get("login"); // Get token from cookies
  const [profileData, setProfileData] = useState(null); // Store profile data
  const [error, setError] = useState(null); // Store error if any

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

  const handleUploadImage = () => {
    Swal.fire({
      title: "Upload Profile Image",
      input: "file",
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload your profile image",
      },
      showCancelButton: true,
      confirmButtonText: "Upload",
      showLoaderOnConfirm: true,
      preConfirm: (file) => {
        if (!file) {
          Swal.showValidationMessage("Please select an image");
          return;
        }

        const formData = new FormData();
        formData.append("image", file);

        return axios
          .put(
            "https://farmdistribution-40a43a4491b1.herokuapp.com/profile/add-image",
            formData,
            {
              headers: {
                login: token,
              },
            }
          )
          .then((response) => {
            if (!response.data) {
              throw new Error(response.statusText);
            }
            return response.data;
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            Swal.showValidationMessage("Failed to upload image. Please try again.");
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Image Uploaded",
          text: "Your profile image has been updated successfully.",
        });

        // Refresh the profile data to reflect the updated image
        setProfileData((prevData) => ({
          ...prevData,
          image: URL.createObjectURL(result.value),
        }));
      }
    });
  };

  return (
    <Dashboard>
      <p>Profile</p>
      <div className="profile-container">
        {error && <p>{error}</p>}
        {!profileData && !error && <p>Loading...</p>}
        {profileData && (
          <div className="profile-card">
            <div className="profile-picture">
              <img
                src={profileData.image || "https://via.placeholder.com/120"}
                alt="Profile"
              />
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
              <button className="upload-image" onClick={handleUploadImage}>
                <p>Upload Image</p>
              </button>
            </div>

            <div className="edit-profile-container">
              <Link to="/dashboard/edit-profile" className="edit-profile">
                <p>Edit Profile</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
}

export default ProfileAdmin;

