import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./main.css";
import "lenis/dist/lenis.css";
import Landingpage from "./pages/landingpage/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProductComponent from "./pages/Product/Product";
import Dashboard from "./pages/Admin/Dashboard";
import PeternakProduct from "./pages/Admin/Product/AllProduct/AllProduct";
import AddProduct from "./pages/Admin/Product/AddProduct/Add";
import ProfileAdmin from "./pages/Admin/Profile/Profile";
import EditProfile from "./pages/Admin/EditProfile/EditProfile";
import Profileuser from "./pages/ProfileUser/Profileuser";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/product" element={<ProductComponent />} />

        {/* Profile Routes */}
        <Route path="/profile/*" element={<Profileuser />} />

        {/* Admin Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/product" element={<PeternakProduct />} />
        <Route path="/dashboard/add-product" element={<AddProduct />} />
        <Route path="/dashboard/profile" element={<ProfileAdmin />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

