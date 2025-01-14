import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard";
import Cookies from "js-cookie";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./_peternak.scss"; // Import SCSS

function Toko() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("login");

    // Fungsi untuk fetch data toko
    const fetchFarms = async () => {
      try {
        const response = await fetch("http://localhost:8080/all/peternak", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            login: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch farms");
        }

        const data = await response.json();
        console.log("Fetched farms data:", data); // Debug log untuk data
        setFarms(data.data); // Simpan data toko ke state
      } catch (error) {
        console.error("Error fetching farms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  const handleDelete = async (id) => {
    const token = Cookies.get("login");

    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log("Attempting to delete farm with ID:", id); // Debug log untuk ID
          const response = await fetch(
            `http://localhost:8080/product/delete?id=${id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                login: token,
              },
            }
          );

          if (response.ok) {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "The farm has been deleted.",
            });
            setFarms((prevFarms) => prevFarms.filter((farm) => farm.id !== id)); // Hapus farm dari state
          } else {
            const result = await response.json();
            console.error("Server response:", result); // Debug log respons server
            Swal.fire({
              icon: "error",
              title: "Failed to Delete",
              text: result.message || "An error occurred.",
            });
          }
        } catch (error) {
          console.error("Error deleting farm:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while deleting the farm.",
          });
        }
      }
    });
  };

  return (
    <Dashboard>
      <div className="farm-list-container">
        <div className="header">
          <h1>Farm List</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="farm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {farms.map((farm, index) => (
                <tr key={farm.id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={farm.image_farm || "https://via.placeholder.com/150"}
                      alt={farm.nama}
                      className="farm-image"
                    />
                  </td>
                  <td>{farm.nama}</td>
                  <td>{farm.description}</td>
                  <td>{farm.email}</td>
                  <td>{farm.no_telp}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(farm.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Dashboard>
  );
}

export default Toko;
