import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

function Register() {
  axios.defaults.withCredentials = false;

  const [values, setValues] = useState({
    nama: "",
    no_telp: "",
    email: "",
    alamat: "",
    password: "",
    role: "pembeli", // Default role is Pembeli
  });

  const [roles, setRoles] = useState([]);
  const [isSellerForm, setIsSellerForm] = useState(false);
  const [sellerDetails, setSellerDetails] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    image_farm: null,
    lat: "",
    lon: "",
    farm_type: "",
    phonenumber_farm: "",
    email: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          "https://farmdistribution-40a43a4491b1.herokuapp.com/role"
        );
        const filteredRoles = response.data.roles.filter(
          (role) =>
            role.name_role.toLowerCase() === "pembeli" ||
            role.name_role.toLowerCase() === "penjual"
        );
        setRoles(filteredRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();

    // Automatically fetch user location for address
    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const address = response.data.display_name;
              setValues((prevValues) => ({ ...prevValues, alamat: address }));
            } catch (error) {
              console.error("Error fetching address from coordinates:", error);
            }
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    fetchUserLocation();
  }, []);

  const handleInputChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSellerInputChange = (e) => {
    const { name, value } = e.target;
    setSellerDetails({ ...sellerDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSellerDetails({ ...sellerDetails, image_farm: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.nama || !values.no_telp || !values.email || !values.password || !values.alamat) {
      Swal.fire({
        title: "Error",
        text: "All fields are required!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const selectedRole = roles.find(
        (role) => role.name_role.toLowerCase() === values.role
      );

      const registerPayload = {
        nama: values.nama,
        no_telp: values.no_telp,
        email: values.email,
        alamat: values.alamat,
        id_role: selectedRole?.id,
        password: values.password,
      };

      const registerResponse = await axios.post(
        "https://farmdistribution-40a43a4491b1.herokuapp.com/regis",
        registerPayload
      );

      if (registerResponse.data.status) {
        if (values.role === "penjual") {
          setSellerDetails({
            ...sellerDetails,
            email: values.email,
            phonenumber_farm: values.no_telp,
          });
          setIsSellerForm(true);
        } else {
          Swal.fire({
            title: "Registration Successful",
            text: "You are registered as a buyer!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.href = "/product";
          });
        }
      } else {
        Swal.fire({
          title: "Registration Failed",
          text: registerResponse.data.message || "Invalid data!",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);

      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Something went wrong!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSellerSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(sellerDetails).forEach((key) => {
      formData.append(key, sellerDetails[key]);
    });

    try {
      const response = await axios.post("http://localhost:8080/peternakan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Success",
        text: "Farm registered successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/dashboard";
      });
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
    <div className="register-container">
      {!isSellerForm ? (
        <div className="register-card">
          <h2 className="register-card__title">Please fill in your details</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="register-form__label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="register-form__input"
                placeholder="Enter your full name"
                name="nama"
                onChange={handleInputChange}
                value={values.nama}
              />
            </div>
            <div>
              <label htmlFor="phone" className="register-form__label">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                className="register-form__input"
                placeholder="Enter your phone number"
                name="no_telp"
                onChange={handleInputChange}
                value={values.no_telp}
              />
            </div>
            <div>
              <label htmlFor="address" className="register-form__label">
                Address
              </label>
              <input
                type="text"
                id="address"
                className="register-form__input"
                placeholder="Enter your address"
                name="alamat"
                onChange={handleInputChange}
                value={values.alamat}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="email" className="register-form__label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="register-form__input"
                placeholder="Enter your email"
                name="email"
                onChange={handleInputChange}
                value={values.email}
              />
            </div>
            <div>
              <label htmlFor="password" className="register-form__label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="register-form__input"
                placeholder="Enter your password"
                name="password"
                onChange={handleInputChange}
                value={values.password}
              />
            </div>
            <div>
              <label className="register-form__label">Register as:</label>
              <div className="register-form__radio-group">
                {roles.map((role) => (
                  <label key={role.id}>
                    <input
                      type="radio"
                      name="role"
                      value={role.name_role.toLowerCase()}
                      checked={values.role === role.name_role.toLowerCase()}
                      onChange={handleInputChange}
                    />
                    {role.name_role}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="register-form__button">
              Register
            </button>
          </form>
        </div>
      ) : (
        <div className="register-card">
          <h2 className="register-card__title">Register Farm Details</h2>
          <form className="register-form" onSubmit={handleSellerSubmit}>
            {imagePreview && <img src={imagePreview} alt="Farm" style={{ width: "100%", height: "200px", objectFit: "cover", marginBottom: "1rem" }} />}
            <div>
              <label htmlFor="name" className="register-form__label">
                Farm Name
              </label>
              <input
                type="text"
                id="name"
                className="register-form__input"
                placeholder="Enter farm name"
                name="name"
                onChange={handleSellerInputChange}
                value={sellerDetails.name}
                required
              />
            </div>
            <div>
              <label htmlFor="street" className="register-form__label">
                Street
              </label>
              <input
                type="text"
                id="street"
                className="register-form__input"
                placeholder="Enter street address"
                name="street"
                onChange={handleSellerInputChange}
                value={sellerDetails.street}
                required
              />
            </div>
            <div>
              <label htmlFor="city" className="register-form__label">
                City
              </label>
              <input
                type="text"
                id="city"
                className="register-form__input"
                placeholder="Enter city"
                name="city"
                onChange={handleSellerInputChange}
                value={sellerDetails.city}
                required
              />
            </div>
            <div>
              <label htmlFor="state" className="register-form__label">
                State
              </label>
              <input
                type="text"
                id="state"
                className="register-form__input"
                placeholder="Enter state"
                name="state"
                onChange={handleSellerInputChange}
                value={sellerDetails.state}
                required
              />
            </div>
            <div>
              <label htmlFor="postal_code" className="register-form__label">
                Postal Code
              </label>
              <input
                type="text"
                id="postal_code"
                className="register-form__input"
                placeholder="Enter postal code"
                name="postal_code"
                onChange={handleSellerInputChange}
                value={sellerDetails.postal_code}
                required
              />
            </div>
            <div>
              <label htmlFor="country" className="register-form__label">
                Country
              </label>
              <input
                type="text"
                id="country"
                className="register-form__input"
                placeholder="Enter country"
                name="country"
                onChange={handleSellerInputChange}
                value={sellerDetails.country}
                required
              />
            </div>
            <div>
              <label htmlFor="lat" className="register-form__label">
                Latitude
              </label>
              <input
                type="text"
                id="lat"
                className="register-form__input"
                placeholder="Enter latitude"
                name="lat"
                onChange={handleSellerInputChange}
                value={sellerDetails.lat}
                required
              />
            </div>
            <div>
              <label htmlFor="lon" className="register-form__label">
                Longitude
              </label>
              <input
                type="text"
                id="lon"
                className="register-form__input"
                placeholder="Enter longitude"
                name="lon"
                onChange={handleSellerInputChange}
                value={sellerDetails.lon}
                required
              />
            </div>
            <div>
              <label htmlFor="farm_type" className="register-form__label">
                Farm Type
              </label>
              <input
                type="text"
                id="farm_type"
                className="register-form__input"
                placeholder="Enter farm type"
                name="farm_type"
                onChange={handleSellerInputChange}
                value={sellerDetails.farm_type}
                required
              />
            </div>
            <div>
              <label htmlFor="phonenumber_farm" className="register-form__label">
                Phone Number
              </label>
              <input
                type="text"
                id="phonenumber_farm"
                className="register-form__input"
                value={values.no_telp}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="description" className="register-form__label">
                Description
              </label>
              <textarea
                id="description"
                className="register-form__input"
                placeholder="Enter description"
                name="description"
                onChange={handleSellerInputChange}
                value={sellerDetails.description}
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="image_farm" className="register-form__label">
                Farm Image
              </label>
              <input
                type="file"
                id="image_farm"
                className="register-form__input"
                name="image_farm"
                onChange={handleFileChange}
                required
              />
            </div>
            <button type="submit" className="register-form__button">
              Register Farm
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Register;