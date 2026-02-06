import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Logo } from '../ui';
import { useAuthStore } from '../../stores/authStore';

export function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const isCurrentPath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Inicio', path: '/dashboard' },
    { label: 'Testimonios', path: '/dashboard/testimonios' },
    { label: 'Grupos de Hogar', path: '/dashboard/grupos' },
    { label: 'Integrantes', path: '/dashboard/integrantes' },
    { label: 'Ministerios', path: '/dashboard/ministerios' },
    { label: 'Bajas', path: '/dashboard/bajas' },
  ];

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <div className="flex flex-col leading-none">
              <span className="text-[8px] sm:text-[10px] text-black font-bold tracking-[0.2em]">seguimiento</span>
              <span 
                className="text-[#4CAF50] text-[11px] sm:text-[14px]"
                style={{ fontFamily: "'Permanent Marker', cursive" }}
              >
                GRUPOS DE HOGAR
              </span>
            </div>
          </div>
          
          {/* Menu Button */}
          <button
            onClick={() => setShowMenu(true)}
            className="text-[#757575] hover:text-[#333333] transition-colors p-1"
            aria-label="Menu"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Slide-out Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 z-50"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-[28px] font-bold text-[#333333]">Menú</h2>
                <button
                  onClick={() => setShowMenu(false)}
                  className="text-[#9E9E9E] hover:text-[#333333] transition-colors p-1"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              
              {/* Subtitle */}
              <div className="flex flex-col leading-none">
                <span className="text-[11px] text-black font-bold tracking-[0.25em]">seguimiento</span>
                <span 
                  className="text-[#4CAF50] text-[18px]"
                  style={{ fontFamily: "'Permanent Marker', cursive" }}
                >
                  GRUPOS DE HOGAR
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-6">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMenu(false)}
                  className={`block py-3 text-[18px] transition-colors text-[#333333] hover:text-[#4CAF50] ${
                    isCurrentPath(item.path) ? 'font-bold' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Profile Section */}
            <div className="p-6 border-t border-[#E0E0E0]">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                {/* User Photo */}
                <div className="w-12 h-12 rounded-full bg-[#E0E0E0] overflow-hidden flex-shrink-0">
                  {user?.photoUrl ? (
                    <img 
                      src={user.photoUrl} 
                      alt={user.name || 'Usuario'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#4CAF50] text-white text-[18px] font-bold">
                      {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                {/* User Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-[#333333] truncate">
                    {user?.name || user?.email?.split('@')[0] || 'Usuario'}
                  </p>
                  <Link
                    to="/dashboard/perfil"
                    onClick={() => setShowMenu(false)}
                    className="text-[#4CAF50] text-[13px] hover:text-[#388E3C] transition-colors"
                  >
                    Ver perfil
                  </Link>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 text-[#E91E63] text-[15px] font-medium hover:text-[#C2185B] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                  <line x1="12" y1="2" x2="12" y2="12"/>
                </svg>
                Cerrar Sesión
              </button>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#E0E0E0] flex items-center justify-between">
              <Link
                to="/ayuda"
                onClick={() => setShowMenu(false)}
                className="text-[#4CAF50] text-[13px] flex items-center gap-1 hover:text-[#388E3C] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Ayuda
              </Link>
              <span className="text-[12px] text-[#9E9E9E]">v.1.0. © CCLN</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
