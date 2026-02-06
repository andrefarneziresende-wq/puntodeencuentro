import { useState, useEffect } from 'react';
import { AppHeader } from '../../components/layout';
import { api } from '../../services/api';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  groupId: string;
  groupName: string;
  role: string;
  photoUrl: string | null;
  joinedAt: string;
  isActive: boolean;
}

export function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    const result = await api.getMembers();
    if (result.data) {
      setMembers(result.data.members);
    }
    setLoading(false);
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      'leader': 'Líder',
      'co-leader': 'Co-líder',
      'member': 'Miembro'
    };
    return roles[role] || role;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <AppHeader />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[28px] font-bold text-[#333333]">Integrantes</h1>
          <button
            className="bg-[#4CAF50] text-white p-2.5 rounded-full shadow-md hover:bg-[#43A047] transition-colors"
            aria-label="Añadir integrante"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <svg 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9E9E]" 
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre o grupo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-[#E0E0E0] text-[15px] focus:outline-none focus:border-[#4CAF50] transition-colors"
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CAF50]"></div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-[#9E9E9E] text-[15px]">
                {searchTerm ? 'No se encontraron integrantes.' : 'No hay integrantes registrados.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0F0F0]">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 hover:bg-[#FAFAFA] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-[#E0E0E0] overflow-hidden flex-shrink-0">
                      {member.photoUrl ? (
                        <img 
                          src={member.photoUrl} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#4CAF50] text-white text-[18px] font-bold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-semibold text-[#333333] truncate">
                          {member.name}
                        </h3>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                          member.role === 'leader' 
                            ? 'bg-[#FFF3E0] text-[#FF9800]'
                            : member.role === 'co-leader'
                            ? 'bg-[#E3F2FD] text-[#2196F3]'
                            : 'bg-[#F5F5F5] text-[#757575]'
                        }`}>
                          {getRoleLabel(member.role)}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#757575] truncate">
                        {member.groupName}
                      </p>
                      <p className="text-[12px] text-[#9E9E9E]">
                        Desde {formatDate(member.joinedAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <button className="text-[#9E9E9E] hover:text-[#4CAF50] transition-colors p-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="12" cy="5" r="1"/>
                        <circle cx="12" cy="19" r="1"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Count */}
        {!loading && filteredMembers.length > 0 && (
          <p className="text-center text-[13px] text-[#9E9E9E] mt-4">
            {filteredMembers.length} integrante{filteredMembers.length !== 1 ? 's' : ''}
          </p>
        )}
      </main>
    </div>
  );
}
