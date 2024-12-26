import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../../Dashboard";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "./_user.scss"; // SCSS styling

function AllUser() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("login");

    // Fetch Users
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/profile/all",
          {
            method: "GET",
            headers: {
              login: token,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    // Fetch Roles
    const fetchRoles = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/role",
          {
            method: "GET",
            headers: {
              login: token,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch roles");

        const data = await response.json();
        setRoles(data.roles); // Update sesuai dengan struktur API role
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchUsers();
    fetchRoles();
  }, []);

  const handleEditRole = async (id) => {
    const token = Cookies.get("login");

    const selectedUser = users.find((user) => user.id_user === id);

    Swal.fire({
      title: `Edit Role for ${selectedUser.nama}`,
      input: "select",
      inputOptions: roles.reduce((acc, role) => {
        acc[role.name_role] = role.name_role; // Perbaikan sesuai dengan API role
        return acc;
      }, {}),
      inputPlaceholder: "Select a new role",
      showCancelButton: true,
      confirmButtonText: "Update",
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const response = await fetch(
            `http://localhost:8080/profile/by-id?id=${id}`,
            {
              method: "PUT",
              headers: {
                login: token,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                role_name: result.value,
              }),
            }
          );

          if (!response.ok) throw new Error("Failed to update role");

          Swal.fire({
            icon: "success",
            title: "Role Updated",
            text: `Role has been updated to ${result.value} for ${selectedUser.nama}`,
          });

          // Refresh the users list
          const updatedUsers = users.map((user) =>
            user.id_user === id ? { ...user, role_name: result.value } : user
          );
          setUsers(updatedUsers);
        } catch (error) {
          console.error("Error updating role:", error);
          Swal.fire({
            icon: "error",
            title: "Failed to Update Role",
            text: "An error occurred while updating the role.",
          });
        }
      }
    });
  };

  const handleDeleteUser = async (id) => {
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
            `http://localhost:8080/profile/delete?id=${id}`,
            {
              method: "DELETE",
              headers: {
                login: token,
              },
            }
          );

          if (!response.ok) throw new Error("Failed to delete user");

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The user has been deleted.",
          });

          setUsers(users.filter((user) => user.id_user !== id));
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire({
            icon: "error",
            title: "Failed to Delete User",
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
                      className="edit-button"
                      onClick={() => handleEditRole(user.id_user)}
                    >
                      Edit Role
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteUser(user.id_user)}
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
