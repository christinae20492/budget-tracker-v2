// components/ui/ToggleSwitch.tsx
import React from 'react';

interface ToggleSwitchProps {
  isOn: boolean; // Current state of the switch (on/off)
  handleToggle: (newToggleState: boolean) => void; // Callback when the switch is toggled
  label?: string; // Optional label to display next to the switch
  disabled?: boolean; // Optional: if the switch should be disabled
  id?: string; // Optional: unique ID for accessibility (if multiple on one page)
  className?: string; // Optional: additional classes for the outer div
}

export const ToggleButton: React.FC<ToggleSwitchProps> = ({
  isOn,
  handleToggle,
  label,
  disabled = false,
  id = `toggle-switch-${Math.random().toString(36).substring(2, 9)}`, // Generate unique ID if not provided
  className,
}) => {
  const toggleClasses = `
    relative inline-flex items-center h-6 rounded-full w-11
    transition-colors duration-200 ease-in-out
    ${isOn ? 'bg-blue-600' : 'bg-gray-200'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  const spanClasses = `
    inline-block h-4 w-4 transform rounded-full bg-white shadow
    transition-transform duration-200 ease-in-out
    ${isOn ? 'translate-x-6' : 'translate-x-1'}
  `;

  return (
    <div className={`flex items-center ${className}`}>
      {label && (
        <label htmlFor={id} className={`mr-3 text-gray-700 dark:text-gray-300 ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </label>
      )}
      <button
        type="button" // Important for buttons inside forms
        id={id}
        role="switch"
        aria-checked={isOn}
        onClick={() => !disabled && handleToggle(!isOn)} // Toggle only if not disabled
        className={toggleClasses}
        disabled={disabled}
      >
        <span className="sr-only">{label ? label : 'Toggle'}</span> {/* For screen readers */}
        <span className={spanClasses}></span>
      </button>
    </div>
  );
};
