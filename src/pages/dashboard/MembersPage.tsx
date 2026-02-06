import { useState, useEffect } from 'react';
import { AppHeader } from '../../components/layout';
import { api } from '../../services/api';

interface Integrante {
  id: string;
  nombre: string;
  foto: string | null;
  rol: 'responsable' | 'ayudante' | 'supervisor' | null;
  grupo: string | null;
  etiquetas: string[];
  porcentaje: number;
}

export function MembersPage() {
  const [showMap, setShowMap] = useState(false);
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntegrantes();
  }, []);

  const loadIntegrantes = async () => {
    setLoading(true);
    const result = await api.getIntegrantes();
    if (result.data?.integrantes) {
      setIntegrantes(result.data.integrantes);
    }
    setLoading(false);
  };

  const getRolBadge = (rol: string | null) => {
    switch (rol) {
      case 'responsable':
        return <span className="inline-block bg-[#4CAF50] text-white text-[10px] font-medium px-2 py-0.5 rounded-lg">Responsable</span>;
      case 'ayudante':
        return <span className="inline-block bg-[#9E9E9E] text-white text-[10px] font-medium px-2 py-0.5 rounded-lg">Ayudante</span>;
      case 'supervisor':
        return <span className="inline-block bg-[#FF9800] text-white text-[10px] font-medium px-2 py-0.5 rounded-lg">Supervisor</span>;
      default:
        return null;
    }
  };

  const getEtiquetaColor = (etiqueta: string) => {
    if (etiqueta.includes('Hombres')) return 'bg-[#2196F3] text-white';
    if (etiqueta.includes('Mujeres')) return 'bg-[#E91E63] text-white';
    if (etiqueta.includes('Parejas')) return 'bg-[#9C27B0] text-white';
    if (etiqueta.includes('Nuevo creyente')) return 'bg-[#4CAF50] text-white';
    if (etiqueta.includes('Casa de')) return 'bg-[#FF5722] text-white';
    return 'bg-[#607D8B] text-white';
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <AppHeader />
      
      <main className="px-5 pt-5 pb-0 max-w-2xl mx-auto">
        {/* Title */}
        <h1 className="text-[28px] font-bold text-[#333333] mb-4">Integrantes</h1>
        
        {/* Filter and Order */}
        <div className="flex items-center gap-6 mb-4">
          <button className="flex items-center gap-2 text-[#9E9E9E] text-[14px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            FILTRAR
          </button>
          <button className="flex items-center gap-2 text-[#9E9E9E] text-[14px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="21" x2="4" y2="14"/>
              <line x1="4" y1="10" x2="4" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12" y2="3"/>
              <line x1="20" y1="21" x2="20" y2="16"/>
              <line x1="20" y1="12" x2="20" y2="3"/>
            </svg>
            ORDENAR POR
          </button>
        </div>
        
        {/* Toggle Map */}
        <button 
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2 text-[#9E9E9E] text-[14px] mb-4"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="10" r="3"/>
            <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/>
          </svg>
          {showMap ? 'OCULTAR MAPA' : 'MOSTRAR MAPA'}
        </button>
        
        {/* Map */}
        {showMap && (
          <div className="rounded-xl overflow-hidden mb-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d99089.57696587789!2d-0.4545851!3d39.4699075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd604f4cf0efb06f%3A0xb4a351011f7f1d39!2sValencia%2C%20Spain!5e0!3m2!1sen!2s!4v1706000000000!5m2!1sen!2s"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Integrantes"
            ></iframe>
          </div>
        )}
        
        {/* List */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4CAF50]"></div>
            </div>
          ) : (
            <div className="divide-y divide-[#E0E0E0]">
              {integrantes.map((integrante) => (
                <div key={integrante.id} className="flex items-center gap-3 p-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-[#E0E0E0] overflow-hidden flex-shrink-0">
                    {integrante.foto ? (
                      <img src={integrante.foto} alt={integrante.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#9E9E9E]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="7" r="4"/>
                          <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[#333333] truncate">{integrante.nombre}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getRolBadge(integrante.rol)}
                      {integrante.grupo && (
                        <span className="inline-block bg-[#72E6EA] text-black text-[10px] font-medium px-2 py-0.5 rounded-lg">
                          {integrante.grupo}
                        </span>
                      )}
                      {!integrante.grupo && (
                        <span className="inline-block bg-[#FFEB3B] text-black text-[10px] font-medium px-2 py-0.5 rounded-lg">
                          Sin grupo
                        </span>
                      )}
                    </div>
                    {integrante.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {integrante.etiquetas.map((etiqueta, idx) => (
                          <span 
                            key={idx} 
                            className={`inline-block text-[9px] font-medium px-2 py-0.5 rounded-lg ${getEtiquetaColor(etiqueta)}`}
                          >
                            {etiqueta}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Percentage */}
                  <div className="flex-shrink-0">
                    <span className="text-[14px] font-bold text-[#4CAF50]">{integrante.porcentaje}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Ver más */}
          {integrantes.length > 0 && (
            <div className="text-center py-4 border-t border-[#E0E0E0]">
              <button className="text-[#4CAF50] text-[14px] font-medium">VER MÁS</button>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer Button */}
      <footer className="w-full bg-white px-5 py-5 mt-6">
        <div className="max-w-2xl mx-auto">
          <button className="w-full bg-[#4CAF50] text-white text-[16px] font-medium py-4 px-6 rounded-full hover:bg-[#43A047] transition-colors">
            NUEVO INTEGRANTE
          </button>
        </div>
      </footer>
    </div>
  );
}
