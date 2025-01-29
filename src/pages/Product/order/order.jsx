import React, { useState } from "react";
import "./_order.scss";

function Order({ cart, onUpdateQuantity, onCheckout }) {
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleQuantityChange = (id, value, maxStock) => {
    let newValue = parseInt(value, 10);

    if (isNaN(newValue) || newValue < 1) {
      newValue = 0;
    } else if (newValue > maxStock) {
      newValue = maxStock;
    }

    onUpdateQuantity(id, newValue);
  };

  return (
    <div className="order-sidebar-content">
      <h2>Keranjang Belanja</h2>
      <ul>
        {cart.length === 0 ? (
          <li>Keranjang kosong</li>
        ) : (
          cart.map((item) => (
            <li key={item.id}>
              <div className="cart-item">
                {item.name} - Rp {item.price_per_kg.toLocaleString()} x {item.quantity} kg
                <div className="quantity-controls">
                  <button
                    className="button"
                    onClick={() => onUpdateQuantity(item.id, Math.max(item.quantity - 1, 0))}
                    disabled={item.quantity <= 0} // Disable jika sudah 0
                  >
                    -
                  </button>
                  <input
                    className="input"
                    type="number"
                    value={item.quantity}
                    min="0"
                    max={item.stock_kg}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value, item.stock_kg)}
                    style={{
                      width: "40px",
                      textAlign: "center",
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    className="button"
                    onClick={() => onUpdateQuantity(item.id, Math.min(item.quantity + 1, item.stock_kg))}
                    disabled={item.quantity >= item.stock_kg} // Disable jika sudah mencapai stok maksimum
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
        <select id="paymentMethod" value={paymentMethod} onChange={handlePaymentChange}>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="COD">Cash on Delivery (COD)</option>
        </select>
      </div>
      <button className="checkout-button" onClick={() => onCheckout(paymentMethod)}>
        Checkout
      </button>
    </div>
  );
}

export default Order;
