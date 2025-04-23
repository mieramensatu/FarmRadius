import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "./_pengirimanbeli.scss";

function PengirimanPembeli() {
  const [pengiriman, setPengiriman] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("login");

  useEffect(() => {
    fetchProsesPengiriman();
  }, []);

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

      const response = await fetch("https://farm-distribution-d0d1df93c0f1.herokuapp.com/proses-pengiriman", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          login: token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Format data tidak sesuai. Data harus berupa array.");
      }

      setPengiriman(data.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Terjadi kesalahan saat mengambil data pengiriman!",
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
                <th>Bukti Pengiriman</th>
              </tr>
            </thead>
            <tbody>
              {pengiriman.length > 0 ? (
                pengiriman.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.hari_dikirim || "Tidak tersedia"}</td>
                    <td>
                      {item.tanggal_dikirim
                        ? new Date(item.tanggal_dikirim).toLocaleString()
                        : "Tidak tersedia"}
                    </td>
                    <td>{item.alamat_pengirim || "Tidak tersedia"}</td>
                    <td>{item.alamat_penerima || "Tidak tersedia"}</td>
                    <td>{item.status_pengiriman}</td>
                    <td>
                      {item.image_pengiriman ? (
                        <img
                          src={item.image_pengiriman
                            .replace("github.com", "raw.githubusercontent.com")
                            .replace("/blob/", "/")}
                          alt="Pengiriman"
                          className="image-preview"
                          style={{ width: "100px", height: "auto" }}
                        />
                      ) : (
                        "Tidak tersedia"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
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

export default PengirimanPembeli;
