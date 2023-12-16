import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "./style.css";

export default function MainLayout() {
  return (
    <div
      role="main"
      className="relative mr-auto flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-gray-100"
    >
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
