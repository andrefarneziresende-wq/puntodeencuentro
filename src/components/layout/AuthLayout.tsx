import { ReactNode } from 'react';
import { Logo } from '../ui';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-4 py-8">
      {/* Main Card */}
      <div className="w-full max-w-[360px] bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] px-7 py-8">
        {/* Header - Logo centered */}
        <div className="flex justify-center">
          <Logo size="md" />
        </div>
        
        {/* Divider */}
        <div className="border-t border-[#E0E0E0] my-5" />
        
        {/* Subtitle - seguimiento (bold, black) */}
        <p className="text-center text-black text-[13px] font-bold tracking-[0.3em] lowercase">
          seguimiento
        </p>
        
        {/* Title - GRUPOS DE HOGAR (Permanent Marker font) */}
        <h1 
          className="text-center text-[#4CAF50] text-[28px] mt-0.5 italic"
          style={{ 
            fontFamily: "'Permanent Marker', cursive",
          }}
        >
          GRUPOS DE HOGAR
        </h1>
        
        {/* Content */}
        <div className="mt-6">
          {children}
        </div>
      </div>
      
      {/* Footer Link */}
      <div className="mt-6">
        <a
          href="https://puntodeencuentro.org"
          className="text-[#9E9E9E] hover:text-[#4CAF50] text-[13px] flex items-center gap-2 transition-colors"
        >
          <span>←</span>
          <span className="underline">Volver a la web de Punto de Encuentro.</span>
        </a>
      </div>
    </div>
  );
}
