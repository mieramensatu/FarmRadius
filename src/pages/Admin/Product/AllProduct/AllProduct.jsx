import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../../Dashboard";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "./_allproduct.scss"; // Import SCSS

function PeternakProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("login");
    // Fungsi untuk fetch data produk
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://farmdistribution-40a43a4491b1.herokuapp.com/product/mine",
          {
            method: "GET",
            headers: {
              login: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.data); // Simpan data produk ke state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    navigate("/add-product"); // Navigasi ke halaman tambah produk
  };

  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`); // Navigasi ke halaman edit produk
  };

  const handleDelete = async (id) => {
    const token = Cookies.get("login");

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `https://farmdistribution-40a43a4491b1.herokuapp.com/product/delete?id=${id}`,
            {
              method: "DELETE",
              headers: {
                login: token,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete product");
          }

          // Menghapus produk dari state setelah berhasil dihapus dari server
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== id)
          );

          Swal.fire("Deleted!", "Your product has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire("Error!", "Failed to delete product. Please try again.", "error");
        }
      }
    });
  };

  return (
    <Dashboard>
      <div className="product-list-container">
        <div className="header">
          <h1>Product List</h1>
          <button className="add-product-button" onClick={handleAddProduct}>
            Add Product
          </button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Available Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="product-image"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>Desserts</td>
                  <td>
                    {product.available_date
                      ? new Date(product.available_date).toLocaleDateString()
                      : "No available date"}
                  </td>

                  <td>
                    <span
                      className={`status-label ${
                        product.status_name === "Tersedia"
                          ? "available"
                          : product.status_name === "Tidak Tersedia"
                          ? "unavailable"
                          : "available"
                      }`}
                    >
                      {product.status_name}
                    </span>
                  </td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(product.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
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

export default PeternakProduct;
