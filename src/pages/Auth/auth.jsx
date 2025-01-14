import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import "./_auth.scss";

function RegisterSeller() {
  const [values, setValues] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    email: "",
    phonenumber_farm: "",
    description: "",
    image_farm: null,
    farm_type: "",
  });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch user ID from profile endpoint
    const fetchUserId = async () => {
      const token = Cookies.get("login");
      console.log("Token from cookies:", token);

      if (!token) {
        console.error("Token not found! Redirecting to login.");
        Swal.fire({
          title: "Error",
          text: "You are not authenticated. Please log in.",
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href = "/login";
        });
        return;
      }

      try {
        const response = await fetch(
          `https://farmsdistribution-2664aad5e284.herokuapp.com/get/akun/?id=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              login: token, // Pastikan token tersedia
            },
          }
        );

        if (response.status === 200) {
          console.log("Fetched user data:", response.data.user);
          setUserId(response.data.user.id_user);
          setValues((prevValues) => ({
            ...prevValues,
            email: response.data.user.email,
            phonenumber_farm: response.data.user.no_telp,
            name: response.data.user.nama,
          }));
        } else {
          console.error("Failed to fetch user ID. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();

    // Fetch location for autofill
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const { address } = response.data;

              setValues((prevValues) => ({
                ...prevValues,
                street: address?.road || "",
                city: address?.city || address?.town || address?.village || "",
                state: address?.state || "",
                postal_code: address?.postcode || "",
              }));
              console.log("Location autofilled:", address);
            } catch (error) {
              console.error("Error fetching address:", error);
              Swal.fire({
                title: "Error",
                text: "Failed to fetch address. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          },
          (error) => {
            console.error("Error getting GPS location:", error);
            Swal.fire({
              title: "Error",
              text: "Please enable GPS to autofill address fields.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        );
      } else {
        Swal.fire({
          title: "Error",
          text: "Geolocation is not supported by your browser.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchLocation();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleFileChange = (e) => {
    setValues({ ...values, image_farm: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !values.name ||
      !values.street ||
      !values.city ||
      !values.state ||
      !values.postal_code ||
      !values.email ||
      !values.phonenumber_farm ||
      !values.description ||
      !values.image_farm ||
      !values.farm_type
    ) {
      Swal.fire({
        title: "Error",
        text: "All fields are required!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("street", values.street);
    formData.append("city", values.city);
    formData.append("state", values.state);
    formData.append("postal_code", values.postal_code);
    formData.append("email", values.email);
    formData.append("phonenumber_farm", values.phonenumber_farm);
    formData.append("description", values.description);
    formData.append("image_farm", values.image_farm);
    formData.append("farm_type", values.farm_type);

    try {
      const token = Cookies.get("login");
      console.log("Token:", token);

      if (!token) {
        Swal.fire({
          title: "Error",
          text: "You are not authenticated. Please log in.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      const response = await axios.post(
        "https://farmsdistribution-2664aad5e284.herokuapp.com/peternakan",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            login: token,
          },
        }
      );

      if (response.status === 200) {
        console.log("Farm registration successful:", response.data);
        Swal.fire({
          title: "Success",
          text: "Farm registration successful! Updating your role...",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Update role to seller
        await updateRoleToSeller(token, userId);

        window.location.href = "/dashboard";
      } else {
        throw new Error(response.data.message || "Failed to register farm.");
      }
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response?.data || error.message
      );
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Something went wrong!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const updateRoleToSeller = async (token, userId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/update/akun?id=${userId}`,
        {
          nama: values.name,
          no_telp: values.phonenumber_farm,
          email: values.email,
          id_role: 11, // Role Penjual
        },
        {
          headers: {
            "Content-Type": "application/json",
            login: token,
          },
        }
      );

      if (response.status === 200) {
        console.log(
          "User role updated to Penjual successfully:",
          response.data
        );
        Cookies.set("role", "Penjual", { expires: 7 });
      } else {
        console.error("Failed to update user role:", response.status);
      }
    } catch (error) {
      console.error(
        "Error updating role:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="register-seller-container">
      <div className="register-seller-card">
        <h2>Register Your Farm</h2>
        <form onSubmit={handleSubmit}>
          <div className="seller-image-upload">
            <label htmlFor="image_farm">Gambar</label>
            <input
              type="file"
              id="image_farm"
              name="image_farm"
              onChange={handleFileChange}
            />
          </div>
          <input
            type="text"
            name="name"
            placeholder="Nama Farm"
            value={values.name}
            onChange={handleInputChange}
          />
          <div className="seller-grid">
            <input
              type="text"
              name="street"
              placeholder="Jalan"
              value={values.street}
              readOnly
            />
            <input
              type="text"
              name="city"
              placeholder="Kota"
              value={values.city}
              readOnly
            />
          </div>
          <div className="seller-grid">
            <input
              type="text"
              name="state"
              placeholder="Wilayah"
              value={values.state}
              readOnly
            />
            <input
              type="text"
              name="postal_code"
              placeholder="Kode Pos"
              value={values.postal_code}
              readOnly
            />
          </div>
          <input
            type="text"
            name="farm_type"
            placeholder="Jenis Farm"
            value={values.farm_type}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={values.email}
            readOnly
          />
          <input
            type="text"
            name="phonenumber_farm"
            placeholder="Phone Number"
            value={values.phonenumber_farm}
            readOnly
          />
          <textarea
            name="description"
            placeholder="Deskripsi"
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterSeller;
