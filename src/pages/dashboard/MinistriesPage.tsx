import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { AppHeader } from '../../components/layout';
import { api } from '../../services/api';

interface Ministry {
  id: string;
  name: string;
  description: string;
  leaderName: string;
  memberCount: number;
  isActive: boolean;
}

export function MinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMinistries();
  }, []);

  const loadMinistries = async () => {
    setLoading(true);
    const result = await api.getMinistries();
    if (result.data) {
      setMinistries(result.data.ministries);
    }
    setLoading(false);
  };

  const getMinistryIcon = (name: string) => {
    const icons: Record<string, ReactElement> = {
      'Alabanza': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/>
          <circle cx="18" cy="16" r="3"/>
        </svg>
      ),
      'Niños': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="4" r="2"/>
          <path d="M12 6v6"/>
          <path d="M8 12h8"/>
          <path d="M10 12l-4 8"/>
          <path d="M14 12l4 8"/>
        </svg>
      ),
      'Jóvenes': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      'Misiones': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      )
    };
    return icons[name] || (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <AppHeader />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[28px] font-bold text-[#333333]">Ministerios</h1>
          <button
            className="bg-[#4CAF50] text-white p-2.5 rounded-full shadow-md hover:bg-[#43A047] transition-colors"
            aria-label="Añadir ministerio"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="grid gap-4 sm:grid-cols-2">
          {loading ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CAF50]"></div>
            </div>
          ) : ministries.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl shadow-sm p-6 text-center">
              <p className="text-[#9E9E9E] text-[15px]">
                No hay ministerios registrados.
              </p>
            </div>
          ) : (
            ministries.map((ministry) => (
              <div
                key={ministry.id}
                className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                {/* Icon & Status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center">
                    {getMinistryIcon(ministry.name)}
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                    ministry.isActive 
                      ? 'bg-[#E8F5E9] text-[#4CAF50]' 
                      : 'bg-[#FFEBEE] text-[#E57373]'
                  }`}>
                    {ministry.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {/* Name & Description */}
                <h3 className="text-[18px] font-semibold text-[#333333] mb-1">
                  {ministry.name}
                </h3>
                <p className="text-[14px] text-[#757575] mb-3">
                  {ministry.description}
                </p>

                {/* Leader & Members */}
                <div className="flex items-center justify-between text-[13px] text-[#757575] pt-3 border-t border-[#F0F0F0]">
                  <span>Líder: {ministry.leaderName}</span>
                  <span className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    {ministry.memberCount}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
