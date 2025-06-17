"use client";

import React, { useEffect, useState } from "react";
import FloatingMenu from "./FloatingMenu";
import "@/app/tailwind.css";
import "@/app/amplify-overrides.css";
import { ToastContainer, toast } from "react-toastify";
import { Amplify } from "aws-amplify";
import awsmobile from "@/aws-exports";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/router";
import { successToast } from "@/app/utils/toast";

interface LayoutProps {
  children: React.ReactNode;
}

Amplify.configure(awsmobile);

const Layout: React.FC<LayoutProps> = ({ children }) => {


  return (
    <div id="layout">
      <header>
        <FloatingMenu />
      </header>
      <main className="main-container">{children}</main>
      <ToastContainer />
    </div>
  );
};

export default Layout;
