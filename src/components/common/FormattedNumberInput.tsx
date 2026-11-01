import React, { useRef } from 'react';

interface FormattedNumberInputProps {
  id?: string;
  label: string;
  placeholder: string;
  value: number | '';
  onChange: (value: number | '') => void;
  error?: string;
  prefix?: string;
  unit?: string;
  badgePreview?: React.ReactNode;
  className?: string;
}

export const FormattedNumberInput: React.FC<FormattedNumberInputProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  prefix,
  unit,
  badgePreview,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Formatted string representation with comma thousand separators
  const displayValue =
    value === '' || value === undefined || value === null
      ? ''
      : value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const rawVal = input.value;
    const cursorIndex = input.selectionStart ?? rawVal.length;

    // Count how many non-comma digits appeared before the cursor
    const digitsBeforeCursor = rawVal.slice(0, cursorIndex).replace(/[^0-9]/g, '').length;

    // Filter down to only pure digits
    const cleanDigits = rawVal.replace(/[^0-9]/g, '');

    if (cleanDigits === '') {
      onChange('');
      return;
    }

    // Parse clean numeric value
    const numericVal = parseInt(cleanDigits, 10);
    if (!isNaN(numericVal) && Number.isSafeInteger(numericVal)) {
      onChange(numericVal);
    }

    // Format new value to compute target cursor position
    const formatted = cleanDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let newCursorPos = formatted.length;
    let digitsSeen = 0;

    for (let i = 0; i < formatted.length; i++) {
      if (formatted[i] !== ',') {
        digitsSeen++;
      }
      if (digitsSeen === digitsBeforeCursor) {
        newCursorPos = i + 1;
        break;
      }
    }

    // Maintain stable cursor position after DOM update
    requestAnimationFrame(() => {
      if (inputRef.current && document.activeElement === inputRef.current) {
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Navigation / modifier keys
    const isAllowedNav = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ].includes(e.key);

    const isModifier = e.ctrlKey || e.metaKey || e.altKey;

    // Block letters, negative signs (-), decimal points (.), plus (+), exponents (e), and special characters
    if (!isAllowedNav && !isModifier && !/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    // When backspacing immediately after a comma (e.g., "14,|000"), delete the digit before the comma
    if (e.key === 'Backspace') {
      const input = e.currentTarget;
      const { selectionStart, selectionEnd, value: currentVal } = input;
      if (selectionStart !== null && selectionStart === selectionEnd && selectionStart > 0) {
        if (currentVal[selectionStart - 1] === ',') {
          e.preventDefault();
          const newRaw = currentVal.slice(0, selectionStart - 2) + currentVal.slice(selectionStart);
          const clean = newRaw.replace(/[^0-9]/g, '');
          onChange(clean === '' ? '' : parseInt(clean, 10));

          requestAnimationFrame(() => {
            const targetPos = Math.max(0, selectionStart - 2);
            input.setSelectionRange(targetPos, targetPos);
          });
        }
      }
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label and Badge Row */}
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold text-slate-300">
          {label}
        </label>
        {badgePreview ? (
          badgePreview
        ) : (
          <span className="text-[11px] font-mono text-orange-400 font-bold">
            {value !== '' ? (
              <>
                {prefix && `${prefix} `}
                {displayValue}
                {unit && ` ${unit}`}
              </>
            ) : (
              <span className="text-slate-500 font-normal italic">Unset</span>
            )}
          </span>
        )}
      </div>

      {/* Input Field Container */}
      <div
        className={`flex items-center rounded-xl overflow-hidden border bg-slate-950 transition-colors shadow-inner focus-within:ring-1 focus-within:ring-orange-400/40 ${
          error
            ? 'border-red-500/80 focus-within:border-red-400'
            : 'border-slate-700/80 focus-within:border-orange-400'
        }`}
      >
        {prefix && (
          <span className="px-3 py-2.5 bg-slate-900 border-r border-slate-800 text-xs font-mono font-bold text-orange-400 flex items-center select-none shrink-0">
            {prefix}
          </span>
        )}

        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
        />

        {unit && !prefix && (
          <span className="px-3 py-2.5 text-xs font-mono text-slate-400 select-none shrink-0">
            {unit}
          </span>
        )}
      </div>

      {/* Validation Error Message */}
      {error && (
        <p className="text-[11px] text-red-400 font-medium animate-in fade-in duration-100">
          {error}
        </p>
      )}
    </div>
  );
};
