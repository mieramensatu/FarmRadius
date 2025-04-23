import React, { useState, useEffect } from "react";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import MyComponent from "./map/map";
import Productsection from "./section/Productsection";
import Order from "./order/order";
import Cookies from "js-cookie";

function Product() {
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const token = Cookies.get("login");

  const [locationPengirim, setLocationPengirim] = useState([107.5784, -6.8748]); // Koordinat toko
  const [locationPenerima, setLocationPenerima] = useState([0, 0]); // Default kosong

  const [routeInfo, setRouteInfo] = useState({
    distance: "0 km",
    duration: "0 menit",
  });

  const [alamatPengirim, setAlamatPengirim] = useState("Memuat...");
  const [alamatPenerima, setAlamatPenerima] = useState("Memuat...");

  useEffect(() => {
    if (token) {
      const storedCart = localStorage.getItem(`cart_${token}`);
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            setCart(parsedCart);
          } else {
            console.warn("Data keranjang tidak valid atau kosong:", parsedCart);
          }
        } catch (error) {
          console.error("Error parsing stored cart:", error);
        }
      }
    } else {
      console.warn("Token tidak ditemukan. Keranjang tidak dapat dipulihkan.");
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(`cart_${token}`, JSON.stringify(cart));
    }
  }, [cart, token]);

  const toggleCart = () => setIsCartVisible(!isCartVisible);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartVisible(true);
  };

  const handleUpdateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      quantity <= 0
        ? prevCart.filter((item) => item.id !== id)
        : prevCart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
    );
  };

  const fetchAlamatToko = async () => {
    try {
      console.log("🔄 Fetching alamat toko...");
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationPengirim[1]}&lon=${locationPengirim[0]}`
      );
      const geoData = await geoResponse.json();
      setAlamatPengirim(geoData.display_name || "Alamat toko tidak ditemukan");

      console.log("📌 Alamat Pengirim (Toko):", geoData.display_name);
    } catch (error) {
      console.error("❌ Gagal mendapatkan alamat toko:", error);
      setAlamatPengirim("Gagal mendapatkan alamat toko.");
    }
  };

  useEffect(() => {
    const fetchData = setTimeout(() => {
      fetchAlamatToko();
    }, 2000); // Delay 2 detik

    return () => clearTimeout(fetchData);
  }, []);
  useEffect(() => {
    if (locationPengirim[0] !== 0 && locationPengirim[1] !== 0) {
      fetchAlamatToko();
    }
  }, [locationPengirim]);
  useEffect(() => {
    fetchAlamatToko();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocationPenerima([longitude, latitude]);

          console.log("📍 Lokasi Penerima (User):", { latitude, longitude });

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setAlamatPenerima(data.display_name || "Alamat tidak ditemukan");
            console.log("📌 Alamat Penerima:", data.display_name);
          } catch (error) {
            console.error("❌ Gagal mendapatkan alamat penerima:", error);
            setAlamatPenerima("Gagal mendapatkan alamat.");
          }
        },
        (error) => {
          console.error("❌ Gagal mendapatkan lokasi pengguna:", error);
          setAlamatPenerima("Lokasi tidak tersedia.");
        }
      );
    } else {
      console.warn("Geolocation tidak didukung oleh browser.");
      setAlamatPenerima("Geolocation tidak didukung.");
    }
  }, []);

  useEffect(() => {
    console.log("✅ Alamat Pengirim Diperbarui:", alamatPengirim);
  }, [alamatPengirim]);

  useEffect(() => {
    console.log("✅ Alamat Penerima Diperbarui:", alamatPenerima);
  }, [alamatPenerima]);

  const handleCheckout = async () => {
    // ✅ Pastikan format waktu hanya jam dan menit dalam format angka (float)
    const now = new Date();
    const timeOrderFormatted = parseFloat(
      `${now.getHours()}.${now.getMinutes()}`
    );

    // ✅ Pastikan paymentMethod adalah string
    const selectedPaymentMethod =
      typeof paymentMethod === "string" ? paymentMethod : paymentMethod.value;

    // ✅ Pastikan distance_km dalam bentuk angka
    const distanceValue =
      parseFloat(routeInfo?.distance.replace(" km", "")) || 0;

    // ✅ Pastikan pengiriman_id adalah angka
    const pengirimanId = parseInt(3, 10);

    // ✅ Data yang akan dikirim ke API
    const orderData = {
      user_id: 1,
      products: cart.map(({ id, quantity }) => ({
        product_id: id,
        quantity,
      })),
      pengiriman_id: pengirimanId,
      payment_method: selectedPaymentMethod,
      time_order: timeOrderFormatted, // ✅ Format dalam angka (float)
      distance_km: distanceValue,
      alamat_pengirim: alamatPengirim,
      alamat_penerima: alamatPenerima,
      location_pengirim: [locationPengirim[0], locationPengirim[1]], // ✅ Array seperti di Postman
      location_penerima: [locationPenerima[0], locationPenerima[1]], // ✅ Array seperti di Postman
      shipping_cost: 34.1,
    };

    console.log(
      "📩 Data yang dikirim ke API:",
      JSON.stringify(orderData, null, 2)
    );

    try {
      const response = await fetch(
        "https://farm-distribution-d0d1df93c0f1.herokuapp.com/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            login: token ? token : "",
          },
          body: JSON.stringify(orderData),
        }
      );

      const textResponse = await response.text();
      try {
        const responseData = JSON.parse(textResponse);
        console.log("📩 Response dari server:", responseData);

        if (!response.ok) {
          throw new Error(
            "Gagal melakukan checkout: " + JSON.stringify(responseData)
          );
        }

        alert("✅ Checkout berhasil!");
        setCart([]);
        localStorage.removeItem(`cart_${token}`);
        setIsCartVisible(false);
      } catch (jsonError) {
        console.error("❌ Error parsing JSON dari server:", textResponse);
        alert("Checkout gagal: Server mengembalikan respons yang tidak valid.");
      }
    } catch (error) {
      console.error("❌ Checkout gagal:", error);
      alert("Checkout gagal: " + error.message);
    }
  };

  const fetchProductsByFarm = async (farmId) => {
    try {
      console.log(`🔍 Fetching products for Farm ID: ${farmId}`);
      setSelectedFarmId(farmId);

      const response = await fetch(
        `https://farm-distribution-d0d1df93c0f1.herokuapp.com/product/farm?id_farm=${farmId}`
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil produk");
      }

      const data = await response.json();
      console.log("📦 Produk yang diterima:", data.data);
      setProducts(data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  return (
    <>
      <Navbar toggleCart={toggleCart} />
      <div className="listing">
        <div className="listing-map">
          <MyComponent
            onSelectFarm={fetchProductsByFarm}
            onRouteUpdate={setRouteInfo}
          />
        </div>
        <div className="listing-location">
          <div className="listing-location-title">Product Farm Radius</div>
          <div className="listing-location-desc">
            Silahkan datang menuju lokasi kami bila Anda memerlukan sesuatu pada
            Farm Radius
          </div>
        </div>
        <div
          className={`product-wrapper ${isCartVisible ? "with-sidebar" : ""}`}
        >
          <div className="product">
            <Productsection
              onAddToCart={handleAddToCart}
              cart={cart}
              products={products}
              selectedFarmId={selectedFarmId}
            />
          </div>
          {isCartVisible && (
            <div className="order-sidebar">
              {/* ✅ Kirimkan routeInfo ke Order */}
              <Order
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onCheckout={handleCheckout}
                routeInfo={routeInfo}
                alamatPengirim={alamatPengirim}
                alamatPenerima={alamatPenerima}
                locationPengirim={locationPengirim}
                locationPenerima={locationPenerima}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Product;
