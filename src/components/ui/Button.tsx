import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'text';
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: `
      bg-[#4CAF50] text-white 
      hover:bg-[#43A047] 
      shadow-[0_2px_8px_rgba(76,175,80,0.3)]
      hover:shadow-[0_4px_12px_rgba(76,175,80,0.4)]
    `,
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    text: 'text-[#4CAF50] hover:text-[#388E3C]',
  };

  return (
    <button
      className={`
        px-8 py-3
        text-[15px] font-semibold tracking-wider
        rounded-full
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        inline-flex items-center justify-center
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  );
}
