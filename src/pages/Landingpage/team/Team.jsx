import React from "react";
import peternakan from "./../../../assets/thomas-iversen-4W8FgDVyUME-unsplash.jpg";
import agritech from "./../../../assets/agritech-srl-logo-vector-removebg-preview.png";
import farm from "./../../../assets/Irish_Farmers'_Association_logo.png";
import logistics from "./../../../assets/logo-design-for-delivery-logistics-and-others-logo-collection-concept-design-symbol-icon-free-vector-removebg-preview.png";
import marketplace from "./../../../assets/marketplace-logo_1438-512_prev_ui.png";

function Tim() {
  return (
    <>
      <div className="partners-section">
        <div className="image-side">
          <div className="image-placeholder">
            <img src={peternakan} alt="Peternakan Ayam" />
          </div>
        </div>
        <div className="content-side">
          <h2>Mitra Kami</h2>
          <p>
            Kami bermitra dengan platform dan organisasi ternama untuk mendukung
            usaha peternakan ayam, meningkatkan kualitas produk, dan mempermudah
            distribusi ke pelanggan.
          </p>
          <div className="partners-logos">
            <div className="logo">
              <img src={farm} alt="Farm Association Logo" />
              <p>Farm Association</p>
            </div>
            <div className="logo">
              <img src={agritech} alt="AgriTech Logo" />
              <p>AgriTech</p>
            </div>
            <div className="logo">
              <img src={logistics} alt="Logistics Logo" />
              <p>Logistics</p>
            </div>
            <div className="logo">
              <img src={marketplace} alt="Marketplace Logo" />
              <p>Marketplace</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tim;
