import React, { useState } from "react";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import MyComponent from "./map/map";
import Productsection from "./section/Productsection";
import Order from "./order/order";

function Product() {
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [cart, setCart] = useState([]);

  const toggleCart = () => setIsCartVisible(!isCartVisible);

  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    setIsCartVisible(true); 
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
              <Order cart={cart} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Product;
