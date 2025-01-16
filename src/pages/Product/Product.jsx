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

  // Load keranjang dari Local Storage saat komponen dimuat
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Simpan keranjang ke Local Storage setiap kali keranjang berubah
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const toggleCart = () => setIsCartVisible(!isCartVisible);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
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

  const handleCheckout = async (orderData) => {
    try {
      const token = Cookies.get("login");
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

      alert("Checkout berhasil!");
      setCart([]);
      localStorage.removeItem("cart");
      setIsCartVisible(false);
    } catch (error) {
      console.error(error);
      alert("Checkout gagal: " + error.message);
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
            Silahkan datang menuju lokasi kami bila Anda memerlukan sesuatu pada Farm Radius
          </div>
        </div>
        <div className={`product-wrapper ${isCartVisible ? "with-sidebar" : ""}`}>
          <div className="product">
            <Productsection onAddToCart={handleAddToCart} />
          </div>
          {isCartVisible && (
            <div className="order-sidebar">
              <Order
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onCheckout={(orderData) =>
                  handleCheckout({
                    user_id: 1,
                    products: cart.map(({ id, quantity }) => ({
                      product_id: id,
                      quantity,
                    })),
                    pengiriman_id: 3,
                    payment_method: "Bank Transfer",
                    time_order: 0.46,
                    distance_km: 0.27,
                    shipping_cost: 34.1,
                  })
                }
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
