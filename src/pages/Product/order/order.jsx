import React from "react";
import "./_order.scss";

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
                  <button className="button" style={{width: "20px", height:"20px", borderRadius:"50%", border:"transparent", cursor: "pointer"}} onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                  <input
                  className="input"
                    type="number"
                    value={item.quantity}
                    readOnly
                    style={{ width: "25px", margin:"0 5px", backgroundColor: "transparent", border: "none", textAlign: "center" }}
                  />
                  <button className="button" style={{width: "20px", height:"20px", borderRadius:"50%", border:"transparent", cursor: "pointer"}} onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
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
