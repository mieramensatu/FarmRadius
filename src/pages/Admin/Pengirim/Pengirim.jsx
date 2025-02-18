import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "./_pengirim.scss";

function Pengirim() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPengirim();
  }, []);

  const handleAddPengirim = async () => {
    const token = Cookies.get("login");

    const { value: formValues } = await Swal.fire({
      title: "Tambah Pengirim",
      html:
        `<input id="swal-email" class="swal2-input" placeholder="Email">` +
        `<input id="swal-phone" class="swal2-input" placeholder="Phone">` +
        `<input id="swal-name" class="swal2-input" placeholder="Name">` +
        `<input id="swal-address" class="swal2-input" placeholder="Address">` +
        `<input id="swal-vehicle_plate" class="swal2-input" placeholder="Vehicle Plate">` +
        `<input id="swal-vehicle_type" class="swal2-input" placeholder="Vehicle Type">` +
        `<input id="swal-vehicle_color" class="swal2-input" placeholder="Vehicle Color">` +
        `<input id="swal-password" class="swal2-input" type="password" placeholder="Password">`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          email: document.getElementById("swal-email").value,
          phone: document.getElementById("swal-phone").value,
          name: document.getElementById("swal-name").value,
          address: document.getElementById("swal-address").value,
          vehicle_plate: document.getElementById("swal-vehicle_plate").value,
          vehicle_type: document.getElementById("swal-vehicle_type").value,
          vehicle_color: document.getElementById("swal-vehicle_color").value,
          Password: document.getElementById("swal-password").value,
        };
      },
    });

    if (formValues) {
      try {
        const response = await fetch(
          "https://farmsdistribution-2664aad5e284.herokuapp.com/add/pengirim",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              login: token,
            },
            body: JSON.stringify(formValues),
          }
        );

        const textResponse = await response.text(); // Baca response sebagai teks
        console.log("Raw Response:", textResponse); // Debugging

        if (!response.ok) {
          // Cek jika error disebabkan oleh duplikasi email
          if (
            textResponse.includes(
              "duplicate key value violates unique constraint"
            )
          ) {
            Swal.fire({
              icon: "error",
              title: "Gagal Menambahkan Pengirim",
              text: "Email sudah terdaftar. Gunakan email lain.",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal Menambahkan Pengirim",
              text: textResponse || "Terjadi kesalahan!",
            });
          }
          return;
        }

        const result = JSON.parse(textResponse); // Parse jika tidak error

        Swal.fire({
          icon: "success",
          title: "Pengirim Ditambahkan",
          text: `Pengirim ${formValues.name} berhasil ditambahkan!`,
        });

        // Tambahkan ke state users tanpa perlu melakukan fetch ulang
        setUsers((prevUsers) => [...prevUsers, result.pengirim]);
      } catch (error) {
        console.error("Error adding pengirim:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Terjadi kesalahan saat menambahkan pengirim!",
        });
      }
    }
  }
  const fetchPengirim = async () => {
    try {
      const token = Cookies.get("login"); 
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "Silakan login terlebih dahulu.",
        });
        return;
      }

      const response = await fetch(
        "https://farmsdistribution-2664aad5e284.herokuapp.com/pengirim",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            login: token,
          },
        }
      );

      const responseText = await response.text();
      console.log("API Response:", responseText);

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text:
            responseText || "Terjadi kesalahan dalam mengambil data pengirim!",
        });
        return;
      }

      const data = JSON.parse(responseText);

      // Pastikan data.pengirims valid sebelum menggunakannya
      if (!data.pengirims || !Array.isArray(data.pengirims)) {
        throw new Error(
          "Invalid data format: 'pengirims' is missing or not an array."
        );
      }

      setUsers(data.pengirims); // Simpan data ke state
    } catch (error) {
      console.error("Error fetching pengirims:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat mengambil data pengirim!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <div className="user-list-container">
        <div className="header">
          <h1>Data Pengiriman</h1>
          <button className="add-button" onClick={handleAddPengirim}>
            Tambah Pengiriman
          </button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Id_user</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Alamat</th>
                <th>Plat Nomor</th>
                <th>Type kendaraan</th>
                <th>Warna kendaraan</th>
              </tr>
            </thead>
            <tbody>
              {users && Array.isArray(users) && users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.id || "Nama Tidak Tersedia"}</td>
                    <td>{user.name || user.nama || "Nama Tidak Tersedia"}</td>
                    <td>{user.email || "Email Tidak Tersedia"}</td>
                    <td>{user.phone || "Telepon Tidak Tersedia"}</td>
                    <td>{user.address || "Alamat Tidak Tersedia"}</td>
                    <td>{user.vehicle_plate || "Plat Tidak Tersedia"}</td>
                    <td>{user.vehicle_type || "Tipe Tidak Tersedia"}</td>
                    <td>{user.vehicle_color || "Warna Tidak Tersedia"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "center", padding: "10px" }}
                  >
                    Tidak ada data pengirim.
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

export default Pengirim;
