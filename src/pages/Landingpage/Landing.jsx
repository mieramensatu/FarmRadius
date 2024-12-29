import React from "react";
import Navbar from "../../component/Navbar/Navbar";
import HeroComponent from "./hero/Hero";
import Partner from "./partner/Partner";
import Footer from "../../component/Footer/footer";
import Tim from "./team/Team";
import Information from "./information/Information.JSX";
import Faq from "./faq/Faq";

function Landingpage() {
  return (
    <>
      <Navbar />
      <div class="home">
        <div class="hero">
          <HeroComponent />
        </div>
        <div class="partner">
          <Partner />
        </div>
        <div class="information">
          <Information />
        </div>
        <div class="tim">
          <Tim />
        </div>
        <div class="faq">
          <Faq />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Landingpage;
