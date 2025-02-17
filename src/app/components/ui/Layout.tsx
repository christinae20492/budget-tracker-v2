import React from "react";
import { applySavedTheme } from "@/app/utils/theme";
import FloatingMenu from "./FloatingMenu";
import "@/app/tailwind.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  //applySavedTheme();

  return (
    <div id="layout">
      <header>
       <FloatingMenu />
      </header>
      <main className="main-container">
        {children}
      </main>
    </div>
  );
};

export default Layout;
