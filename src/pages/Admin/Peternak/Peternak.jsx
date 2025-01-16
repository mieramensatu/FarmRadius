import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "./_peternak.scss";

function Toko() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("login");

    // Fungsi untuk fetch data toko
    const fetchFarms = async () => {
      try {
        const response = await fetch(
          "https://farmsdistribution-2664aad5e284.herokuapp.com/all/peternak",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              login: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch farms");
        }

        const data = await response.json();
        console.log("Fetched farms data:", data);
        setFarms(data.data);
      } catch (error) {
        console.error("Error fetching farms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  const handleDelete = async (farm_id) => {
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
          console.log("Attempting to delete farm with farm_id:", farm_id);
          const response = await fetch(
            `https://farmsdistribution-2664aad5e284.herokuapp.com/peternakan/delete?id=${farm_id}`,
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
            setFarms((prevFarms) =>
              prevFarms.filter((farm) => farm.farm_id !== farm_id)
            );
          } else {
            const result = await response.json();
            console.error("Server response:", result);
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
                <tr key={farm.farm_id}>
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
                      onClick={() => handleDelete(farm.farm_id)}
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
