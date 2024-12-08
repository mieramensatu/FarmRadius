import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./main.css";
import "lenis/dist/lenis.css";
// import Product from "./pages/product/Product";
import Landingpage from "./pages/landingpage/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Admin/Dashboard";
import PeternakProduct from "./pages/Admin/Product/AllProduct/AllProduct";
import AddProduct from "./pages/Admin/Product/AddProduct/Add";
import Profile from "./pages/Admin/Profile/Profile";
import EditProfile from "./pages/Admin/EditProfile/EditProfile";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/product" element={<PeternakProduct />} />
        <Route path="/add-product" element={<AddProduct />}></Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/product" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
