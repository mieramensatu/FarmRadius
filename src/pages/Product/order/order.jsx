import React from "react";

function Order({ cart, onUpdateQuantity, onCheckout }) {
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
                  <input
                    type="number"
                    value={item.quantity}
                    readOnly
                    style={{ width: "40px", textAlign: "center" }}
                  />
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
      <button
        className="checkout-button"
        onClick={() => onCheckout()}
      >
        Checkout
      </button>
    </div>
  );
}

export default Order;
