import React, { useState, useEffect } from "react";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import MyComponent from "./map/map";
import Productsection from "./section/Productsection";
import Order from "./order/order";
import Cookies from "js-cookie";

function Product() {
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [cart, setCart] = useState([]);
  const token = Cookies.get("login");

  useEffect(() => {
    if (token) {
      const storedCart = localStorage.getItem(`cart_${token}`);

      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);

          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            setCart(parsedCart);
          } else {
            console.warn("Data keranjang tidak valid atau kosong:", parsedCart);
          }
        } catch (error) {
          console.error("Error parsing stored cart:", error);
        }
      }
    } else {
      console.warn("Token tidak ditemukan. Keranjang tidak dapat dipulihkan.");
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(`cart_${token}`, JSON.stringify(cart));
    }
  }, [cart, token]);

  const toggleCart = () => setIsCartVisible(!isCartVisible);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartVisible(true);
  };

  const handleUpdateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      quantity <= 0
        ? prevCart.filter((item) => item.id !== id)
        : prevCart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
    );
  };

  const handleCheckout = async (paymentMethod) => {
    const orderData = {
      user_id: 1,
      products: cart.map(({ id, quantity }) => ({
        product_id: id,
        quantity,
      })),
      pengiriman_id: 3,
      payment_method: paymentMethod,
      time_order: 0.46,
      distance_km: 0.27,
      shipping_cost: 34.1,
    };

    try {
      const response = await fetch(
        "https://farmsdistribution-2664aad5e284.herokuapp.com/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            login: token,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal melakukan checkout");
      }

      // Perbarui stok produk secara lokal
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          const orderedItem = cart.find((item) => item.id === product.id);
          if (orderedItem) {
            return {
              ...product,
              stock_kg: product.stock_kg - orderedItem.quantity,
            };
          }
          return product;
        })
      );

      alert("Checkout berhasil!");
      setCart([]); // Kosongkan keranjang setelah checkout
      localStorage.removeItem(`cart_${token}`); // Hapus keranjang dari localStorage

      // Refresh daftar produk dari server untuk mendapatkan stok terbaru
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Checkout gagal: " + error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://farmsdistribution-2664aad5e284.herokuapp.com/product",
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
      setProducts(data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  return (
    <>
      <Navbar toggleCart={toggleCart} />
      <div className="listing">
        <div className="listing-map">
          <MyComponent />
        </div>
        <div className="listing-location">
          <div className="listing-location-title">Product Farm Radius</div>
          <div className="listing-location-desc">
            Silahkan datang menuju lokasi kami bila Anda memerlukan sesuatu pada
            Farm Radius
          </div>
        </div>
        <div
          className={`product-wrapper ${isCartVisible ? "with-sidebar" : ""}`}
        >
          <div className="product">
            <Productsection onAddToCart={handleAddToCart} cart={cart} />
          </div>
          {isCartVisible && (
            <div className="order-sidebar">
              <Order
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onCheckout={handleCheckout}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Product;
