import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../../Dashboard";
import Cookies from "js-cookie";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./_user.scss"; // Import SCSS

function AllUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("login");

    // Fungsi untuk fetch data user
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://farmdistribution-40a43a4491b1.herokuapp.com/profile/all",
          {
            method: "GET",
            headers: {
              login: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data.data); // Simpan data user ke state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
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
          const response = await fetch(
            `https://farmdistribution-40a43a4491b1.herokuapp.com/profile/delete/${id}`,
            {
              method: "DELETE",
              headers: {
                login: token,
              },
            }
          );

          if (response.ok) {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "The user has been deleted.",
            });
            setUsers(users.filter((user) => user.id_user !== id)); // Hapus user dari state
          } else {
            const result = await response.json();
            Swal.fire({
              icon: "error",
              title: "Failed to Delete",
              text: result.message || "An error occurred.",
            });
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while deleting the user.",
          });
        }
      }
    });
  };

  return (
    <Dashboard>
      <div className="user-list-container">
        <div className="header">
          <h1>User List</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id_user}>
                  <td>{index + 1}</td>
                  <td>{user.nama}</td>
                  <td>{user.email}</td>
                  <td>{user.no_telp}</td>
                  <td>{user.role_name}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(user.id_user)}
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

export default AllUser;
