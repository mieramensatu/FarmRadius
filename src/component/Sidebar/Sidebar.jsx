import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Logo from "./../../assets/logo/logo-ayam-removebg-preview1.png";

function Sidebar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(Cookies.get("cachedRole") || null);

  // Fetch role dari API atau cookies
  useEffect(() => {
    if (!role) {
      const fetchRole = async () => {
        try {
          const token = Cookies.get("login");
          const response = await fetch("https://farmdistribution-40a43a4491b1.herokuapp.com/role", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const userRole = data.roles.find(
              (role) => role.status && (role.name_role === "Admin" || role.name_role === "Penjual")
            );
            const detectedRole = userRole ? userRole.name_role.toLowerCase() : null;
            setRole(detectedRole);
            Cookies.set("cachedRole", detectedRole); // Cache role in cookies
          } else {
            console.error("Failed to fetch roles");
          }
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      };

      fetchRole();
    }
  }, [role]);

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
      Cookies.remove("cachedRole");
      console.log("Token and cached role removed. Logged out successfully.");

      // Arahkan ke halaman login
      navigate("/login");
    });
  };

  return (
    <>
      <aside className="navigation">
        <div className="navigation-logo">
          <Link to="/" className="nav-logo">
            <img src={Logo} alt="FarmRadius Logo" />
            <span>FarmRadius</span>
          </Link>
          <span className="material-symbols-outlined">left_panel_close</span>
        </div>

        <div className="navigation-nav">
          <Link to="/dashboard" data-menu="dashboard" className="menu-item">
            <i className="ph ph-gauge"></i>
            <span>Dashboard</span>
          </Link>
          {role === "admin" && (
            <>
              <Link to="/dashboard/toko" data-menu="toko" className="menu-item">
                <i className="ph ph-barn"></i>
                <span>Toko Peternak</span>
              </Link>
              <Link to="/dashboard/user" data-menu="user" className="menu-item">
                <i className="ph ph-user"></i>
                <span>User</span>
              </Link>
            </>
          )}
          {role === "penjual" && (
            <Link to="/dashboard/product" data-menu="product" className="menu-item">
              <i className="ph ph-storefront"></i>
              <span>Product</span>
            </Link>
          )}
        </div>
        <div className="navigation-footer">
          <button className="menu-item logout-button" onClick={handleLogout}>
            <i className="ph ph-sign-out"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
