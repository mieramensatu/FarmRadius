import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/footer";
import Profile from "./Profile/Profile";
import EditProfile from "./EditProfile/EditProfile";

function Profileuser() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="edit" element={<EditProfile />} />
      </Routes>
      <Outlet />
      <Footer />
    </>
  );
}

export default Profileuser;
