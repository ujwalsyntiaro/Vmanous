import React, { useRef } from 'react';
import { Calendar } from 'lucide-react';

// Converts YYYY-MM-DD to DD/MM/YYYY
export const isoToDDMMYYYY = (isoStr) => {
  if (!isoStr) return '';
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(isoStr)) return isoStr;
  const parts = isoStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return isoStr;
};

// Converts DD/MM/YYYY to YYYY-MM-DD
export const ddmmYYYYToISO = (str) => {
  if (!str) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const parts = str.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    if (day && month && year && year.length === 4) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }
  return str;
};

// Helper: Validates if DD/MM/YYYY is a real calendar date
export const isValidDDMMYYYY = (str) => {
  if (!str) return true; // Optional field empty is valid
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return false;
  const [day, month, year] = str.split('/').map(Number);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1990 || year > 2099) return false;
  const dateObj = new Date(year, month - 1, day);
  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
};

const DateInput = ({
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
  placeholder = "DD/MM/YYYY"
}) => {
  const hiddenDateRef = useRef(null);

  // Derive display value in DD/MM/YYYY format
  const displayValue = isoToDDMMYYYY(value);
  const isValid = isValidDDMMYYYY(displayValue);

  // Handle manual text entry with DD/MM/YYYY validation
  const handleTextChange = (e) => {
    let raw = e.target.value;
    
    // Extract only digits
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;

    let day = digits.slice(0, 2);
    let month = digits.slice(2, 4);
    let year = digits.slice(4, 8);

    // Validate Day max 31
    if (day.length === 2 && Number(day) > 31) {
      day = '31';
    }
    // Validate Month max 12
    if (month.length === 2 && Number(month) > 12) {
      month = '12';
    }

    if (digits.length > 2 && digits.length <= 4) {
      formatted = `${day}/${month}`;
    } else if (digits.length > 4) {
      formatted = `${day}/${month}/${year}`;
    } else {
      formatted = day;
    }

    let isoVal = formatted;
    if (formatted.length === 10 && isValidDDMMYYYY(formatted)) {
      isoVal = ddmmYYYYToISO(formatted);
    }

    onChange({
      target: {
        name,
        value: isoVal
      }
    });
  };

  // Handle native calendar selection
  const handleNativeDateChange = (e) => {
    const isoVal = e.target.value; // YYYY-MM-DD
    onChange({
      target: {
        name,
        value: isoVal
      }
    });
  };

  const openCalendar = () => {
    if (disabled) return;
    if (hiddenDateRef.current) {
      if (typeof hiddenDateRef.current.showPicker === 'function') {
        try {
          hiddenDateRef.current.showPicker();
        } catch (err) {
          hiddenDateRef.current.focus();
          hiddenDateRef.current.click();
        }
      } else {
        hiddenDateRef.current.focus();
        hiddenDateRef.current.click();
      }
    }
  };

  return (
    <div className={`relative flex items-center w-full ${disabled ? 'cursor-not-allowed' : ''}`}>
      <input
        type="text"
        name={name}
        value={displayValue}
        onChange={handleTextChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={10}
        className={`${className} pr-10 ${!isValid && displayValue.length === 10 ? 'border-red-500 ring-2 ring-red-200' : ''} ${disabled ? 'cursor-not-allowed select-none bg-slate-100/90 text-slate-500' : ''}`}
      />
      
      {/* Hidden native date picker for browser popup */}
      <input
        ref={hiddenDateRef}
        type="date"
        value={ddmmYYYYToISO(value)}
        onChange={handleNativeDateChange}
        disabled={disabled}
        className="sr-only absolute opacity-0 w-0 h-0 pointer-events-none"
        tabIndex={-1}
      />

      <button
        type="button"
        onClick={openCalendar}
        disabled={disabled}
        className={`absolute right-3 transition-colors focus:outline-none ${
          disabled
            ? 'text-slate-300 cursor-not-allowed pointer-events-none'
            : 'text-gray-400 hover:text-[#2D73B4] cursor-pointer'
        }`}
        title={disabled ? "Date Locked" : "Select Date (DD/MM/YYYY)"}
      >
        <Calendar className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DateInput;
