interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'h-8 sm:h-10',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
  };

  return (
    <img 
      src="/logo.png" 
      alt="Punto de Encuentro - comunidad, familia y fe"
      className={`${sizes[size]} w-auto object-contain ${className}`}
      style={{ 
        imageRendering: 'auto',
        WebkitFontSmoothing: 'antialiased'
      }}
    />
  );
}
