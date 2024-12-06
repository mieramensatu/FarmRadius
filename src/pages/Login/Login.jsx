import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie"; // Import js-cookie
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Debug: Tampilkan data yang akan dikirim
    console.log("Submitted Values:", values);

    // Kirim data login ke server
    axios
      .post(
        "https://farmdistribution-40a43a4491b1.herokuapp.com/login",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Server Response:", response.data); // Debugging respons server

        // Ambil data dari respons server
        const { message = "", token = null, user = null } = response.data;

        if (user) {
          // Simpan token ke cookies
          if (token) {
            Cookies.set("login", token, { expires: 7 }); // Token disimpan selama 7 hari
          }

          // Tampilkan notifikasi sukses
          Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: message || "You have successfully logged in!",
            confirmButtonText: "OK",
          }).then(() => {
            // Redirect ke halaman produk
            window.location.href = "/product";
          });
        } else {
          // Tampilkan notifikasi gagal
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: message || "Incorrect email or password!",
            confirmButtonText: "Try Again",
          });
        }
      })
      .catch((error) => {
        console.error("Login Error:", error.response?.data || error.message); // Debugging error

        // Tangani error dari server
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Something went wrong!",
          confirmButtonText: "OK",
        });
      });
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
