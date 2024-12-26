import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./_auth.scss";

function Auth() {
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Cookies at component load:");
    console.log("Login Token:", Cookies.get("login"));
    console.log("Role (Encrypted):", Cookies.get("role"));

    fetch("http://localhost:8080/role")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched roles:", data.roles);
        const filteredRoles = data.roles.filter((role) =>
          ["Pembeli", "Penjual"].includes(role.name_role)
        );
        setRoles(filteredRoles);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch roles.",
        });
      });
  }, []);

  const handleRoleSelection = async (roleId, roleName) => {
    const token = Cookies.get("login");

    console.log("Cookies retrieved - login:", token);
    console.log("Selected role ID:", roleId, ", Role Name:", roleName);

    try {
      const response = await fetch(`http://localhost:8080/update/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          login: token,
        },
        body: JSON.stringify({ role_id: roleId }),
      });

      const result = await response.json();
      console.log("Role update response:", result);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Role Updated",
          text: `Role berhasil diubah menjadi ${roleName}!`,
        }).then(() => {
          if (roleName === "Pembeli") {
            navigate("/lobby");
          } else {
            navigate("/daftar-toko");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: result.message || "Failed to update user role.",
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
  };

  return (
    <div className="update-role-container">
      <h1>Choose Your Role</h1>
      <div className="button-container">
        {roles.map((role) => (
          <button
            key={role.id}
            className={`role-button ${role.name_role}`}
            onClick={() => handleRoleSelection(role.id, role.name_role)}
          >
            {role.name_role}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Auth;