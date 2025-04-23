import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./_productsection.scss";

function Productsection({ onAddToCart, cart = [], selectedFarmId }) { 
  const [allProducts, setAllProducts] = useState([]); // Semua produk
  const [filteredProducts, setFilteredProducts] = useState([]); // Produk yang difilter
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("login");

    const fetchProducts = async () => {
      try {
        console.log("🔍 Fetching all products...");

        const response = await fetch(
          `https://farm-distribution-d0d1df93c0f1.herokuapp.com/product`,
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
        console.log("📦 Semua produk yang diterima:", data.data);

        setAllProducts(data.data || []); 
        setFilteredProducts(data.data || []); // Tampilkan semua produk di awal
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
        setAllProducts([]); 
        setFilteredProducts([]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedFarmId) {
      console.log(`🔍 Menampilkan produk untuk Farm ID: ${selectedFarmId}`);
      const filtered = allProducts.filter(product => product.farm_id === selectedFarmId);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
  }, [selectedFarmId, allProducts]);

  return (
    <div className="listing-product">

      {loading ? (
        <p>Loading...</p>
      ) : filteredProducts.length === 0 ? (
        <p>🚫 Tidak ada produk yang tersedia untuk farm ini.</p>
      ) : (
        filteredProducts.map((product) => {
          const cartItem = cart.find((item) => item.id === product.id) || {}; 
          const currentQuantity = cartItem.quantity || 0;
          const isOutOfStock = currentQuantity >= (product.stock_kg || 0);

          return (
            <div key={product.id} className="product-card">
              <img
                src={product.image_url || "https://via.placeholder.com/150"}
                alt={product.name || "No Name"}
                className="product-image"
              />
              <div className="product-info">
                <h3 className="product-name">{product.name || "Tidak Diketahui"}</h3>
                <p className="product-price">{product.price_per_kg?.toLocaleString() || "0"}/kg</p>
                <p className="product-stock">Stok: {product.stock_kg || 0} kg</p>
                <p className="product-status">Status: {product.status_name || "N/A"}</p>
                <button
                  className="order-button"
                  onClick={() => {
                    if (!isOutOfStock) {
                      onAddToCart(product);
                    }
                  }}
                  disabled={isOutOfStock}
                  style={{
                    backgroundColor: isOutOfStock ? "#ccc" : "#007bff",
                    cursor: isOutOfStock ? "not-allowed" : "pointer",
                  }}
                >
                  {isOutOfStock ? "Stok Habis" : "Pesan"}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Productsection;
