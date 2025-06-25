import React from "react";
import chicken1 from "./../../../assets/sebastian-enrique-IuHX5kcuC6g-unsplash.jpg";
import chicken2 from "./../../../assets/duc-van-GoDNGS7ub00-unsplash.jpg";
import chicken3 from "./../../../assets/pat-ferranco-IDrDDSO0SAM-unsplash.jpg";

function Information() {
  return (
    <>
      <div className="information-section">
        <h2>Informasi Peternakan Ayam Terpopuler</h2>
        <div className="information-container">
          <div className="info-card">
            <img
              className="image-placeholder"
              src={chicken1}
              alt="Peternakan Ayam"
            />
            <div className="info-text">
              <h3>Chicky Chicken</h3>
              <p>Yogyakarta, Indonesia</p>
              <p>
                Menyediakan ayam potong berkualitas tinggi dengan metode
                peternakan modern.
              </p>
            </div>
          </div>
          <div className="info-card">
            <img
              className="image-placeholder"
              src={chicken2}
              alt="Peternakan Ayam"
            />
            <div className="info-text">
              <h3>Choong Man Chicken</h3>
              <p>Malang, Indonesia</p>
              <p>
                Fokus pada produksi ayam organik dengan lingkungan yang ramah
                lingkungan.
              </p>
            </div>
          </div>
          <div className="info-card">
            <img className="image-placeholder" src={chicken3} />
            <div className="info-text">
              <h3>Chooks to Go</h3>
              <p>Bandung, Indonesia</p>
              <p>
                Spesialis dalam ayam pedaging dan petelur dengan teknologi
                kandang otomatis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Information;
