import React from "react";
import Navbar from "../../component/Navbar/Navbar";
import HeroComponent from "./hero/hero";
import Partner from "./partner/partner";
import SmoothScroll from "../../helper/SmoothScroll";
import Footer from "../../component/Footer/footer";
import Tim from "./team/Team";
import Information from "./information/information.JSX";
import Faq from "./faq/faq";

function Landingpage() {
  return (
    <>
      <SmoothScroll />
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
