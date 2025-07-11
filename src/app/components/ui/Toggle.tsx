import React from 'react';

interface ToggleSwitchProps {
  isOn: boolean;
  handleToggle: (newToggleState: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const ToggleButton: React.FC<ToggleSwitchProps> = ({
  isOn,
  handleToggle,
  label,
  disabled = false,
  id = `toggle-switch-${Math.random().toString(36).substring(2, 9)}`,
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
        type="button"
        id={id}
        role="switch"
        aria-checked={isOn}
        onClick={() => !disabled && handleToggle(!isOn)}
        className={toggleClasses}
        disabled={disabled}
      >
        <span className="sr-only">{label ? label : 'Toggle'}</span>
        <span className={spanClasses}></span>
      </button>
    </div>
  );
};
