import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard";
import { DecodeRole } from "../../../helper/Decode";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "./_pengiriman.scss";

function Pengiriman() {
  const [pengiriman, setPengiriman] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = Cookies.get("login");
  const { getRole } = DecodeRole(); // Mengambil role yang sudah didecode
  const [role, setRole] = useState("");

  // Update role setelah didecode
  useEffect(() => {
    if (getRole) {
      setRole(getRole);
    }
  }, [getRole]);

  useEffect(() => {
    if (role) {
      fetchProsesPengiriman();
    }
  }, [role]); // Fetch hanya jalan setelah role didecode
  

  const fetchProsesPengiriman = async () => {
    try {
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "Silakan login terlebih dahulu.",
        });
        return;
      }

      let apiUrl =
        "https://farmsdistribution-2664aad5e284.herokuapp.com/proses-pengiriman";

      if (role.toLowerCase() === "penjual") {
        apiUrl += "/peternak/";
      } else if (role.toLowerCase() === "pengirim") {
        apiUrl += "/pengirim/";
      }

      console.log("Fetching from:", apiUrl);
      console.log("Token used:", token);
      console.log("Role:", role);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          login: token,
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${response.statusText}`
        );
      }

      const data = await response.json();
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Format data tidak sesuai. Data harus berupa array.");
      }

      setPengiriman(data.data);
    } catch (error) {
      console.error("Error fetching proses pengiriman:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.message ||
          "Terjadi kesalahan saat mengambil data proses pengiriman!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <div className="pengiriman-list-container">
        <div className="header">
          <h1>Proses Pengiriman</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="pengiriman-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Hari Dikirim</th>
                <th>Tanggal Dikirim</th>
                <th>Alamat Pengirim</th>
                <th>Alamat Penerima</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pengiriman.length > 0 ? (
                pengiriman.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.hari_dikirim || "Tidak tersedia"}</td>
                    <td>{new Date(item.tanggal_dikirim).toLocaleString()}</td>
                    <td>{item.alamat_pengirim || "Tidak tersedia"}</td>
                    <td>{item.alamat_penerima || "Tidak tersedia"}</td>
                    <td>
                      <span
                        className={`status ${
                          item.status_pengiriman === "Pending"
                            ? "pending"
                            : "completed"
                        }`}
                      >
                        {item.status_pengiriman}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "10px" }}
                  >
                    Tidak ada data pengiriman.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </Dashboard>
  );
}

export default Pengiriman;
