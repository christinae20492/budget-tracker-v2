"use client";

import React, { useEffect, useState } from "react";
import FloatingMenu from "./FloatingMenu";
import "@/app/tailwind.css";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import { successToast } from "@/app/utils/toast";
import NavBar from "./NavBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {


  return (
    <div id="layout">
      <header>
        <FloatingMenu />
        <NavBar />
      </header>
      <main className="main-container">{children}</main>
      <ToastContainer />
    </div>
  );
};

export default Layout;
