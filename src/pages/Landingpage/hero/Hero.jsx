import React from "react";
import Hero from "../../../assets/hero.jpg";

function HeroComponent() {
  return (
    <>
      <div className="template-wireframe">
        <div className="text-section">
          <h2>Jual dan Beli Ayam Langsung dari Peternak dengan AyamTernakku</h2>
          <p>
            AyamTernakku menghubungkan peternak ayam dengan pembeli langsung
            tanpa perantara. Temukan produk ayam segar berkualitas terbaik
            langsung dari peternak terpercaya di sekitar Anda!
          </p>
        </div>
        <div className="image-section">
          <img src={Hero} alt="AyamTernakKu Logo" />
        </div>
      </div>
    </>
  );
}

export default HeroComponent;
