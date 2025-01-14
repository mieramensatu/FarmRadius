import React, { useState } from "react";
import Productsection from "./Productsection";
import Order from "./Order";

function Shop() {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleCheckout = async () => {
    const requestBody = {
      user_id: 1,
      products: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      pengiriman_id: 3,
      payment_method: "Bank Transfer",
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
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal melakukan checkout");
      }

      const data = await response.json();
      console.log("Checkout berhasil:", data);
      setCart([]); // Kosongkan keranjang setelah checkout
    } catch (error) {
      console.error("Error saat checkout:", error);
    }
  };

  return (
    <div className="app">
      <Productsection onAddToCart={handleAddToCart} />
      <Order cart={cart} />
      <button className="checkout-button" onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
}

export default Shop;
