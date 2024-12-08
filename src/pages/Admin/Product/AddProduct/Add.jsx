import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Dashboard from "../../Dashboard";
import "./_add.scss"; // Import SCSS untuk styling (jika diperlukan)

function AddProduct() {
  const [productData, setProductData] = useState({
    product_name: "",
    description: "",
    price_per_kg: "",
    weight_per_kg: "",
    stock_kg: "",
    status_name: "Tersedia",
    available_date: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get("login");
    const formData = new FormData();

    // Append form data
    for (const key in productData) {
      formData.append(key, productData[key]);
    }

    // Append image file
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(
        "https://farmdistribution-40a43a4491b1.herokuapp.com/add/product",
        {
          method: "POST",
          headers: {
            login: token,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        navigate("/product"); // Navigate back to product list
      } else {
        alert("Failed to add product: " + result.message);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <div className="add-product-container">
        <h1>Add Product</h1>
        <form className="add-product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="product_name">Product Name</label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              value={productData.product_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={productData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="price_per_kg">Price per KG</label>
            <input
              type="number"
              id="price_per_kg"
              name="price_per_kg"
              value={productData.price_per_kg}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="weight_per_kg">Weight per Unit (KG)</label>
            <input
              type="number"
              id="weight_per_kg"
              name="weight_per_kg"
              value={productData.weight_per_kg}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="stock_kg">Stock (KG)</label>
            <input
              type="number"
              id="stock_kg"
              name="stock_kg"
              value={productData.stock_kg}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status_name">Status</label>
            <select
              id="status_name"
              name="status_name"
              value={productData.status_name}
              onChange={handleChange}
              required
            >
              <option value="Tersedia">Tersedia</option>
              <option value="Tidak Tersedia">Tidak Tersedia</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="available_date">Available Date</label>
            <input
              type="datetime-local"
              id="available_date"
              name="available_date"
              value={productData.available_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" disabled={loading}>
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </Dashboard>
  );
}

export default AddProduct;
