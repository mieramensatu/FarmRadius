import React from "react";

function Tim() {
  return (
    <>
      <div className="partners-section">
        <div className="image-side">
          <div className="image-placeholder">
            <img
              src="src/assets/logo/pexels-diego-auquilla-530112625-29418866.jpg"
              alt="Peternakan Ayam"
            />
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
              <img
                src="src/assets/logo/tim/farm-association.png"
                alt="Farm Association Logo"
              />
              <p>Farm Association</p>
            </div>
            <div className="logo">
              <img
                src="src/assets/logo/tim/agriculture-tech.png"
                alt="AgriTech Logo"
              />
              <p>AgriTech</p>
            </div>
            <div className="logo">
              <img
                src="src/assets/logo/tim/delivery-partner.png"
                alt="Logistics Logo"
              />
              <p>Logistics</p>
            </div>
            <div className="logo">
              <img
                src="src/assets/logo/tim/marketplace-logo.png"
                alt="Marketplace Logo"
              />
              <p>Marketplace</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tim;
