import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie"; // Pastikan js-cookie diimpor
import Dashboard from "../Dashboard";

function VerifyPeternakRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = Cookies.get("login"); // Ambil token dari cookies
        if (!token) {
          throw new Error("No token found. Please login.");
        }

        const response = await fetch(
          "https://farmsdistribution-2664aad5e284.herokuapp.com/get/req/peternak",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              login: token,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setRequests(data.data || []); // Update sesuai struktur respons
        } else {
          throw new Error("Failed to fetch requests");
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch requests.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      const token = Cookies.get("login");
      if (!token) {
        throw new Error("No token found. Please login.");
      }

      const response = await fetch(
        "https://farmsdistribution-2664aad5e284.herokuapp.com/update/req/peternak",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            login: token,
          },
          body: JSON.stringify({ user_id: requestId }),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Approved",
          text: "Request has been approved.",
        });

        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.ID !== requestId)
        );
      } else {
        throw new Error("Failed to approve request");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to approve the request.",
      });
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = Cookies.get("login");
      if (!token) {
        throw new Error("No token found. Please login.");
      }

      const response = await fetch(
        `https://farmsdistribution-2664aad5e284.herokuapp.com/delete/req/peternak?_id=${requestId}`,
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
          title: "Rejected",
          text: "Request has been rejected.",
        });

        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.ID !== requestId)
        );
      } else {
        throw new Error("Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to reject the request.",
      });
    }
  };

  return (
    <Dashboard>
      <div className="request-list-container">
        <div className="header">
          <h1>Peternak Verification Requests</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p>No requests available.</p>
        ) : (
          <table className="request-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={request.ID}>
                  <td>{index + 1}</td>
                  <td>{request.nama_akun}</td>
                  <td>{request.email}</td>
                  <td>{request.no_telp}</td>
                  <td>
                    <button
                      className="approve-button"
                      onClick={() => handleApprove(request.user_id)}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleReject(request.ID)}
                    >
                      Reject
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

export default VerifyPeternakRequests;
