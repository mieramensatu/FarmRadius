import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2"; // Import SweetAlert2
import Logo from "./../../assets/logo/logo-ayam-removebg-preview1.png";

function Sidebar() {
  const navigate = useNavigate();

  // Fungsi logout
  const handleLogout = () => {
    Swal.fire({
      title: "Logout Berhasil!",
      text: "Anda telah berhasil logout.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      // Hapus token dari cookies
      Cookies.remove("login");
      console.log("Token removed. Logged out successfully.");

      // Arahkan ke halaman login
      navigate("/login");
    });
  };

  return (
    <>
      <aside className="navigation">
        <div className="navigation-logo">
          <Link to="/" className="nav-logo">
            <img src={Logo} alt="GoBiz Logo" />
            <span>FarmRadius</span>
          </Link>
          <span className="material-symbols-outlined">left_panel_close</span>
        </div>

        <div className="navigation-nav">
          <Link to="/dashboard" data-menu="dashboard" className="menu-item">
            <i className="ph ph-gauge"></i>
            <span>Dashboard</span>
          </Link>
          <Link to="/dashboard/product" data-menu="product" className="menu-item">
            <i className="ph ph-storefront"></i>
            <span>Product</span>
          </Link>
          <Link to="/management-order" data-menu="management-order" className="menu-item">
            <i className="ph ph-shopping-cart"></i>
            <span>Order</span>
          </Link>
          <Link to="/map" data-menu="map" className="menu-item">
            <i className="ph ph-map-pin-area"></i>
            <span>Map</span>
          </Link>
          <Link className="logout" onClick={handleLogout}>
            <i className="ph ph-sign-out"></i>
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
