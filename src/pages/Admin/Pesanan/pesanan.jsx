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
        
        // Map data API ke format yang diinginkan
        const formattedData = data.map((item) => ({
          email: item.email,
          invoice_id: item.invoice_id,
          invoice_number: item.invoice_number,
          nama_pembeli: item.nama_pembeli,
          no_telp: item.no_telp,
          products: item.products.map((product) => ({
            created_at: product.created_at,
            order_id: product.order_id,
            product_id: product.product_id,
            quantity: product.quantity,
            status: product.status,
            total_harga: product.total_harga,
            updated_at: product.updated_at,
          })),
          total_amount: item.total_amount,
        }));

        setOrders(formattedData); // Simpan data terformat ke state
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
                <th>Email</th>
                <th>Invoice Number</th>
                <th>Nama Pembeli</th>
                <th>No. Telp</th>
                <th>Produk</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.invoice_id}>
                  <td>{index + 1}</td>
                  <td>{order.email}</td>
                  <td>{order.invoice_number}</td>
                  <td>{order.nama_pembeli}</td>
                  <td>{order.no_telp}</td>
                  <td>
                    {order.products.map((product) => (
                      <div key={product.order_id}>
                        <p>Product ID: {product.product_id}</p>
                        <p>Quantity: {product.quantity}</p>
                        <p>Harga: {product.total_harga}</p>
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

export default Pesanan;
