import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-[32px] shadow-xl
        px-8 py-10
        ${className}
      `}
    >
      {children}
    </div>
  );
}
