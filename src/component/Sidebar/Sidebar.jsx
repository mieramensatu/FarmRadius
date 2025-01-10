import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js"; // Import CryptoJS untuk dekripsi
import Logo from "./../../assets/logo/logo-ayam-removebg-preview1.png";

function Sidebar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  // Dekripsi role dari cookies
  useEffect(() => {
    const decryptRole = () => {
      const encryptedRole = Cookies.get("role"); // Ambil role terenkripsi dari cookies
      if (encryptedRole) {
        try {
          // Dekripsi role menggunakan kunci rahasia
          const decryptedRole = CryptoJS.AES.decrypt(
            encryptedRole,
            "your-secret-key" // Gunakan kunci yang sama seperti saat enkripsi
          ).toString(CryptoJS.enc.Utf8);

          setRole(decryptedRole.toLowerCase()); // Simpan role yang didekripsi di state
        } catch (error) {
          console.error("Error decrypting role:", error);
        }
      }
    };

    decryptRole();
  }, []);

  // Fungsi logout
  const handleLogout = () => {
    Swal.fire({
      title: "Logout Berhasil!",
      text: "Anda telah berhasil logout.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      // Hapus token dan role dari cookies
      Cookies.remove("login");
      Cookies.remove("role");
      console.log("Token and role removed. Logged out successfully.");

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
              <Link to="/dashboard/verifikasi" data-menu="verifikasi" className="menu-item">
                <i className="ph ph-verifikasi"></i>
                <span>Verifikasi</span>
              </Link>
              <Link to="/dashboard/user" data-menu="user" className="menu-item">
                <i className="ph ph-user"></i>
                <span>User</span>
              </Link>
            </>
          )}
          {role === "penjual" && (
            <>
              <Link
                to="/dashboard/product"
                data-menu="product"
                className="menu-item"
              >
                <i className="ph ph-storefront"></i>
                <span>Product</span>
              </Link>
              <Link
                to="/dashboard/pesanan"
                data-menu="product"
                className="menu-item"
              >
                <i className="ph ph-storefront"></i>
                <span>Pemesanan</span>
              </Link>
            </>
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
