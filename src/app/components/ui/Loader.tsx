import React from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50 dark:bg-grey-600">
      <div className="bg-green-light dark:bg-green-deep p-8 rounded-full flex items-center justify-center text-grey-600 text-4xl border-2 border-green-dark">
        <FontAwesomeIcon icon={faSpinner} spin />
      </div>
    </div>
  );
}
