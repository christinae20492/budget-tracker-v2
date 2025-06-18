import { toggleTheme } from '@/app/utils/theme';
import { faUser, faHouse, faCalendar, faChartPie, faEnvelope, faPenToSquare, faBookBookmark, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export default function NavBar() {
   const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setIsDarkTheme(savedTheme === "dark");
  }, []);

  const handleToggleTheme = () => {
    toggleTheme();
    setIsDarkTheme((prev) => !prev);
  };


      
  return (
    <div className="mobile-nav">
      <span className='flex flex-row justify-around'>
      <Link href={"/user/acc"}>
      <FontAwesomeIcon icon={faUser} className="mobile-icon"/>
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
      <button onClick={handleToggleTheme} id="theme-toggle">
        {isDarkTheme ? (
          <FontAwesomeIcon icon={faLightbulb} className="mobile-icon" />
        ) : (
          <FontAwesomeIcon icon={faLightbulb} className="mobile-icon" />
        )}
      </button>
      </span>
    </div>
  );
}
