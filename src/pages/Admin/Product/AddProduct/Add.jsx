import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Dashboard from "../../Dashboard";
import Swal from "sweetalert2"; 
import "./_add.scss"; // Import SCSS untuk styling (jika diperlukan)

function AddProduct() {
  const [productData, setProductData] = useState({
    product_name: "",
    description: "",
    price_per_kg: "",
    weight_per_kg: "",
    stock_kg: "",
    status_name: "Tersedia",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState({ day: "", month: "", year: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDate({
      ...date,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validasi tanggal
    if (date.day.length !== 2 || date.year.length !== 4) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "Please ensure the day is 2 digits and the year is 4 digits.",
      });
      return;
    }
  
    setLoading(true);
  
    const token = Cookies.get("login");
    const formData = new FormData();
  
    // Combine date fields into a single formatted string
    const formattedDate = `${date.day}/${date.month}/${date.year.slice(-2)}`;
    // Append form data
    for (const key in productData) {
      formData.append(key, productData[key]);
    }
  
    // Append formatted date
    formData.append("available_date", formattedDate);
  
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
        // Menampilkan SweetAlert saat berhasil
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result.message,
        }).then(() => {
          navigate("/product"); // Navigate back to product list setelah klik OK
        });
      } else {
        // Menampilkan SweetAlert saat gagal
        Swal.fire({
          icon: "error",
          title: "Failed to Add Product",
          text: result.message,
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while adding the product.",
      });
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
            <label>Available Date</label>
            <div className="date-group">
              <input
                type="number"
                name="day"
                placeholder="Day"
                value={date.day}
                onChange={handleDateChange}
                required
              />
              <select
                name="month"
                value={date.month}
                onChange={handleDateChange}
                required
              >
                <option value="">Month</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
              <input
                type="number"
                name="year"
                placeholder="Year"
                value={date.year}
                onChange={handleDateChange}
                required
              />
            </div>
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
