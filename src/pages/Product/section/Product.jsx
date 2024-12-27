import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./_productsection.scss"; // Import file SCSS untuk styling

function Productsection() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // State untuk menyimpan produk yang dipesan
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("login");

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://farmdistribution-40a43a4491b1.herokuapp.com/product",
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

  // Fungsi untuk menambahkan produk ke keranjang (cart)
  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.name} berhasil ditambahkan ke pesanan!`);
  };

  // Fungsi untuk checkout
  const handleCheckout = () => {
    alert(`Produk yang dipesan:\n${cart.map((item) => item.name).join(", ")}`);
    console.log("Produk yang akan dipesan:", cart);
  };

  return (
    <div className="product">
      <div className="product-list">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.image_url || "https://via.placeholder.com/150"} // Placeholder untuk gambar kosong
                  alt={product.name || "No Name"}
                  className="product-image"
                />
                <div className="product-info">
                  <h3 className="product-name">{product.name || "Produk Tidak Diketahui"}</h3>
                  <p className="product-price">Rp {product.price_per_kg ? product.price_per_kg.toLocaleString() : "0"}/kg</p>
                  <p className="product-stock">Stok: {product.stock_kg || 0} kg</p>
                  <p className="product-status">Status: {product.status_name || "N/A"}</p>
                  <button
                    className="order-button"
                    onClick={() => handleAddToCart(product)}
                  >
                    Pesan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkout Section */}
      <div className="checkout-section">
        <h2>Checkout</h2>
        {cart.length === 0 ? (
          <p>Belum ada produk yang dipesan.</p>
        ) : (
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - Rp {item.price_per_kg.toLocaleString()}/kg
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <button className="checkout-button" onClick={handleCheckout}>
            Lanjut ke Pembayaran
          </button>
        )}
      </div>
    </div>
  );
}

export default Productsection;
