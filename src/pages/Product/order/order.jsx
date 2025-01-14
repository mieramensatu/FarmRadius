import React from "react";

function Order({ cart, onCheckout }) {
  return (
    <div className="order-sidebar-content">
      <h2>Keranjang Belanja</h2>
      <ul>
        {cart.length === 0 ? (
          <li>Keranjang kosong</li>
        ) : (
          cart.map((item, index) => (
            <li key={index}>
              {item.name} - Rp {item.price_per_kg.toLocaleString()} x {item.quantity}
            </li>
          ))
        )}
      </ul>
      <button className="checkout-button" onClick={onCheckout}>
        Checkout
      </button>
    </div>
  );
}

export default Order;
