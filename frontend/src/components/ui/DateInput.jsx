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

const DateInput = ({
  name,
  value,
  onChange,
  required = false,
  className = "",
  placeholder = "DD/MM/YYYY"
}) => {
  const hiddenDateRef = useRef(null);

  // Derive display value in DD/MM/YYYY format
  const displayValue = isoToDDMMYYYY(value);

  // Handle manual text entry
  const handleTextChange = (e) => {
    let raw = e.target.value;
    
    // Extract only digits
    const digits = raw.replace(/\D/g, '');
    let formatted = digits;
    
    if (digits.length > 2 && digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }

    let isoVal = formatted;
    if (formatted.length === 10) {
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
    <div className="relative flex items-center w-full">
      <input
        type="text"
        name={name}
        value={displayValue}
        onChange={handleTextChange}
        required={required}
        placeholder={placeholder}
        maxLength={10}
        className={`${className} pr-10`}
      />
      
      {/* Hidden native date picker for browser popup */}
      <input
        ref={hiddenDateRef}
        type="date"
        value={ddmmYYYYToISO(value)}
        onChange={handleNativeDateChange}
        className="sr-only absolute opacity-0 w-0 h-0 pointer-events-none"
        tabIndex={-1}
      />

      <button
        type="button"
        onClick={openCalendar}
        className="absolute right-3 text-gray-400 hover:text-[#2D73B4] transition-colors focus:outline-none"
        title="Select Date"
      >
        <Calendar className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DateInput;
