import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./_productsection.scss"; // Import file SCSS untuk styling

function Productsection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("login");

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
                  <p className="product-price">Rp {product.price ? product.price.toLocaleString() : "0"}</p>
                  <p className="product-sold">
                    ⭐ {product.rating || "0.0"} | {product.sold || "0"} terjual
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Productsection;
