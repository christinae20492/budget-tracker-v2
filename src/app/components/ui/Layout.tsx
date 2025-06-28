"use client";

import React, { useEffect, useState } from "react";
import FloatingMenu from "./FloatingMenu";
import "@/app/tailwind.css";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import { successToast } from "@/app/utils/toast";
import NavBar from "./NavBar";
import { signIn, useSession } from "next-auth/react";
import LoadingScreen from "./Loader";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    verify();
  }, [status]);

  const verify = async () => {
    if (status === "unauthenticated") {
      await signIn("credentials", {
        redirect: false,
      });
    } else if (status === "loading" || !session) {
      return <LoadingScreen />;
    }
  };

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
