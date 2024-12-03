import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Logo from "./../../assets/logo/logo-ayam-removebg-preview1.png";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("login");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove("login");
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo to-link">
        <img src={Logo} alt="MakaNear Logo" />
        <span>MakaNear</span>
      </Link>
      <div className="nav-main">
        <div className="search">
          <button>
            <span className="material-symbols-rounded"> travel_explore </span>
          </button>
          <input type="text" placeholder="Search in MakaNear" />
        </div>
        {/* Tampilkan links hanya jika pengguna sudah login */}
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
        <span className="material-symbols-rounded"> local_mall </span>
        <Link to="/dashboard">
          <span className="material-symbols-rounded"> storefront </span>
        </Link>
        {!isLoggedIn ? (
          // Jika belum login, tampilkan tombol login
          <Link className="to-login" to="/login">
            <span className="material-symbols-rounded"> account_circle </span>
          </Link>
        ) : (
          // Jika sudah login, tampilkan tombol logout
          <span
            className="material-symbols-rounded logout"
            onClick={handleLogout}
          >
            move_item
          </span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
