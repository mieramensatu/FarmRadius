import React, { useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

function RequestPeternak() {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isRequestSuccessful, setIsRequestSuccessful] = useState(false); // State untuk melacak status sukses

  const handleRequest = async () => {
    const requestBody = {
      keterangan: "request peternak",
    };

    const token = Cookies.get("login");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "You are not logged in. Please login to continue.",
      });
      return;
    }

    console.log("Button clicked, disabling button...");
    setIsButtonDisabled(true); // Matikan tombol setelah diklik

    try {
      const response = await fetch(
        "https://farmsdistribution-2664aad5e284.herokuapp.com/req/peternak",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            login: token,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.status === "success") {
          setIsRequestSuccessful(true); // Tandai request berhasil
        }

        Swal.fire({
          icon: "success",
          title: "Request Sent",
          text: data.message || "Your request has been submitted successfully!",
        }).then(() => {
          window.location.href = "/"; // Redirect ke halaman lain jika berhasil
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Request Failed",
          text: errorData.message || "Unknown error occurred.",
        }).then(() => {
          window.location.href = "/"; // Redirect ke halaman lain jika berhasil
        });
        setIsButtonDisabled(false); // Aktifkan tombol kembali jika gagal
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `An error occurred: ${error.message}`,
      });
      setIsButtonDisabled(false); // Aktifkan tombol kembali jika ada error
    }
  };

  return (
    <div className="request-container">
      <div className="request-card">
        <h2 className="request-card__title">Request to Become a Peternak</h2>
        <p className="request-card__subtitle">
          Click the button below to send your request.
        </p>
        <button
          className="request-card__button"
          onClick={handleRequest}
          disabled={isButtonDisabled || isRequestSuccessful} // Tombol dinonaktifkan jika sukses
        >
          {isRequestSuccessful ? "Request Sent" : "Send Request"}{" "}
          {/* Ubah teks tombol */}
        </button>
      </div>
    </div>
  );
}

export default RequestPeternak;
