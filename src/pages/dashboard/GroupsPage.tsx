import { useState, useEffect } from 'react';
import { AppHeader } from '../../components/layout';
import { api } from '../../services/api';

interface Group {
  id: string;
  name: string;
  description: string;
  meetingDay: string;
  meetingTime: string;
  address: string;
  leaderName: string;
  memberCount: number;
  isActive: boolean;
}

export function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    const result = await api.getGroups();
    if (result.data) {
      setGroups(result.data.groups);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <AppHeader />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[28px] font-bold text-[#333333]">Grupos de Hogar</h1>
          <button
            className="bg-[#4CAF50] text-white p-2.5 rounded-full shadow-md hover:bg-[#43A047] transition-colors"
            aria-label="Añadir grupo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CAF50]"></div>
            </div>
          ) : groups.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <p className="text-[#9E9E9E] text-[15px]">
                No hay grupos registrados.
              </p>
            </div>
          ) : (
            groups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-[18px] font-semibold text-[#333333]">
                      {group.name}
                    </h3>
                    <p className="text-[13px] text-[#757575] mt-0.5">
                      Líder: {group.leaderName}
                    </p>
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                    group.isActive 
                      ? 'bg-[#E8F5E9] text-[#4CAF50]' 
                      : 'bg-[#FFEBEE] text-[#E57373]'
                  }`}>
                    {group.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[14px] text-[#757575] mb-3">
                  {group.description}
                </p>

                {/* Info */}
                <div className="flex flex-wrap gap-4 text-[13px] text-[#757575]">
                  <div className="flex items-center gap-1.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>{group.meetingDay} {group.meetingTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>{group.memberCount} integrantes</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-1.5 mt-2 text-[13px] text-[#757575]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{group.address}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
