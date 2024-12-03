import React, { useEffect } from "react";

function Partner() {
  useEffect(() => {
    const logoSlide = document.querySelector(
      ".scrolling-logos .logo-container .logo-slide"
    );

    if (logoSlide) {
      const clone = logoSlide.cloneNode(true); 
      logoSlide.parentNode.appendChild(clone);
    } else {
      console.error("Element '.logo-slide' not found.");
    }
  }, []);

  return (
    <div className="scrolling-logos">
      <div className="logo-container">
        <div className="logo-slide">
          <img
            src="https://logos-world.net/wp-content/uploads/2020/09/Microsoft-Logo.png"
            alt="Microsoft"
          />
          <img
            src="https://th.bing.com/th/id/R.11566b13ebe3fe195137ce2bd1804a69?rik=Og%2bcKTbfN4mhBA&riu=http%3a%2f%2flogos-download.com%2fwp-content%2fuploads%2f2016%2f03%2fAirbnb_logo.png&ehk=QhLUqOjF6HxBvuuxjqpvtKEeCf%2bnDOuAUWx8DInRPOo%3d&risl=&pid=ImgRaw&r=0"
            alt="Airbnb"
          />
          <img
            src="https://logos-download.com/wp-content/uploads/2020/06/Gojek_Logo.png"
            alt="Gojek"
          />
          <img
            src="https://1.bp.blogspot.com/-M8L5nZiXMpk/X2H14EBayoI/AAAAAAAAAXA/yoo-qlBm224VriUmYfbW0DaJszOs0T8CgCLcBGAsYHQ/s3237/tokped%2Blogo%2B2.png"
            alt="Tokopedia"
          />
          <img
            src="https://www.gsma.com/mobilefordevelopment/wp-content/uploads/2021/07/eFishery.png"
            alt="eFishery"
          />
          <img
            src="https://cdn1.iconfinder.com/data/icons/logos-brands-in-colors/7500/Netflix_Logo_RGB-1024.png"
            alt="Netflix"
          />
          <img
            src="https://logos-download.com/wp-content/uploads/2016/05/Twitch_logo.png"
            alt="Twitch"
          />
        </div>
      </div>
    </div>
  );
}

export default Partner;
