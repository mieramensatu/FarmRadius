import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./_productsection.scss";

function Productsection({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("login");

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://farmsdistribution-2664aad5e284.herokuapp.com/product",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="listing-product">
      {loading ? (
        <p>Loading...</p>
      ) : (
        products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image_url || "https://via.placeholder.com/150"}
              alt={product.name || "No Name"}
              className="product-image"
            />
            <div className="product-info">
              <h3 className="product-name">{product.name || "Tidak Diketahui"}</h3>
              <p className="product-price">Rp {product.price_per_kg.toLocaleString()}/kg</p>
              <p className="product-stock">Stok: {product.stock_kg || 0} kg</p>
              <p className="product-status">Status: {product.status_name || "N/A"}</p>
              <button
                className="order-button"
                onClick={() => onAddToCart(product)}
              >
                Pesan
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Productsection;
