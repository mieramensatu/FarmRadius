import React, { useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "../Dashboard";
import Cookies from "js-cookie";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./_editprofile.scss";

function EditProfile() {
  // State variables for form inputs
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
  });

  const [roles, setRoles] = useState([]); // State to store roles
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  // Fetch the profile data and roles on component mount
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
        // Fetch profile data
        const profileResponse = await axios.get(
          "https://farmdistribution-40a43a4491b1.herokuapp.com/profile",
          {
            headers: {
              "Content-Type": "application/json",
              login: token,
            },
          }
        );

        // Fetch roles data
        const rolesResponse = await axios.get(
          "https://farmdistribution-40a43a4491b1.herokuapp.com/role",
          {
            headers: {
              "Content-Type": "application/json",
              login: token,
            },
          }
        );

        // Update form data with profile data
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
        });

        // Update roles state
        setRoles(rolesResponse.data.roles || []);
        setLoading(false); // Data is loaded
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

  // Update form state on input change
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

    try {
      const response = await axios.put(
        "https://farmdistribution-40a43a4491b1.herokuapp.com/profile/update",
        formData,
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

      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update profile. Please try again.",
      });

      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Dashboard>
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        <form className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="nama">Name</label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="no_telp">Phone Number</label>
            <input
              type="text"
              id="no_telp"
              name="no_telp"
              value={formData.no_telp}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="id_role">Role</label>
            <select
              id="id_role"
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
          <div className="form-group">
            <label htmlFor="street">Street</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="postal_code">Postal Code</label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="button"
            className="edit-profile"
            onClick={handleUpdateProfile}
          >
            <i className="fa fa-save"></i> Save Profile
          </button>
        </form>
      </div>
    </Dashboard>
  );
}

export default EditProfile;
