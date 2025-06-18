"use client";

import { useState } from "react";

type ViewType = "expenses" | "income" | "both";

export default function ToggleSwitch({
  onToggle,
}: {
  onToggle: (view: ViewType) => void;
}) {
  const [view, setView] = useState<ViewType>("both");

  const handleToggle = (newView: ViewType) => {
    setView(newView);
    onToggle(newView);
  };

  return (
    <div className="bg-blue-med rounded-2xl shadow-sm text-center content-center
    xl:w-fit 
    sm:clear-both
    sm:w-1/8 sm:h-12 sm:p-2 sm:absolute sm:top-2 sm:right-4 sm:float-right   
    w-full h-fit float-none p-1 block">
      <button
        className={`text-white text-md mx-4 ${
          view === "income" ? "font-bold" : ""
        }`}
        onClick={() => handleToggle("income")}
      >
        Income
      </button>
      <button
        className={`text-white text-md mx-4 ${
          view === "expenses" ? "font-bold" : ""
        }`}
        onClick={() => handleToggle("expenses")}
      >
        Expenses
      </button>
      <button
        className={`text-white text-md mx-4 ${
          view === "both" ? "font-bold" : ""
        }`}
        onClick={() => handleToggle("both")}
      >
        Both
      </button>
    </div>
  );
}
