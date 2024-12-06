import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js"; // Import library CryptoJS
import { Link } from "react-router-dom";

function Login() {
  axios.defaults.withCredentials = false;

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitted Values:", values);

      const response = await axios.post(
        "https://farmmonitoring-7f23543656d8.herokuapp.com/login",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server Response:", response.data);

      const { message = "", token = null, user = null } = response.data;

      if (user) {
        if (token) {
          // Simpan token ke Cookies
          Cookies.set("login", token, { expires: 7 });

          // Enkripsi role sebelum menyimpan ke cookie
          const encryptedRole = CryptoJS.AES.encrypt(
            user.nama_role,
            "your-secret-key"
          ).toString();
          Cookies.set("role", encryptedRole, { expires: 7 });
        }

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: message || "You have successfully logged in!",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href = "/product"; // Redirect setelah login
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: message || "Incorrect email or password!",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong!",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-card__title">Please enter your details</h2>
        <h1 className="login-card__subtitle">Welcome back</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="login-form__label">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="login-form__input"
              placeholder="Enter your email"
              name="email"
              onChange={handleInputChange}
              value={values.email}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="login-form__label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="login-form__input"
              placeholder="Enter your password"
              name="password"
              onChange={handleInputChange}
              value={values.password}
              required
            />
          </div>
          <button type="submit" className="login-form__button">
            Login
          </button>
        </form>
        <p className="login-card__footer">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
