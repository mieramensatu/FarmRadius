import React from "react";
import { Link } from "react-router-dom";

function Resetpassword() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-card__title">Reset your password</h2>
        <h1 className="login-card__subtitle">
          Enter your email to reset your password
        </h1>
        <form className="login-form">
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
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="login-form__label">
            </label>
              Password
            <input
              type="password"
              id="password"
              className="login-form__input"
              placeholder="Enter your password"
              name="password"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="login-form__label">
            Confirm Password
            </label>
            <input
              type="password"
              id="password"
              className="login-form__input"
              placeholder="Enter your password"
              name="password"
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
