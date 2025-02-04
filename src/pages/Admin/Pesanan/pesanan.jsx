import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import Cookies from "js-cookie";
import "./_allorder.scss"; // Import SCSS untuk styling
import Swal from "sweetalert2";

function Pesanan() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const token = Cookies.get("login");

  useEffect(() => {
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

        const formattedData = data.map((item) => ({
          email: item.email,
          invoice_id: item.invoice_id,
          invoice_number: item.invoice_number,
          nama_pembeli: item.nama_pembeli,
          no_telp: item.no_telp,
          proof_of_transfer: item.proof_of_transfer,
          products: item.products.map((product) => ({
            created_at: product.created_at,
            order_id: product.order_id,
            product_id: product.product_id,
            quantity: product.quantity,
            status: product.status || "Pending",
            total_harga: product.total_harga,
            updated_at: product.updated_at,
          })),
          total_amount: item.total_amount,
        }));

        const sortedData = formattedData.sort((a, b) => {
          return Number(a.invoice_number) - Number(b.invoice_number);
        });

        setOrders(sortedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async () => {
    if (!editingOrder) return;

    try {
      const response = await fetch(
        "https://farmsdistribution-2664aad5e284.herokuapp.com/order/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            login: token,
          },
          body: JSON.stringify({
            invoice_id: editingOrder.invoice_id,
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.invoice_id === editingOrder.invoice_id
            ? {
                ...order,
                products: order.products.map((product) => ({
                  ...product,
                  status: newStatus,
                })),
              }
            : order
        )
      );

      setEditingOrder(null);
      setNewStatus("");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    // Tampilkan konfirmasi sebelum menghapus
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This order will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmDelete.isConfirmed) {
      return; // Batalkan jika user memilih "Cancel"
    }

    try {
      const response = await fetch(
        "https://farmsdistribution-2664aad5e284.herokuapp.com/order/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            login: token, // Pastikan token dikirim dengan benar
          },
          body: JSON.stringify({ invoice_id: orderId }), // Kirim invoice_id dalam body request
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      // Jika berhasil, hapus order dari state
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.invoice_id !== orderId)
      );

      // Tampilkan notifikasi sukses
      Swal.fire({
        title: "Deleted!",
        text: `Order ${orderId} has been deleted.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      console.log(`Order ${orderId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting order:", error.message);

      // Tampilkan notifikasi error
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <Dashboard>
      <div className="user-list-container">
        <div className="header">
          <h1>Order List</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Invoice Number</th>
                <th>Nama Pembeli</th>
                <th>No. Telp</th>
                <th>Produk</th>
                <th>Total Amount</th>
                <th>Proof of Transfer</th>
                <th>Status</th>
                <th>Actions</th>
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
                  <td>{order.products[0].status}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingOrder(order);
                        setNewStatus(order.products[0].status);
                      }}
                      className="update-button"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => deleteOrder(order.invoice_id)} // Pass order.invoice_id sebagai orderId
                      className="delete-button"
                    >
                      Delete Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {editingOrder && (
          <div className="modal">
            <div className="modal-content">
              <h2>Update Status</h2>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Sending">Sending</option>
              </select>
              <div className="modal-actions">
                <button onClick={updateStatus} className="update-button">
                  Save
                </button>
                <button
                  onClick={() => setEditingOrder(null)}
                  className="delete-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
}

export default Pesanan;
