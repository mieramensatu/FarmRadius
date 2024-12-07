import React from "react";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/footer/footer";
import SmoothScroll from "../../helper/SmoothScroll";
import MapComponent from "./map/map";

function Product() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <div className="listing">
        <div className="listing-map">
          <MapComponent />
        </div>
        <div className="listing-location">
          <div className="listing-location-title">
            Farm Radius
          </div>
          <div className="listing-location-desc">
            Silahkan datang menuju lokasi kami bila Anda memerlukan sesuatu pada
            Farm Radius
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Product;
