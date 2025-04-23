import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "./_pengirimanngirim.scss";

function PengirimanPengirim() {
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

      const apiUrl =
        "https://farm-distribution-d0d1df93c0f1.herokuapp.com/proses-pengiriman/pengirim/";
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

  const updatePengiriman = async (id, currentStatus) => {
    console.log("[DEBUG] Memulai update pengiriman untuk ID:", id);

    const { value: formValues } = await Swal.fire({
      title: "Update Status & Gambar",
      html: `
            <label>Status Pengiriman:</label>
            <select id="status" class="swal2-input">
                <option value="pending" ${
                  currentStatus === "pending" ? "selected" : ""
                }>Pending</option>
                <option value="delivery" ${
                  currentStatus === "delivery" ? "selected" : ""
                }>Delivery</option>
                <option value="completed" ${
                  currentStatus === "completed" ? "selected" : ""
                }>Completed</option>
            </select>
            <br/>
            <label>Upload Gambar (Opsional):</label>
            <input type="file" id="image" class="swal2-input" accept="image/*">
        `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: () => {
        const status = document.getElementById("status").value;
        const imageFile = document.getElementById("image").files[0];

        if (!status) {
          Swal.showValidationMessage("Status harus dipilih!");
          return false;
        }

        return { status, imageFile };
      },
    });

    if (!formValues) {
      console.log("[DEBUG] Pengguna membatalkan pembaruan status.");
      return;
    }

    try {
      console.log("[DEBUG] Menyiapkan data untuk pembaruan...");
      const formData = new FormData();
      formData.append("status_pengiriman", formValues.status);
      formData.append("id_pengirim", "23");
      

      if (formValues.imageFile) {
        formData.append("image_pengiriman", formValues.imageFile);
        console.log("[DEBUG] Mengunggah gambar:", formValues.imageFile.name);
      } else {
        console.log("[DEBUG] Tidak ada gambar yang diunggah.");
      }

      console.log("[DEBUG] Data yang dikirim:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const updateUrl = `https://farm-distribution-d0d1df93c0f1.herokuapp.com/proses-pengiriman/edit/${id}`;
      console.log("[DEBUG] Mengirim permintaan PUT ke:", updateUrl);

      const response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          login: token,
          "enctype": "multipart/form-data"
        },
        body: formData,
      });

      console.log("[DEBUG] Response status:", response.status);
      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(
          errorResponse || `HTTP error! Status: ${response.status}`
        );
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Status & Gambar telah diperbarui.",
      });

      console.log("[DEBUG] Update berhasil, merefresh data...");
      fetchProsesPengiriman();
    } catch (error) {
      console.error("[DEBUG] Gagal memperbarui data pengiriman:", error);
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
                <th>Tanggal Diterima</th>
                <th>Hari Diterima</th>
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
                        ? new Date(item.tanggal_dikirim).toLocaleDateString()
                        : "Tidak tersedia"}
                    </td>
                    <td>
                      {item.tanggal_diterima
                        ? new Date(item.tanggal_diterima).toLocaleDateString()
                        : "Tidak tersedia"}
                    </td>
                    <td>{item.hari_diterima || "Tidak tersedia"}</td>
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
                          updatePengiriman(
                            item.id,
                            item.status_pengiriman,
                            item.id_pengirim
                          )
                        }
                      >
                        Update
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

export default PengirimanPengirim;
