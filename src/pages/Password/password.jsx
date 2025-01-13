import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Resetpassword() {
  const [formData, setFormData] = useState({
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Passwords do not match!",
      });
      return;
    }

    const requestBody = {
      email: formData.email,
      no_telp: formData.number,
      new_password: formData.password,
    };

    try {
      const response = await fetch(
        "https://farmsdistribution-2664aad5e284.herokuapp.com/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password reset successfully!",
        });
        console.log(data);
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: `Failed to reset password: ${errorData.message}`,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error: ${error.message}`,
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-card__title">Reset your password</h2>
        <h1 className="login-card__subtitle">
          Enter your email to reset your password
        </h1>
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
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="number" className="login-form__label">
              Number
            </label>
            <input
              type="number"
              id="number"
              className="login-form__input"
              placeholder="Enter your number"
              name="number"
              value={formData.number}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="login-form__label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="login-form__input"
              placeholder="Enter your password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-form__button">
            Reset Password
          </button>
        </form>
        <p className="login-card__footer">
          Remember your password? <Link to="/login">Log in here</Link>
        </p>
      </div>
    </div>
  );
}

export default Resetpassword;
