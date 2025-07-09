import { getUser } from "@/app/server/user";
import { toggleTheme } from "@/app/utils/theme";
import {
  faUser,
  faHouse,
  faCalendar,
  faChartPie,
  faEnvelope,
  faPenToSquare,
  faBookBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function NavBar() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const { data: session, status } = useSession();

  const getThemeSettings = async () => {
    if (!session) return;
    const data = await getUser(session.user.id, session, status);
    if (!data) return;
    const theme = data.darkMode;
    if (theme) {
      setIsDarkTheme(true);
    } else {
      setIsDarkTheme(false);
    }
  };

  useEffect(() => {
    getThemeSettings();
    toggleTheme(isDarkTheme);
  }, [session, isDarkTheme]);

  return (
    <div className="mobile-nav">
      <span className="flex flex-row justify-around">
        <Link href={"/user/acc"}>
          <FontAwesomeIcon icon={faUser} className="mobile-icon" />
        </Link>
        <Link href={"/"}>
          <FontAwesomeIcon icon={faHouse} className="mobile-icon" />
        </Link>
        <Link href={"/calendar"}>
          <FontAwesomeIcon icon={faCalendar} className="mobile-icon" />
        </Link>
        <Link href={"/monthly-summary"}>
          <FontAwesomeIcon icon={faChartPie} className="mobile-icon" />
        </Link>
        <Link href={"/envelopes"}>
          <FontAwesomeIcon icon={faEnvelope} className="mobile-icon" />
        </Link>
        <Link href={"/edit"}>
          <FontAwesomeIcon icon={faPenToSquare} className="mobile-icon" />
        </Link>
        <Link href={"/notes"}>
          <FontAwesomeIcon icon={faBookBookmark} className="mobile-icon" />
        </Link>
      </span>
    </div>
  );
}
