import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../../Dashboard";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "./_user.scss";

function AllUser() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("login");

    // Fetch users
    const fetchUsers = async () => {
      try {
        const userResponse = await fetch("http://localhost:8080/all/akun", {
          method: "GET",
          headers: {
            login: token,
          },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch users");
        }

        const userData = await userResponse.json();
        setUsers(userData.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Fetch roles
    const fetchRoles = async () => {
      try {
        const roleResponse = await fetch("http://localhost:8080/role", {
          method: "GET",
        });

        if (!roleResponse.ok) {
          throw new Error("Failed to fetch roles");
        }

        const roleData = await roleResponse.json();
        setRoles(roleData.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    // Fetch users and roles
    Promise.all([fetchUsers(), fetchRoles()]).then(() => setLoading(false));
  }, []);

  // Get role name by id_role
  const getRoleName = (id_role) => {
    const role = roles.find((r) => r.id === id_role);
    return role ? role.name_role : "Unknown";
  };

  // Update user role
  const handleUpdateRole = async (user) => {
    const token = Cookies.get("login");

    // Show role selection dialog
    const { value: selectedRoleId } = await Swal.fire({
      title: "Update Role",
      input: "select",
      inputOptions: roles.reduce((options, role) => {
        options[role.id] = role.name_role;
        return options;
      }, {}),
      inputPlaceholder: "Select a new role",
      showCancelButton: true,
    });

    if (selectedRoleId) {
      try {
        console.log("Selected Role ID:", selectedRoleId);

        // Build payload with updated id_role and other user data
        const payload = {
          nama: user.nama,
          no_telp: user.no_telp,
          email: user.email,
          id_role: parseInt(selectedRoleId),
        };

        const response = await fetch(
          `http://localhost:8080/update/akun?id=${user.id_user}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              login: token,
            },
            body: JSON.stringify(payload),
          }
        );

        console.log("Request Payload:", payload);
        console.log("Response Status:", response.status);

        if (response.ok) {
          const updatedRole = getRoleName(parseInt(selectedRoleId));
          Swal.fire({
            icon: "success",
            title: "Role Updated",
            text: `User role has been updated to ${updatedRole}.`,
          });

          // Update state users
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.id_user === user.id_user
                ? { ...u, id_role: parseInt(selectedRoleId) }
                : u
            )
          );
        } else {
          const result = await response.json();
          Swal.fire({
            icon: "error",
            title: "Failed to Update",
            text: result.message || "An error occurred.",
          });
        }
      } catch (error) {
        console.error("Error updating role:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while updating the role.",
        });
      }
    }
  };

  // Delete user account
  const handleDeleteAccount = async (user) => {
    const token = Cookies.get("login");

    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the account of ${user.nama}. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (confirmation.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/delete/akun?id=${user.id_user}`,
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
            title: "Account Deleted",
            text: `The account of ${user.nama} has been deleted.`,
          });

          // Remove user from state
          setUsers((prevUsers) =>
            prevUsers.filter((u) => u.id_user !== user.id_user)
          );
        } else {
          const result = await response.json();
          Swal.fire({
            icon: "error",
            title: "Failed to Delete",
            text: result.message || "An error occurred.",
          });
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while deleting the account.",
        });
      }
    }
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
                  <td>{getRoleName(user.id_role)}</td>
                  <td>
                    <button
                      className="update-button"
                      onClick={() => handleUpdateRole(user)}
                    >
                      Update Role
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteAccount(user)}
                    >
                      Delete Account
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
