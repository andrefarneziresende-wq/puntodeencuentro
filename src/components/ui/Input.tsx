import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hasError?: boolean;
  showPasswordToggle?: boolean;
}

export function Input({
  label,
  error,
  hasError = false,
  showPasswordToggle = false,
  type = 'text',
  className = '',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  const showErrorStyle = error || hasError;

  return (
    <div className="w-full">
      <label className="block text-[14px] font-semibold text-[#333333] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          className={`
            w-full px-4 py-3
            border-2 rounded-lg
            text-[#333333] text-[15px]
            placeholder:text-[#BDBDBD] placeholder:text-[15px]
            bg-white
            transition-colors duration-200
            focus:outline-none
            ${showErrorStyle 
              ? 'border-[#E91E63] focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]' 
              : 'border-[#E0E0E0] focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]'
            }
            ${className}
          `}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors p-1 ${
              showErrorStyle ? 'text-[#E91E63]' : 'text-[#4CAF50] hover:text-[#388E3C]'
            }`}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-[13px] text-[#E91E63]">{error}</p>
      )}
    </div>
  );
}
