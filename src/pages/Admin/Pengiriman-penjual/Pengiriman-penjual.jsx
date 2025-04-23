import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "./_pengirimanpenjual.scss";

function PengirimanPenjual() {
  const [pengiriman, setPengiriman] = useState([]);
  const [pengirimList, setPengirimList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = Cookies.get("login");

  useEffect(() => {
    fetchProsesPengiriman();
    fetchPengirimList();
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

      const apiUrl =
        "https://farm-distribution-d0d1df93c0f1.herokuapp.com/proses-pengiriman/peternak/";

      const response = await fetch(apiUrl, {
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
        text:
          error.message || "Terjadi kesalahan saat mengambil data pengiriman!",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPengirimList = async () => {
    try {
      console.log("Mengambil daftar pengirim...");
      const response = await fetch(
        "https://farm-distribution-d0d1df93c0f1.herokuapp.com/pengirim",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            login: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data pengirim diterima:", data);

      // Periksa apakah data ada dan dalam format array
      if (!data.pengirims || !Array.isArray(data.pengirims)) {
        throw new Error("Format data tidak sesuai.");
      }

      setPengirimList(data.pengirims); // Simpan data ke state
    } catch (error) {
      console.error("Error fetching pengirim:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengambil daftar pengirim.",
      });
    }
  };

  const editPengiriman = async (id, currentPengirim) => {
    const { value: selectedPengirim } = await Swal.fire({
      title: "Edit ID Pengirim",
      input: "select",
      inputOptions: pengirimList.reduce((obj, pengirim) => {
        obj[pengirim.id] = `${pengirim.id} - ${pengirim.name}`;
        return obj;
      }, {}),
      inputPlaceholder: "Pilih pengirim",
      inputValue: currentPengirim,
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: (value) => {
        return value ? value : null;
      },
    });

    if (selectedPengirim) {
      updatePengiriman(id, selectedPengirim);
    }
  };

  const updatePengiriman = async (id, idPengirim) => {
    try {
      const formData = new FormData();
      formData.append("hari_dikirim", "jumat");
      formData.append("tanggal_dikirim", "2025-02-08");
      formData.append("hari_diterima", "Senins");
      formData.append("tanggal_diterima", "2025-02-10");
      formData.append("id_pengirim", idPengirim);
      formData.append("status_pengiriman", "on the way");
      formData.append("alamat_pengirim", "Jl. ABC No. 50");
      formData.append("alamat_penerima", "Jl. XYZ No. 30");

      console.log("Mengirim data update:", formData);

      // Debug isi formData untuk memastikan data benar
      for (const pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await fetch(
        `https://farm-distribution-d0d1df93c0f1.herokuapp.com/proses-pengiriman/edit/${id}`,
        {
          method: "PUT",
          headers: {
            login: token, // Jangan tambahkan 'Content-Type' karena FormData akan otomatis menetapkannya
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(
          errorResponse || `HTTP error! Status: ${response.status}`
        );
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "ID Pengirim telah diperbarui.",
      });

      fetchProsesPengiriman();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Failed to update proses pengiriman",
      });
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
                <th>Hari Diterima</th>
                <th>Tanggal Diterima</th>
                <th>Alamat Pengirim</th>
                <th>Alamat Penerima</th>
                <th>Status</th>
                <th>Gambar</th>
                <th>Aksi</th>
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
                    <td>{item.hari_diterima || "Belum diterima"}</td>
                    <td>
                      {item.tanggal_diterima
                        ? new Date(item.tanggal_diterima).toLocaleDateString()
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
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() =>
                          editPengiriman(item.id, item.id_pengirim)
                        }
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
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

export default PengirimanPenjual;
