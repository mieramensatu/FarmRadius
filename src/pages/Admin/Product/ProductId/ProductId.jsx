import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dashboard from "../../Dashboard";
import { useDropzone } from "react-dropzone";
import Modal from "react-modal";
import Cookies from "js-cookie";
import "./_productid.scss";
import DatePicker from "../../../../component/Dateformat/Dateformat";

Modal.setAppElement("#root");

function ProductId() {
  const token = Cookies.get("login");
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price_per_kg: "",
    stock_kg: "",
    status_name: "",
    available_date: "",
    image_url: "",
    weight_per_unit: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await fetch(
          `https://farmdistribution-40a43a4491b1.herokuapp.com/product/get/?id=${id}`,
          {
            method: "GET",
            headers: {
              login: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }

        const data = await response.json();
        console.log("Product data:", data);
        setProduct({
          ...data.data,
          available_date: formatDateForInput(data.data.available_date), // Format tanggal saat memasukkan ke state
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductById();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (uploadedImage) formData.append("image_url", uploadedImage);

    // Tambahkan hanya field yang sesuai dengan nama di `curl`
    formData.append("product_name", product.name);
    formData.append("description", product.description);
    formData.append("price_per_kg", product.price_per_kg);
    formData.append("weight_per_unit", product.weight_per_unit); // Sesuaikan nama field
    formData.append("stock_kg", product.stock_kg);
    formData.append("status_name", product.status_name);
    formData.append(
      "available_date",
      formatDateForInput(product.available_date)
    ); // Format tanggal sesuai dengan permintaan API

    // **Log isi FormData**
    console.log("FormData Contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(
        `https://farmdistribution-40a43a4491b1.herokuapp.com/product/edit?id=${id}`,
        {
          method: "PUT",
          headers: {
            login: token,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const data = await response.json();
      console.log(data);
      console.log("Success:", data);
      navigate("/product");
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }
  };

  const formatDateForInput = (date) => {
    console.log("Raw date input:", date); // Log nilai date
    if (!date || typeof date !== "string" || date.split("/").length !== 3) {
      return ""; // Jika tidak valid, kembalikan string kosong
    }

    const [day, month, year] = date.split("/");
    const monthMapping = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    };

    const monthNumber = monthMapping[month];
    if (!monthNumber) return ""; // Jika bulan tidak valid, kembalikan string kosong

    const fullYear = year.length === 2 ? `20${year}` : year; // Tambahkan "20" jika tahun hanya 2 digit
    return `${fullYear}-${monthNumber}-${day.padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <Dashboard>
        <div>Loading...</div>
      </Dashboard>
    );
  }

  if (error) {
    return (
      <Dashboard>
        <div>Error: {error}</div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="edit-form-container">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter product name"
              value={product.name || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter product description"
              value={product.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="image_url">Current Image</label>
            <img
              src={
                uploadedImage
                  ? URL.createObjectURL(uploadedImage)
                  : product.image_url
              }
              alt="Product"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="price_per_kg">Price per KG</label>
            <input
              type="number"
              id="price_per_kg"
              name="price_per_kg"
              placeholder="Enter price per KG"
              value={product.price_per_kg}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="stock_kg">Stock (KG)</label>
            <input
              type="number"
              id="stock_kg"
              name="stock_kg"
              placeholder="Enter stock in KG"
              value={product.stock_kg}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="available_date">Available Date</label>
            <DatePicker
              value={product.available_date}
              onChange={(newDate) => {
                console.log("Selected date:", newDate); // Log nilai yang dipilih
                setProduct((prevProduct) => ({
                  ...prevProduct,
                  available_date: newDate,
                }));
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="weight_per_unit">Weight per Unit</label>
            <input
              type="number"
              id="weight_per_unit"
              name="weight_per_unit"
              placeholder="Enter weight per unit"
              value={product.weight_per_unit}
              onChange={handleChange}
            />
          </div>
          <div className="button-group">
            <button type="submit" className="submit">
              Save
            </button>
            <button
              type="button"
              className="cancel"
              onClick={() => navigate("/product")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Dashboard>
  );
}

export default ProductId;
