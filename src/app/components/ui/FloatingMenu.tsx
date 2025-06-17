"use client";
import React, { useEffect, useState } from "react";
import { toggleTheme } from "@/app/utils/theme";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCalendar,
  faChartPie,
  faEnvelope,
  faPenToSquare,
  faLightbulb,
  faBookBookmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function FloatingMenu() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setIsDarkTheme(savedTheme === "dark");
  }, []);

  const handleToggleTheme = () => {
    toggleTheme();
    setIsDarkTheme((prev) => !prev);
  };

 //<Link href={"/user/acc"}>
      //<span className="user-btn">
      //<FontAwesomeIcon icon={faUser} className="menu-icon scale-150 hover:text-gray-600"/>
      //</span>
      //</Link>
      
  return (
    <div className="floating-menu">
     
      <Link href={"/"}>
        <FontAwesomeIcon icon={faHouse} className="menu-icon" />
      </Link>
      <Link href={"/calendar"}>
        <FontAwesomeIcon icon={faCalendar} className="menu-icon" />
      </Link>
      <Link href={"/monthly-summary"}>
        <FontAwesomeIcon icon={faChartPie} className="menu-icon" />
      </Link>
      <Link href={"/envelopes"}>
        <FontAwesomeIcon icon={faEnvelope} className="menu-icon" />
      </Link>
      <Link href={"/edit"}>
        <FontAwesomeIcon icon={faPenToSquare} className="menu-icon" />
      </Link>
      <Link href={"/notes"}>
        <FontAwesomeIcon icon={faBookBookmark} className="menu-icon" />
      </Link>
      <button onClick={handleToggleTheme} id="theme-toggle">
        {isDarkTheme ? (
          <FontAwesomeIcon icon={faLightbulb} className="menu-icon" />
        ) : (
          <FontAwesomeIcon icon={faLightbulb} className="menu-icon" />
        )}
      </button>
    </div>
  );
}
