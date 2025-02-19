"use client"

import React from "react";
import FloatingMenu from "./FloatingMenu";
import "@/app/tailwind.css";
import { ToastContainer, toast } from "react-toastify";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <div id="layout">
      <header>
       <FloatingMenu />
      </header>
      <main className="main-container">
        {children}
      </main>
      <ToastContainer />
    </div>
  );
};

export default Layout;
