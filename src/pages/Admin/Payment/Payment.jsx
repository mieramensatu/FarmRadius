import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import Cookies from "js-cookie";
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
