import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "./_payment.scss"; // Import SCSS untuk styling

function Payment() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("login");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "https://farmsdistribution-2664aad5e284.herokuapp.com/order/user",
          {
            method: "GET",
            headers: {
              login: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const { data } = await response.json();

        const formattedData = data.map((item) => ({
          due_date: item.due_date,
          invoice_id: item.invoice_id,
          invoice_number: item.invoice_number,
          issued_date: item.issued_date,
          payment_method: item.payment_method,
          proof_of_transfer: item.proof_of_transfer,
          products: item.products.map((product) => ({
            created_at: product.created_at,
            order_id: product.order_id,
            product_id: product.product_id,
            product_name: product.product_name,
            price_per_kg: product.price_per_kg,
            quantity: product.quantity,
            status: item.proof_of_transfer ? "Sending" : "Pending",
            total_harga: product.total_harga,
            updated_at: product.updated_at,
          })),
          total_amount: item.total_amount,
        }));

        setOrders(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleFileUpload = async (invoiceId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.invoice_id === invoiceId
          ? {
              ...order,
              products: order.products.map((p) => ({
                ...p,
                status: "Sending",
              })),
            }
          : order
      )
    );

    Swal.fire({
      title: "Upload Proof of Transfer",
      input: "file",
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload your proof of transfer",
      },
      showCancelButton: true,
      confirmButtonText: "Upload",
      showLoaderOnConfirm: true,
      preConfirm: (file) => {
        if (!file) {
          Swal.showValidationMessage("Please select an image");
          return;
        }

        const formData = new FormData();
        formData.append("bukti_transfer", file);

        return fetch(
          `https://farmsdistribution-2664aad5e284.herokuapp.com/order/bukti-transfer?id_invoice=${invoiceId}`,
          {
            method: "PUT",
            headers: {
              login: token,
            },
            body: formData,
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.status !== "success") {
              throw new Error(data.message || "Upload failed");
            }
            return data;
          })
          .catch((error) => {
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.invoice_id === invoiceId
              ? {
                  ...order,
                  products: order.products.map((p) => ({
                    ...p,
                    status: "Complete",
                  })),
                }
              : order
          )
        );

        Swal.fire({
          icon: "success",
          title: "Upload Successful",
          text: "Proof of transfer uploaded successfully!",
        });
      }
    });
  };

  return (
    <Dashboard>
      <div className="payment-container">
        <h1>Payment List</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="payment-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Invoice Number</th>
                <th>Due Date</th>
                <th>Issued Date</th>
                <th>Payment Method</th>
                <th>Proof of Transfer</th>
                <th>Products</th>
                <th>Total Amount</th>
                <th>Upload Proof</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.invoice_id}>
                  <td>{index + 1}</td>
                  <td>{order.invoice_number}</td>
                  <td>{new Date(order.due_date).toLocaleDateString()}</td>
                  <td>{new Date(order.issued_date).toLocaleDateString()}</td>
                  <td>{order.payment_method}</td>
                  <td>
                    {order.proof_of_transfer ? (
                      <a
                        href={`https://raw.githubusercontent.com/Ayala-crea/proof_of_transfer/main/${order.proof_of_transfer
                          .split("/")
                          .pop()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`https://raw.githubusercontent.com/Ayala-crea/proof_of_transfer/main/${order.proof_of_transfer
                            .split("/")
                            .pop()}`}
                          alt="Proof of Transfer"
                          className="proof-image"
                        />
                      </a>
                    ) : (
                      "Not Uploaded"
                    )}
                  </td>
                  <td>
                    {order.products.map((product) => (
                      <div key={product.order_id}>
                        <p>Product: {product.product_name}</p>
                        <p>Quantity: {product.quantity} kg</p>
                        <p>Total Harga: {product.total_harga}</p>
                        <p>Status: {product.status}</p>
                      </div>
                    ))}
                  </td>
                  <td>{order.total_amount}</td>
                  <td>
                    <button
                      className="update-button"
                      onClick={() => handleFileUpload(order.invoice_id)}
                      disabled={order.proof_of_transfer}
                    >
                      Upload
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

export default Payment;
