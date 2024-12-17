import React from "react";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/footer/footer";
import MyComponent from "./map/Map";
import Productsection from "./section/Product";

function Product() {
  return (
    <>
      <Navbar />
      <div className="listing">
        <div className="listing-map">
          <MyComponent />
        </div>
        <div className="listing-location">
          <div className="listing-location-title">Product Farm Radius</div>
          <div className="listing-location-desc">
            Silahkan datang menuju lokasi kami bila Anda memerlukan sesuatu pada
            Farm Radius
          </div>
        </div>
        <div className="listing-product">
          <Productsection />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Product;
