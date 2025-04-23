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
    country: "Indonesia", // Default country
    lat: "", // Latitude
    lon: "", // Longitude
    email: "",
    phonenumber_farm: "",
    description: "",
    image_farm: null,
    farm_type: "",
  });

  const token = Cookies.get("login");

  useEffect(() => {
    // Fetch data from localStorage
    const fetchUserDataFromStorage = () => {
      const registerData = JSON.parse(localStorage.getItem("registerData"));
      if (registerData) {
        setValues((prevValues) => ({
          ...prevValues,
          email: registerData.email || "",
          phonenumber_farm: registerData.no_telp || "",
        }));
      }
    };

    // Fetch location for autofill
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setValues((prevValues) => ({
              ...prevValues,
              lat: latitude.toString(),
              lon: longitude.toString(),
            }));

            try {
              const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const { address } = response.data;

              setValues((prevValues) => ({
                ...prevValues,
                street: address?.road || prevValues.street || "Unknown Street",
                city:
                  address?.city ||
                  address?.town ||
                  address?.village ||
                  prevValues.city ||
                  "Unknown City",
                state: address?.state || prevValues.state || "Unknown State",
                postal_code:
                  address?.postcode || prevValues.postal_code || "00000",
              }));
            } catch (error) {
              Swal.fire({
                title: "Error",
                text: "Failed to fetch address. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          },
          (error) => {
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

    fetchUserDataFromStorage();
    fetchLocation();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setValues({ ...values, image_farm: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !values.name ||
      !values.street ||
      !values.city ||
      !values.state ||
      !values.postal_code ||
      !values.country ||
      !values.lat ||
      !values.lon ||
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
    formData.append("country", values.country);
    formData.append("lat", values.lat);
    formData.append("lon", values.lon);
    formData.append("email", values.email);
    formData.append("phonenumber_farm", values.phonenumber_farm);
    formData.append("description", values.description);
    formData.append("image_farm", values.image_farm);
    formData.append("farm_type", values.farm_type);

    try {
      const response = await axios.post(
        "https://farm-distribution-d0d1df93c0f1.herokuapp.com/peternakan",
        formData,
        {
          headers: {
            login: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Success",
          text: response.data.message || "Farm registration successful! Redirecting...",
          icon: "success",
          confirmButtonText: "OK",
        });
        window.location.href = "/dashboard";
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message || "Something went wrong!",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Something went wrong!",
        icon: "error",
        confirmButtonText: "OK",
      });
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
            placeholder="Nama Farm (required)"
            value={values.name}
            onChange={handleInputChange}
          />
          <div className="seller-grid">
            <input
              type="text"
              name="street"
              placeholder="Jalan (autofill)"
              value={values.street}
              readOnly
            />
            <input
              type="text"
              name="city"
              placeholder="Kota (autofill)"
              value={values.city}
              readOnly
            />
          </div>
          <div className="seller-grid">
            <input
              type="text"
              name="state"
              placeholder="Wilayah (autofill)"
              value={values.state}
              readOnly
            />
            <input
              type="text"
              name="postal_code"
              placeholder="Kode Pos (autofill)"
              value={values.postal_code}
              readOnly
            />
          </div>
          <input
            type="text"
            name="farm_type"
            placeholder="Jenis Farm (required)"
            value={values.farm_type}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email (autofill)"
            value={values.email}
            readOnly
          />
          <input
            type="text"
            name="phonenumber_farm"
            placeholder="Phone Number (autofill)"
            value={values.phonenumber_farm}
            readOnly
          />
          <textarea
            name="description"
            placeholder="Deskripsi (required)"
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
