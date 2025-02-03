import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import Cookies from "js-cookie";
import "./_payment.scss"; // Import SCSS untuk styling

function Payment() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
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
            status: product.status,
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
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `https://farmsdistribution-2664aad5e284.herokuapp.com/order/bukti-transfer?id_invoice=${invoiceId}`,
        {
          method: "POST",
          headers: {
            login: token,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload proof of transfer");
      }

      alert("Proof of transfer uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
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
                <th>Upload Proof</th>
                <th>Products</th>
                <th>Total Amount</th>
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
                        href={`https://raw.githubusercontent.com/Ayala-crea/proof_of_transfer/main/${order.proof_of_transfer}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`https://raw.githubusercontent.com/Ayala-crea/proof_of_transfer/main/${order.proof_of_transfer}`}
                          alt="Proof of Transfer"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      </a>
                    ) : (
                      "Not Uploaded"
                    )}
                  </td>
                  <td>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <button onClick={() => handleFileUpload(order.invoice_id)}>
                      Upload
                    </button>
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
