import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./main.css";
import "lenis/dist/lenis.css";
import Landingpage from "./pages/Landingpage/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProductComponent from "./pages/Product/Product";
import Dashboard from "./pages/Admin/Dashboard";
import PeternakProduct from "./pages/Admin/Product/AllProduct/AllProduct";
import AddProduct from "./pages/Admin/Product/AddProduct/Add";
import ProfileAdmin from "./pages/Admin/Profile/Profile";
import EditProfileAdmin from "./pages/Admin/EditProfile/EditProfile"
import UpdateProduct from "./pages/Admin/Product/EditProduct/edit";
import AllUser from "./pages/Admin/User/AllUser/user";
import Auth from "./pages/Auth/auth";
import Toko from "./pages/Admin/Peternak/Peternak";
import RegisterSeller from "./pages/Auth/auth";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/signup-seller" element={<RegisterSeller />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/product" element={<ProductComponent />} />

        {/* Admin Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/product" element={<PeternakProduct />} />
        <Route path="/dashboard/add-product" element={<AddProduct />} />
        <Route path="/dashboard/edit-product/:id" element={<UpdateProduct />} />
        <Route path="/dashboard/profile" element={<ProfileAdmin />} />
        <Route path="/dashboard/edit-profile" element={<EditProfileAdmin />} />
        <Route path="/dashboard/user" element={<AllUser />} />
        <Route path="/dashboard/toko" element={<Toko />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

