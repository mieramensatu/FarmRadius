import React, { useState, useEffect } from "react";
import "./_order.scss";

function Order({
  cart,
  onUpdateQuantity,
  onCheckout,
  routeInfo,
  alamatPengirim,
  alamatPenerima,
}) {
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

  // Lokasi Toko (Koordinat Tetap)
  const tokoLongitude = 107.5784;
  const tokoLatitude = -6.8748;
  const [locationPengirim, setLocationPengirim] = useState([
    tokoLongitude,
    tokoLatitude,
  ]);

  const [locationPenerima, setLocationPenerima] = useState([0, 0]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationPenerima([longitude, latitude]);
        },
        (error) => {
          console.error("❌ Gagal mendapatkan lokasi pengguna:", error);
        }
      );
    }
  }, []);

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
                {item.name} - Rp {item.price_per_kg.toLocaleString()} x{" "}
                {item.quantity} kg
                <div className="quantity-controls">
                  <button
                    className="button"
                    onClick={() =>
                      onUpdateQuantity(item.id, Math.max(item.quantity - 1, 0))
                    }
                    disabled={item.quantity <= 0}
                  >
                    -
                  </button>
                  <input
                    className="input"
                    type="number"
                    value={item.quantity}
                    min="0"
                    max={item.stock_kg}
                    onChange={(e) =>
                      onUpdateQuantity(
                        item.id,
                        Math.min(Number(e.target.value), item.stock_kg)
                      )
                    }
                    style={{
                      width: "40px",
                      textAlign: "center",
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    className="button"
                    onClick={() =>
                      onUpdateQuantity(
                        item.id,
                        Math.min(item.quantity + 1, item.stock_kg)
                      )
                    }
                    disabled={item.quantity >= item.stock_kg}
                  >
                    +
                  </button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>

      <div className="order-info">
        <label>Alamat Pengirim (Toko):</label>
        <input type="text" value={alamatPengirim} readOnly />

        <label>Alamat Penerima (Anda):</label>
        <input type="text" value={alamatPenerima} readOnly />
      </div>

      <div className="order-info">
        <label>Jarak: </label>
        <input type="text" value={routeInfo?.distance || "0 km"} readOnly />

        <label>Waktu Tempuh: </label>
        <input type="text" value={routeInfo?.duration || "0 menit"} readOnly />
      </div>

      <div className="payment-method">
        <label htmlFor="paymentMethod">Metode Pembayaran:</label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="COD">Cash on Delivery (COD)</option>
        </select>
      </div>

      <button className="checkout-button" onClick={() => onCheckout()}>
        Checkout
      </button>
    </div>
  );
}

export default Order;
