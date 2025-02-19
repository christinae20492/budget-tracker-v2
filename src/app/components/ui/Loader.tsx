import React from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LoadingScreen () {
    return (
        <div className="modal-bg">
            <div className="modal-main">
                <span className="mx-auto my-auto p-7 bg-white rounded-lg drop-shadow">
                    <FontAwesomeIcon icon={faSpinner} spin className="scale-125"/></span>
            </div>
        </div>
    )
}