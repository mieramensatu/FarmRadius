import React, { useState } from "react";

function Order({ cart, onUpdateQuantity, onCheckout }) {
  const handleCheckout = async () => {
    try {
      await onCheckout();
      alert("Checkout berhasil!");
    } catch (error) {
      alert("Checkout gagal: " + error.message);
    }
  };

  return (
    <div className="order-sidebar-content">
      <h2>Keranjang Belanja</h2>
      <ul>
        {cart.length === 0 ? (
          <li>Keranjang kosong</li>
        ) : (
          cart.map((item, index) => (
            <li key={index}>
              <div className="cart-item">
                {item.name} - Rp {item.price_per_kg.toLocaleString()} x {item.quantity} kg
                <div className="quantity-controls">
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
      <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
    </div>
  );
}

export default Order;