import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Logo from "./../../assets/logo/logo-ayam-removebg-preview1.png";
import { DecodeRole } from "../../helper/Decode";

function Navbar() {
  const {getRole} = DecodeRole();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    // Ambil token dan role dari Cookies
    const token = Cookies.get("login");
    setIsLoggedIn(!!token);
    setRole(getRole || "");
  }, [getRole]);

  const handleLogout = () => {
    Cookies.remove("login");
    Cookies.remove("role");
    setIsLoggedIn(false);
    setRole("");
    window.location.reload();
  };

  return (
    <nav className="nav">
      {/* Logo */}
      <Link to="/" className="nav-logo to-link">
        <img src={Logo} alt="MakaNear Logo" />
        <span>MakaNear</span>
      </Link>

      <div className="nav-main">
        <div className="search">
          <button>
            <span className="material-symbols-rounded">travel_explore</span>
          </button>
          <input type="text" placeholder="Search in MakaNear" />
        </div>

        {isLoggedIn && (
          <div className="links">
            <Link className="to-link" to="/">
              Beranda
            </Link>
            <Link className="to-link" to="/product">
              Product
            </Link>
          </div>
        )}
      </div>

      <div className="nav-others">
        <span className="material-symbols-rounded">local_mall</span>

        {(role === "Admin" || role === "Penjual") && (
          <Link to="/dashboard">
            <span className="material-symbols-rounded">storefront</span>
          </Link>
        )}
        {role === "Pembeli" && (
          <Link to="/profile">
            <span className="material-symbols-rounded profile">person</span>
          </Link>
        )}

        {!isLoggedIn ? (
          <Link className="to-login" to="/login">
            <span className="material-symbols-rounded">account_circle</span>
          </Link>
        ) : (
          <div className="logout-section">
            <span
              className="material-symbols-rounded logout"
              onClick={handleLogout}
              title="Logout"
            >
              logout
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
