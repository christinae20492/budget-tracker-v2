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
    <div className="w-1/8 h-12 p-2 absolute top-2 right-4 float-right bg-blue-med rounded-2xl shadow-sm clear-both text-center content-center">
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
