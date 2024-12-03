import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./main.css";
import "lenis/dist/lenis.css";
import Product from "./pages/product/Product";
import Landingpage from "./pages/landingpage/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/product" element={<Product />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
