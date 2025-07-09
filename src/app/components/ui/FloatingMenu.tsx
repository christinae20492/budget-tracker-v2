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
  faBookBookmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { getUser } from "@/app/server/user";

export default function FloatingMenu() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const {data: session, status} = useSession();

  const getThemeSettings = async () =>{
    if (!session) return;
    const data = await getUser(session.user.id, session, status)
    if (!data) return;
    const theme = data.darkMode;
    if (theme) {
      setIsDarkTheme(true)
    } else {
      setIsDarkTheme(false)
    }
  }

  useEffect(() => {
    getThemeSettings();
    toggleTheme(isDarkTheme)
  }, [session, isDarkTheme]);
  
  return (
    <div className="floating-menu">
      <Link href={"/user/acc"}>
      <span className="user-btn">
      <FontAwesomeIcon icon={faUser} className="menu-icon scale-150 hover:text-gray-600"/>
      </span>
      </Link>
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
    </div>
  );
}
