import React, { useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "../Dashboard";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "./_editprofile.scss";
import { Link } from "react-router-dom";

function EditProfileAdmin() {
  const [formData, setFormData] = useState({
    nama: "",
    no_telp: "",
    email: "",
    id_role: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    image: "",
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get("login");

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "Authentication token is missing! Please log in again.",
      });
      setError("Authentication token is missing! Please log in again.");
      setLoading(false);
      return;
    }

    const fetchProfileAndRoles = async () => {
      try {
        const profileResponse = await axios.get(
          "https://farmdistribution-40a43a4491b1.herokuapp.com/profile",
          {
            headers: {
              "Content-Type": "application/json",
              login: token,
            },
          }
        );

        const rolesResponse = await axios.get(
          "https://farmdistribution-40a43a4491b1.herokuapp.com/role",
          {
            headers: {
              "Content-Type": "application/json",
              login: token,
            },
          }
        );

        setFormData({
          nama: profileResponse.data.nama || "",
          no_telp: profileResponse.data.no_telp || "",
          email: profileResponse.data.email || "",
          id_role: profileResponse.data.id_role || "",
          street: profileResponse.data.address?.street || "",
          city: profileResponse.data.address?.city || "",
          state: profileResponse.data.address?.state || "",
          postal_code: profileResponse.data.address?.postal_code || "",
          country: profileResponse.data.address?.country || "",
          image: profileResponse.data.image || "", // Properti gambar
        });

        setRoles(rolesResponse.data.roles || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile or roles data:", err);
        Swal.fire({
          icon: "error",
          title: "Data Fetch Error",
          text: "Failed to fetch profile or roles data. Please try again.",
        });
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchProfileAndRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = async () => {
    const token = Cookies.get("login");

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "Authentication token is missing! Please log in again.",
      });
      return;
    }

    const updatedFormData = {
      ...formData,
      id_role: Number(formData.id_role),
    };

    try {
      await axios.put(
        "https://farmdistribution-40a43a4491b1.herokuapp.com/profile/update",
        JSON.stringify(updatedFormData),
        {
          headers: {
            "Content-Type": "application/json",
            login: token,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Profile updated successfully!",
      });
    } catch (error) {
      console.error(
        "Error response from server:",
        error.response?.data || error
      );
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      });
    }
  };

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
            if (!response.data || !response.data.image_url) {
              throw new Error("Failed to get image URL from server");
            }
            return response.data.image_url; // Ambil URL gambar dari respons
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            Swal.showValidationMessage(
              "Failed to upload image. Please try again."
            );
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData((prevData) => ({
          ...prevData,
          image: result.value, // Perbarui URL gambar
        }));

        Swal.fire({
          icon: "success",
          title: "Image Uploaded",
          text: "Your profile image has been updated successfully.",
        });
      }
    });
  };
  return (
    <Dashboard>
      <div className="edit-profile-container">
        {error && <p>{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="edit-profile-grid">
              {/* Kolom Gambar */}
              <div className="profile-image">
                <img
                  src={formData.image || "https://via.placeholder.com/120"}
                  alt="Profile"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/120")
                  }
                />
              </div>

              {/* Kolom Input */}
              <div className="profile-inputs">
                {/* Baris 1 */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      name="no_telp"
                      value={formData.no_telp}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Baris 2 */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      name="id_role"
                      value={formData.id_role}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a Role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name_role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Baris 3 */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Street</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Baris 4 */}
                <div className="form-row">
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Baris 5 */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              {/* Tombol Upload dan Save */}
              <div className="upload-buttons">
                <button className="upload-image" onClick={handleUploadImage}>
                  Upload Image
                </button>
              </div>
              <div className="edit-profile-container">
                <Link to="/dashboard/profile" className="edit-profile">
                  Back to Profile
                </Link>
                <button className="edit-profile" onClick={handleUpdateProfile}>
                  Save Profile
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Dashboard>
  );
}

export default EditProfileAdmin;
