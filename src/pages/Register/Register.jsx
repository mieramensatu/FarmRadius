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
  });

  useEffect(() => {
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
              Swal.fire({
                title: "Error",
                text: "Failed to fetch address from coordinates.",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          },
          (error) => {
            console.error("Error getting user location:", error);
            Swal.fire({
              title: "Error",
              text: "Could not access your location. Please enable GPS.",
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

    fetchUserLocation();
  }, []);

  const handleInputChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleLogin = async (email, password) => {
    try {
      const loginResponse = await axios.post(
        "https://farmdistribution-40a43a4491b1.herokuapp.com/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, user } = loginResponse.data;

      if (user && token) {
        Cookies.set("login", token, { expires: 7 });

        const encryptedRole = CryptoJS.AES.encrypt(
          user.nama_role,
          "your-secret-key"
        ).toString();
        Cookies.set("role", encryptedRole, { expires: 7 });

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome to the platform!",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href = "/product";
        });
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Automatic login failed. Please try logging in manually.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !values.nama ||
      !values.no_telp ||
      !values.email ||
      !values.password ||
      !values.alamat
    ) {
      Swal.fire({
        title: "Error",
        text: "All fields are required!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const registerPayload = {
        nama: values.nama,
        no_telp: values.no_telp,
        email: values.email,
        alamat: values.alamat,
        id_role: 9,
        password: values.password,
      };

      const registerResponse = await axios.post(
        "https://farmdistribution-40a43a4491b1.herokuapp.com/regis",
        registerPayload
      );

      if (registerResponse.data.status) {
        localStorage.setItem("registerData", JSON.stringify(values));

        Swal.fire({
          title: "Registration Successful",
          text: `You are registered as a buyer!`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          handleLogin(values.email, values.password);
        });
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

  return (
    <div className="register-container">
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
          <button type="submit" className="register-form__button">
            Register
          </button>
        </form>
        <p className="register-card-footer">
          Do you have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
