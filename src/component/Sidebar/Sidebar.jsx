import React from "react";
import { Link } from "react-router-dom";
import Logo from "./../../assets/logo/logo-ayam-removebg-preview1.png";

function Sidebar() {
  return (
    <>
      <aside className="navigation">
        <div className="navigation-logo">
          <Link href="/" className="nav-logo">
            <img src={Logo} alt="GoBiz Logo" />
            <span>FarmRadius</span>
          </Link>
          <span className="material-symbols-outlined"> left_panel_close </span>
        </div>

        <div className="navigation-nav">
          <Link href="/dashboard" data-menu="dashboard" className="menu-item">
            <i className="ph ph-gauge"></i>
            <span>Dashboard</span>
          </Link>
          <Link
            href="/Management-product"
            data-menu="management-product"
            className="menu-item"
          >
            <i className="ph ph-storefront"></i>
            <span>Product</span>
          </Link>
          <Link href="/Management-order" data-menu="management-order" className="menu-item">
            <i className="ph ph-shopping-cart"></i>
            <span>Order</span>
          </Link>
          <Link href="/map" data-menu="map" className="menu-item">
            <i className="ph ph-map-pin-area"></i>
            <span>Map</span>
          </Link>
          <Link className="logout" href="#">
            <i className="ph ph-sign-out"></i>
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
