import React from "react";

function Information() {
  return (
    <>
      <div className="information-section">
        <h2>Informasi Peternakan Ayam Terpopuler</h2>
        <div className="information-container">
          <div className="info-card">
            <div className="image-placeholder"></div>
            <div className="info-text">
              <h3>Peternakan Ayam Sejahtera</h3>
              <p>Yogyakarta, Indonesia</p>
              <p>
                Menyediakan ayam potong berkualitas tinggi dengan metode
                peternakan modern.
              </p>
            </div>
          </div>
          <div className="info-card">
            <div className="image-placeholder"></div>
            <div className="info-text">
              <h3>Kandang Makmur Bersama</h3>
              <p>Malang, Indonesia</p>
              <p>
                Fokus pada produksi ayam organik dengan lingkungan yang
                ramah lingkungan.
              </p>
            </div>
          </div>
          <div className="info-card">
            <div className="image-placeholder"></div>
            <div className="info-text">
              <h3>Ayam Unggul Sentosa</h3>
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
