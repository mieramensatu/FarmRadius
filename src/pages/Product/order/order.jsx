import React, { useState } from "react";
import "./_order.scss";

function Order({ cart, onUpdateQuantity, onCheckout }) {
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCheckoutClick = () => {
    onCheckout(paymentMethod);
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
                  <button
                    className="button"
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: "transparent",
                      cursor: "pointer",
                    }}
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    className="input"
                    type="number"
                    value={item.quantity}
                    readOnly
                    style={{
                      width: "25px",
                      margin: "0 5px",
                      backgroundColor: "transparent",
                      border: "none",
                      textAlign: "center",
                    }}
                  />
                  <button
                    className="button"
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: "transparent",
                      cursor: "pointer",
                    }}
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
      <div className="payment-method">
        <label htmlFor="paymentMethod">Metode Pembayaran:</label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={handlePaymentChange}
        >
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="COD">Cash on Delivery (COD)</option>
        </select>
      </div>
      <button className="checkout-button" onClick={handleCheckoutClick}>
        Checkout
      </button>
    </div>
  );
}

export default Order;