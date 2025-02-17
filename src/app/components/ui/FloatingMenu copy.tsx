'use client'
import React, { useEffect, useState } from "react";
import { toggleTheme } from "@/app/utils/theme";
import Link from "next/link";
import {
  HomeOutlined,
  InsertRowAboveOutlined,
  MailOutlined,
  PieChartOutlined,
  BulbOutlined,
  BulbFilled,
  EditOutlined
} from "@ant-design/icons";

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
  
  return (
    <div
      className="floating-menu"
    >
      <Link href={"/"}>
        <HomeOutlined className="mx-4 hover:b-2 border-blue" />
      </Link>
      <Link href={"/calendar"}>
        <InsertRowAboveOutlined className="mx-4 hover:ring:1" />
      </Link>
      <Link href={"/monthly-summary"}>
        <PieChartOutlined className="mx-4 hover:ring:1" />
      </Link>
      <Link href={"/envelopes"}>
        <MailOutlined className="mx-4 hover:ring:1" />
      </Link>
      <Link href={"/edit"}>
        <EditOutlined className="mx-4 hover:ring:1" />
      </Link>
      <button onClick={handleToggleTheme} id="theme-toggle">
      {isDarkTheme ? (
        <BulbOutlined className="mx-4 hover:ring-1" />
      ) : (
        <BulbFilled className="mx-4 hover:ring-1" />
      )}
      </button>
    </div>
  );
}
