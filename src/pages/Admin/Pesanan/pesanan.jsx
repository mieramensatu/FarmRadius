import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import Cookies from "js-cookie";
import "./_allorder.scss"; // Import SCSS untuk styling

function Pesanan() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("login");

  useEffect(() => {
    // Fungsi untuk fetch data pesanan
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "https://farmsdistribution-2664aad5e284.herokuapp.com/all/order",
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

        const data = await response.json();
        setOrders(data); // Simpan data pesanan ke state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Dashboard>
      <div className="order-list-container">
        <div className="header">
          <h1>Order List</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="order-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Invoice ID</th>
                <th>User ID</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Total Harga</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.id}</td>
                  <td>{order.invoice_id}</td>
                  <td>{order.user_id}</td>
                  <td>{order.product_id}</td>
                  <td>{order.quantity}</td>
                  <td>Rp {order.total_harga.toLocaleString("id-ID")}</td>
                  <td>
                    <span
                      className={`status-label ${
                        order.status === "Pending" ? "pending" : "completed"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {new Date(order.created_at).toLocaleDateString("id-ID")}
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

export default Pesanan;
