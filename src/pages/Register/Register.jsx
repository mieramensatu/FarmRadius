import React, { useState } from "react";
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
    password: "",
  });

  const handleInputChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.nama || !values.no_telp || !values.email || !values.password) {
      Swal.fire({
        title: "Error",
        text: "All fields are required!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // Register request
      const registerResponse = await axios.post(
        "https://farmmonitoring-7f23543656d8.herokuapp.com/regis",
        values
      );

      console.log("Register Response:", registerResponse);

      if (registerResponse.data.status) {
        // Auto-login after successful registration
        const loginResponse = await axios.post(
          "https://farmdistribution-40a43a4491b1.herokuapp.com/login",
          { email: values.email, password: values.password },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Login Response:", loginResponse);

        const { token, user, message } = loginResponse.data;

        if (user && token) {
          // Save token and encrypted role in cookies
          Cookies.set("login", token, { expires: 7 });

          const encryptedRole = CryptoJS.AES.encrypt(
            user.nama_role,
            "your-secret-key"
          ).toString();
          Cookies.set("role", encryptedRole, { expires: 7 });

          Swal.fire({
            title: "Registration & Login Successful",
            text: "You have successfully registered and logged in!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.href = "/product"; // Redirect setelah login
          });
        } else {
          Swal.fire({
            title: "Login Failed",
            text: message || "Could not login after registration.",
            icon: "error",
            confirmButtonText: "Try Again",
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

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-card__title">Please fill in your details</h2>
        <h1 className="register-card__subtitle">Create an account</h1>
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
          Do you have an account?
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
