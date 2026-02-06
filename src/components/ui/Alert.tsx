import { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  variant?: 'error' | 'success' | 'warning' | 'info';
  className?: string;
}

export function Alert({ children, variant = 'error', className = '' }: AlertProps) {
  const variants = {
    error: 'bg-[#F8D7DA] text-[#D32F2F]',
    success: 'bg-[#E8F5E9] text-[#2E7D32]',
    warning: 'bg-[#FFF8E1] text-[#F57F17]',
    info: 'bg-[#E3F2FD] text-[#1565C0]',
  };

  return (
    <div
      className={`
        w-full px-4 py-3 rounded-xl
        text-center text-[14px] font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
