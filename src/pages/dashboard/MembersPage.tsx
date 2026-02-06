import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '../../components/layout';
import { api, getImageUrl } from '../../services/api';

interface Integrante {
  id: string;
  nombre: string;
  foto: string | null;
  rol: 'responsable' | 'ayudante' | 'supervisor' | null;
  grupo: string | null;
  gruposSupervisa?: string[];
  etiquetas: string[];
  porcentaje: number;
  responsabilidad?: {
    ayudante: boolean;
    ayudanteGrupos: string[];
    responsable: boolean;
    responsableGrupos: string[];
    supervisor: boolean;
    supervisorGrupos: string[];
  };
}

interface Filters {
  miembros: boolean;
  responsabilidad: string[];
  gruposDeHogar: string[];
  ministerios: string[];
  responsableDeMinisterio: boolean;
  asistencia: {
    ultimoMes: [number, number];
    ultimoAno: [number, number];
    desdeSiempre: [number, number];
  };
  formacion: {
    discipuladoInicial: string[];
    preBautismos: string[];
    escuelaBiblica: string[];
    escuelaDiscipulado: string[];
    entrenamiento: string[];
  };
  fe: {
    nuevoCreyente: boolean;
    nuevoBautizado: boolean;
    bautizado: boolean;
    procedenteDeOtraIglesia: boolean;
  };
}

interface OrderBy {
  field: string;
  direction: 'asc' | 'desc';
}

const initialFilters: Filters = {
  miembros: false,
  responsabilidad: [],
  gruposDeHogar: [],
  ministerios: [],
  responsableDeMinisterio: false,
  asistencia: {
    ultimoMes: [0, 100],
    ultimoAno: [20, 50],
    desdeSiempre: [0, 80],
  },
  formacion: {
    discipuladoInicial: [],
    preBautismos: [],
    escuelaBiblica: [],
    escuelaDiscipulado: [],
    entrenamiento: [],
  },
  fe: {
    nuevoCreyente: false,
    nuevoBautizado: false,
    bautizado: false,
    procedenteDeOtraIglesia: false,
  },
};

const gruposOptions = [
  'Sin grupo',
  'Casa de Samuel',
  'Casa de María Inés',
  'Casa Enrique y Julia',
  'Hombres adultos 1',
  'Hombres adultos 2',
  'Hombres senior',
];

const ministeriosOptions = [
  'Alabanza',
  'Infantil',
  'Obra social',
  'Jóvenes',
  'Matrimonios',
  'Intercesión',
];

const formacionOptions = ['No iniciado', 'Cursando', 'Terminado'];

export function MembersPage() {
  const [showMap, setShowMap] = useState(false);
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [tempFilters, setTempFilters] = useState<Filters>(initialFilters);
  const [orderBy, setOrderBy] = useState<OrderBy>({ field: '', direction: 'asc' });
  const [visibleCount, setVisibleCount] = useState(10);
  const [tempOrderBy, setTempOrderBy] = useState<OrderBy>({ field: '', direction: 'asc' });
  
  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
        return <span className="inline-block bg-[#CBCBCB] text-white text-[10px] font-medium px-2 py-0.5 rounded">Responsable</span>;
      case 'ayudante':
        return <span className="inline-block bg-[#9E9E9E] text-white text-[10px] font-medium px-2 py-0.5 rounded">Ayudante</span>;
      case 'supervisor':
        return <span className="inline-block bg-[#FF9800] text-white text-[10px] font-medium px-2 py-0.5 rounded">Supervisor</span>;
      default:
        return null;
    }
  };

  const getEtiquetaColor = (etiqueta: string) => {
    if (etiqueta.includes('Nuevo creyente')) return 'bg-[#FFEB3B] text-black';
    // All other etiquetas use the same cyan color as group badges
    return 'bg-[#72E6EA] text-black';
  };

  const openFilterModal = () => {
    setTempFilters({ ...filters });
    setShowFilterModal(true);
  };

  const openOrderModal = () => {
    setTempOrderBy({ ...orderBy });
    setShowOrderModal(true);
  };

  const applyFilters = () => {
    setFilters({ ...tempFilters });
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setTempFilters(initialFilters);
  };

  const applyOrder = () => {
    setOrderBy({ ...tempOrderBy });
    setShowOrderModal(false);
  };

  const toggleArrayFilter = (array: string[], value: string) => {
    if (array.includes(value)) {
      return array.filter(v => v !== value);
    }
    return [...array, value];
  };

  // Apply filters and sorting to integrantes
  const filteredAndSortedIntegrantes = React.useMemo(() => {
    let result = [...integrantes];

    // Apply filters
    // Filter by responsabilidad
    if (filters.responsabilidad.length > 0) {
      result = result.filter(i => i.rol && filters.responsabilidad.map(r => r.toLowerCase()).includes(i.rol));
    }

    // Filter by grupos de hogar
    if (filters.gruposDeHogar.length > 0) {
      result = result.filter(i => {
        if (filters.gruposDeHogar.includes('Sin grupo')) {
          return !i.grupo || filters.gruposDeHogar.includes(i.grupo);
        }
        return i.grupo && filters.gruposDeHogar.includes(i.grupo);
      });
    }

    // Filter by asistencia (porcentaje)
    if (filters.asistencia.ultimoMes[0] > 0 || filters.asistencia.ultimoMes[1] < 100) {
      result = result.filter(i => {
        if (i.porcentaje === null) return true;
        return i.porcentaje >= filters.asistencia.ultimoMes[0] && i.porcentaje <= filters.asistencia.ultimoMes[1];
      });
    }

    // Apply sorting
    if (orderBy.field) {
      result.sort((a, b) => {
        let comparison = 0;
        switch (orderBy.field) {
          case 'Nombre':
            comparison = a.nombre.localeCompare(b.nombre);
            break;
          case 'Grupo de hogar':
            const grupoA = a.grupo || 'zzz';
            const grupoB = b.grupo || 'zzz';
            comparison = grupoA.localeCompare(grupoB);
            break;
          case 'Responsabilidad':
            const rolOrder: Record<string, number> = { supervisor: 1, responsable: 2, ayudante: 3 };
            const rolA = a.rol ? rolOrder[a.rol] || 4 : 4;
            const rolB = b.rol ? rolOrder[b.rol] || 4 : 4;
            comparison = rolA - rolB;
            break;
          default:
            comparison = 0;
        }
        return orderBy.direction === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }, [integrantes, filters, orderBy]);

  // Visible integrantes (paginated)
  const visibleIntegrantes = filteredAndSortedIntegrantes.slice(0, visibleCount);
  const hasMoreToShow = filteredAndSortedIntegrantes.length > visibleCount;

  const loadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  // Reset visible count when filters change
  React.useEffect(() => {
    setVisibleCount(10);
  }, [filters, orderBy]);

  // Custom Dropdown Component
  const Dropdown = ({ 
    label, 
    id, 
    options, 
    selected, 
    onSelect, 
    multiple = false 
  }: { 
    label: string; 
    id: string; 
    options: string[]; 
    selected: string | string[]; 
    onSelect: (value: string) => void;
    multiple?: boolean;
  }) => {
    const isOpen = openDropdown === id;
    const selectedArray = Array.isArray(selected) ? selected : (selected ? [selected] : []);
    const displayText = selectedArray.length > 0 
      ? selectedArray.join(', ') 
      : 'Selecciona una opción';

    return (
      <div className="mb-4">
        <label className="block text-[14px] font-medium text-[#333333] mb-2">{label}</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(isOpen ? null : id)}
            className="w-full flex items-center justify-between px-3 py-2 border border-[#E0E0E0] rounded-lg text-[14px] text-left"
          >
            <span className={selectedArray.length > 0 ? 'text-[#333333]' : 'text-[#9E9E9E]'}>
              {displayText.length > 30 ? displayText.substring(0, 30) + '...' : displayText}
            </span>
            <svg 
              width="20" height="20" viewBox="0 0 24 24" fill="none" 
              stroke="#4CAF50" strokeWidth="2"
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-[#E0E0E0] rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onSelect(option);
                    if (!multiple) setOpenDropdown(null);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-[14px] text-left hover:bg-[#F5F5F5]"
                >
                  <span>{option}</span>
                  {multiple && (
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                      selectedArray.includes(option) ? 'bg-[#4CAF50] border-[#4CAF50]' : 'border-[#E0E0E0]'
                    }`}>
                      {selectedArray.includes(option) && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Toggle Component
  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <div className="flex items-center justify-between mb-4">
      <span className="text-[14px] font-medium text-[#333333]">{label}</span>
      <button
        type="button"
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors ${checked ? 'bg-[#4CAF50]' : 'bg-[#E0E0E0]'}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );

  // Range Slider Component - Single line with dual handles (touch/mouse events)
  const RangeSlider = ({ 
    label, 
    min, 
    max, 
    value, 
    onChange 
  }: { 
    label: string; 
    min: number; 
    max: number; 
    value: [number, number]; 
    onChange: (value: [number, number]) => void;
  }) => {
    const trackRef = React.useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = React.useState<'min' | 'max' | null>(null);

    const getPercentFromPosition = (clientX: number): number => {
      if (!trackRef.current) return 0;
      const rect = trackRef.current.getBoundingClientRect();
      const percent = ((clientX - rect.left) / rect.width) * 100;
      return Math.min(Math.max(Math.round(percent), min), max);
    };

    const handleStart = (handle: 'min' | 'max') => (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setDragging(handle);
    };

    React.useEffect(() => {
      if (!dragging) return;

      const handleMove = (e: MouseEvent | TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const newPercent = getPercentFromPosition(clientX);
        
        if (dragging === 'min') {
          const newMin = Math.min(newPercent, value[1] - 1);
          onChange([Math.max(newMin, min), value[1]]);
        } else {
          const newMax = Math.max(newPercent, value[0] + 1);
          onChange([value[0], Math.min(newMax, max)]);
        }
      };

      const handleEnd = () => {
        setDragging(null);
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);

      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }, [dragging, value, onChange, min, max]);

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[12px] font-medium text-[#333333]">{label}</label>
        </div>
        
        {/* Single line: min value - slider - max value */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#4CAF50] font-medium w-10">{value[0]}%</span>
          
          <div ref={trackRef} className="flex-1 relative h-8 touch-none">
            {/* Track background */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 bg-[#E0E0E0] rounded-full" />
            
            {/* Active track */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-[#4CAF50] rounded-full"
              style={{ 
                left: `${value[0]}%`, 
                width: `${value[1] - value[0]}%` 
              }}
            />
            
            {/* Min handle */}
            <div
              onMouseDown={handleStart('min')}
              onTouchStart={handleStart('min')}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-[#4CAF50] rounded-full cursor-pointer shadow-md hover:scale-110 active:scale-110 transition-transform"
              style={{ left: `${value[0]}%`, zIndex: dragging === 'min' ? 10 : 5 }}
            />
            
            {/* Max handle */}
            <div
              onMouseDown={handleStart('max')}
              onTouchStart={handleStart('max')}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-[#4CAF50] rounded-full cursor-pointer shadow-md hover:scale-110 active:scale-110 transition-transform"
              style={{ left: `${value[1]}%`, zIndex: dragging === 'max' ? 10 : 5 }}
            />
          </div>
          
          <span className="text-[12px] text-[#4CAF50] font-medium w-10 text-right">{value[1]}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <AppHeader />
      
      <main className="px-5 pt-5 pb-0 max-w-2xl mx-auto">
        {/* Title */}
        <h1 className="text-[28px] font-bold text-[#333333] mb-4">Integrantes</h1>
        
        {/* Filter and Order */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={openFilterModal}
            className="flex items-center gap-2 text-[#66B97B] text-[14px]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            FILTRAR
          </button>
          <button 
            onClick={openOrderModal}
            className="flex items-center gap-2 text-[#66B97B] text-[14px]"
          >
            <img src="/icon-sort.png" alt="" width="16" height="16" />
            ORDENAR POR
          </button>
        </div>
        
        {/* Toggle Map - Inside Card with Map */}
        <div className="bg-white rounded-2xl shadow-md p-[10px] mb-4">
          <div className="flex justify-center mb-2">
            <button 
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 text-[#66B97B] text-[14px]"
            >
              {showMap ? (
                /* Eye with line - to hide */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                /* Eye open - to show */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
              {showMap ? 'OCULTAR MAPA' : 'MOSTRAR MAPA'}
            </button>
          </div>
          
          {/* Map inside the card */}
          {showMap && (
            <div className="rounded-xl overflow-hidden">
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
        </div>
        
        {/* List */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4CAF50]"></div>
            </div>
          ) : (
            <div>
              {visibleIntegrantes.map((integrante, index) => (
                <div key={integrante.id}>
                  <Link to={`/dashboard/integrante/${integrante.id}`} className="flex items-center gap-3 p-4 hover:bg-[#F5F5F5] transition-colors">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-[#E0E0E0] overflow-hidden flex-shrink-0">
                    {integrante.foto ? (
                      <img src={getImageUrl(integrante.foto) || ''} alt={integrante.nombre} className="w-full h-full object-cover" />
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
                    <p className="text-[14px] font-bold text-[#333333] truncate underline">{integrante.nombre}</p>
                    
                    {/* Check if member's grupo is in any of their role groups */}
                    {(() => {
                      const grupoInSupervisor = integrante.responsabilidad?.supervisor && integrante.responsabilidad?.supervisorGrupos?.includes(integrante.grupo || '');
                      const grupoInResponsable = integrante.responsabilidad?.responsable && integrante.responsabilidad?.responsableGrupos?.includes(integrante.grupo || '');
                      const grupoInAyudante = integrante.responsabilidad?.ayudante && integrante.responsabilidad?.ayudanteGrupos?.includes(integrante.grupo || '');
                      const grupoIsInRoleGroups = grupoInSupervisor || grupoInResponsable || grupoInAyudante;
                      
                      // Track displayed groups to avoid duplicates
                      const displayedGrupos = new Set<string>();
                      
                      return (
                        <>
                          {/* If grupo is NOT in any role groups, show grupo first as normal */}
                          {!grupoIsInRoleGroups && (
                            <div className="flex items-center gap-2 mt-1">
                              {integrante.grupo ? (
                                <span className="inline-flex items-center gap-1 bg-[#72E6EA] text-black text-[10px] font-medium px-2 py-0.5 rounded underline">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                  </svg>
                                  {integrante.grupo}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-[#F21D61] text-white text-[10px] font-medium px-2 py-0.5 rounded">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                    <line x1="12" y1="9" x2="12" y2="13"/>
                                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                                  </svg>
                                  Sin grupo
                                </span>
                              )}
                              {integrante.grupo && (
                                <span className="inline-block bg-[#CBCBCB] text-white text-[10px] font-bold px-2 py-0.5 rounded">{integrante.porcentaje}%</span>
                              )}
                            </div>
                          )}
                          
                          {/* Role badges with their groups - show role title FIRST if grupo is in that role */}
                          {integrante.responsabilidad ? (
                            <div className="flex flex-col gap-1 mt-1">
                              {/* Supervisor + groups */}
                              {integrante.responsabilidad.supervisor && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <span className="inline-block w-fit bg-[#FF9800] text-white text-[10px] font-medium px-2 py-0.5 rounded">Supervisor</span>
                                    {grupoInSupervisor && (
                                      <span className="inline-block bg-[#CBCBCB] text-white text-[10px] font-bold px-2 py-0.5 rounded">{integrante.porcentaje}%</span>
                                    )}
                                  </div>
                                  {integrante.responsabilidad.supervisorGrupos?.filter(g => {
                                    if (displayedGrupos.has(g)) return false;
                                    displayedGrupos.add(g);
                                    return true;
                                  }).map((grupo, idx) => (
                                    <span key={`sup-${idx}`} className="inline-flex items-center gap-1 w-fit bg-[#72E6EA] text-black text-[10px] font-medium px-2 py-0.5 rounded underline ml-2">
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                      </svg>
                                      {grupo}
                                    </span>
                                  ))}
                                </>
                              )}
                              {/* Responsable + groups */}
                              {integrante.responsabilidad.responsable && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <span className="inline-block w-fit bg-[#CBCBCB] text-white text-[10px] font-medium px-2 py-0.5 rounded">Responsable</span>
                                    {grupoInResponsable && !grupoInSupervisor && (
                                      <span className="inline-block bg-[#CBCBCB] text-white text-[10px] font-bold px-2 py-0.5 rounded">{integrante.porcentaje}%</span>
                                    )}
                                  </div>
                                  {integrante.responsabilidad.responsableGrupos?.filter(g => {
                                    if (displayedGrupos.has(g)) return false;
                                    displayedGrupos.add(g);
                                    return true;
                                  }).map((grupo, idx) => (
                                    <span key={`res-${idx}`} className="inline-flex items-center gap-1 w-fit bg-[#72E6EA] text-black text-[10px] font-medium px-2 py-0.5 rounded underline ml-2">
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                      </svg>
                                      {grupo}
                                    </span>
                                  ))}
                                </>
                              )}
                              {/* Ayudante + groups */}
                              {integrante.responsabilidad.ayudante && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <span className="inline-block w-fit bg-[#9E9E9E] text-white text-[10px] font-medium px-2 py-0.5 rounded">Ayudante</span>
                                    {grupoInAyudante && !grupoInSupervisor && !grupoInResponsable && (
                                      <span className="inline-block bg-[#CBCBCB] text-white text-[10px] font-bold px-2 py-0.5 rounded">{integrante.porcentaje}%</span>
                                    )}
                                  </div>
                                  {integrante.responsabilidad.ayudanteGrupos?.filter(g => {
                                    if (displayedGrupos.has(g)) return false;
                                    displayedGrupos.add(g);
                                    return true;
                                  }).map((grupo, idx) => (
                                    <span key={`ayu-${idx}`} className="inline-flex items-center gap-1 w-fit bg-[#72E6EA] text-black text-[10px] font-medium px-2 py-0.5 rounded underline ml-2">
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                      </svg>
                                      {grupo}
                                    </span>
                                  ))}
                                </>
                              )}
                            </div>
                          ) : integrante.rol && (
                            <div className="flex flex-col gap-1 mt-1">
                              {getRolBadge(integrante.rol)}
                            </div>
                          )}
                        </>
                      );
                    })()}
                    
                    {/* 3. Etiquetas - stacked vertically, filter out group name and nuevo creyente */}
                    {integrante.etiquetas.filter(e => e !== integrante.grupo && e.toLowerCase() !== 'nuevo creyente').length > 0 && (
                      <div className="flex flex-col gap-1 mt-1">
                        {integrante.etiquetas.filter(e => e !== integrante.grupo && e.toLowerCase() !== 'nuevo creyente').map((etiqueta, idx) => (
                          <span 
                            key={idx} 
                            className={`inline-flex items-center gap-1 w-fit text-[10px] font-medium px-2 py-0.5 rounded ${getEtiquetaColor(etiqueta)}`}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                              <circle cx="9" cy="7" r="4"/>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            {etiqueta}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  </Link>
                  {/* Separator with padding */}
                  {index < visibleIntegrantes.length - 1 && (
                    <div className="px-[10px]">
                      <div className="border-b border-[#E0E0E0]"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Ver más - only show if there are more items to load */}
          {hasMoreToShow && (
            <div className="text-center py-4 border-t border-[#E0E0E0]">
              <button 
                onClick={loadMore}
                className="text-[#4CAF50] text-[14px] font-medium"
              >
                VER MÁS
              </button>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer Button */}
      <footer className="w-full bg-white px-5 py-5 mt-6">
        <div className="max-w-2xl mx-auto">
          <Link 
            to="/dashboard/nuevo-integrante"
            className="block w-full bg-[#4CAF50] text-white text-[16px] font-medium py-4 px-6 rounded-full hover:bg-[#43A047] transition-colors text-center"
          >
            NUEVO INTEGRANTE
          </Link>
        </div>
      </footer>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            {/* Header */}
            <div className="sticky top-0 bg-white p-5 border-b border-[#E0E0E0] z-10 rounded-t-2xl">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[24px] font-bold text-[#333333]">Filtrar por</h2>
                <button onClick={() => setShowFilterModal(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <button onClick={clearFilters} className="text-[#4CAF50] text-[14px] font-medium">
                LIMPIAR FILTROS
              </button>
            </div>
            
            {/* Content */}
            <div className="p-5">
              {/* Miembros Toggle */}
              <Toggle 
                label="Miembros" 
                checked={tempFilters.miembros} 
                onChange={() => setTempFilters({...tempFilters, miembros: !tempFilters.miembros})}
              />
              
              {/* Responsabilidad */}
              <Dropdown
                label="Responsabilidad"
                id="responsabilidad"
                options={['Ayudante', 'Responsable', 'Supervisor']}
                selected={tempFilters.responsabilidad}
                onSelect={(value) => setTempFilters({
                  ...tempFilters, 
                  responsabilidad: toggleArrayFilter(tempFilters.responsabilidad, value)
                })}
                multiple
              />
              
              {/* Grupos de hogar */}
              <Dropdown
                label="Grupos de hogar"
                id="grupos"
                options={gruposOptions}
                selected={tempFilters.gruposDeHogar}
                onSelect={(value) => setTempFilters({
                  ...tempFilters, 
                  gruposDeHogar: toggleArrayFilter(tempFilters.gruposDeHogar, value)
                })}
                multiple
              />
              
              {/* Ministerios */}
              <Dropdown
                label="Ministerios"
                id="ministerios"
                options={ministeriosOptions}
                selected={tempFilters.ministerios}
                onSelect={(value) => setTempFilters({
                  ...tempFilters, 
                  ministerios: toggleArrayFilter(tempFilters.ministerios, value)
                })}
                multiple
              />
              
              {/* Responsable de Ministerio Toggle */}
              <Toggle 
                label="Responsable de Ministerio" 
                checked={tempFilters.responsableDeMinisterio} 
                onChange={() => setTempFilters({...tempFilters, responsableDeMinisterio: !tempFilters.responsableDeMinisterio})}
              />
              
              {/* Asistencia Section */}
              <div className="border-t border-[#E0E0E0] pt-4 mt-4">
                <h3 className="text-[16px] font-bold text-[#333333] mb-4">Asistencia</h3>
                <RangeSlider
                  label="Último MES"
                  min={0}
                  max={100}
                  value={tempFilters.asistencia.ultimoMes}
                  onChange={(value) => setTempFilters({
                    ...tempFilters,
                    asistencia: { ...tempFilters.asistencia, ultimoMes: value }
                  })}
                />
                <RangeSlider
                  label="Último AÑO"
                  min={0}
                  max={100}
                  value={tempFilters.asistencia.ultimoAno}
                  onChange={(value) => setTempFilters({
                    ...tempFilters,
                    asistencia: { ...tempFilters.asistencia, ultimoAno: value }
                  })}
                />
                <RangeSlider
                  label="Desde SIEMPRE"
                  min={0}
                  max={100}
                  value={tempFilters.asistencia.desdeSiempre}
                  onChange={(value) => setTempFilters({
                    ...tempFilters,
                    asistencia: { ...tempFilters.asistencia, desdeSiempre: value }
                  })}
                />
              </div>
              
              {/* Formación Section */}
              <div className="border-t border-[#E0E0E0] pt-4 mt-4">
                <h3 className="text-[16px] font-bold text-[#333333] mb-4">Formación</h3>
                <Dropdown
                  label="Discipulado inicial"
                  id="discipulado"
                  options={formacionOptions}
                  selected={tempFilters.formacion.discipuladoInicial}
                  onSelect={(value) => setTempFilters({
                    ...tempFilters,
                    formacion: { ...tempFilters.formacion, discipuladoInicial: toggleArrayFilter(tempFilters.formacion.discipuladoInicial, value) }
                  })}
                  multiple
                />
                <Dropdown
                  label="Pre bautismos"
                  id="preBautismos"
                  options={formacionOptions}
                  selected={tempFilters.formacion.preBautismos}
                  onSelect={(value) => setTempFilters({
                    ...tempFilters,
                    formacion: { ...tempFilters.formacion, preBautismos: toggleArrayFilter(tempFilters.formacion.preBautismos, value) }
                  })}
                  multiple
                />
                <Dropdown
                  label="Escuela bíblica"
                  id="escuelaBiblica"
                  options={formacionOptions}
                  selected={tempFilters.formacion.escuelaBiblica}
                  onSelect={(value) => setTempFilters({
                    ...tempFilters,
                    formacion: { ...tempFilters.formacion, escuelaBiblica: toggleArrayFilter(tempFilters.formacion.escuelaBiblica, value) }
                  })}
                  multiple
                />
                <Dropdown
                  label="Escuela discipulado"
                  id="escuelaDiscipulado"
                  options={formacionOptions}
                  selected={tempFilters.formacion.escuelaDiscipulado}
                  onSelect={(value) => setTempFilters({
                    ...tempFilters,
                    formacion: { ...tempFilters.formacion, escuelaDiscipulado: toggleArrayFilter(tempFilters.formacion.escuelaDiscipulado, value) }
                  })}
                  multiple
                />
                <Dropdown
                  label="Entrenamiento"
                  id="entrenamiento"
                  options={formacionOptions}
                  selected={tempFilters.formacion.entrenamiento}
                  onSelect={(value) => setTempFilters({
                    ...tempFilters,
                    formacion: { ...tempFilters.formacion, entrenamiento: toggleArrayFilter(tempFilters.formacion.entrenamiento, value) }
                  })}
                  multiple
                />
              </div>
              
              {/* Fe Section */}
              <div className="border-t border-[#E0E0E0] pt-4 mt-4">
                <h3 className="text-[16px] font-bold text-[#333333] mb-4">Fe</h3>
                <Toggle 
                  label="Nuevo creyente" 
                  checked={tempFilters.fe.nuevoCreyente} 
                  onChange={() => setTempFilters({
                    ...tempFilters,
                    fe: { ...tempFilters.fe, nuevoCreyente: !tempFilters.fe.nuevoCreyente }
                  })}
                />
                <Toggle 
                  label="Nuevo bautizado" 
                  checked={tempFilters.fe.nuevoBautizado} 
                  onChange={() => setTempFilters({
                    ...tempFilters,
                    fe: { ...tempFilters.fe, nuevoBautizado: !tempFilters.fe.nuevoBautizado }
                  })}
                />
                <Toggle 
                  label="Bautizado" 
                  checked={tempFilters.fe.bautizado} 
                  onChange={() => setTempFilters({
                    ...tempFilters,
                    fe: { ...tempFilters.fe, bautizado: !tempFilters.fe.bautizado }
                  })}
                />
                <Toggle 
                  label="Procedente de otra iglesia" 
                  checked={tempFilters.fe.procedenteDeOtraIglesia} 
                  onChange={() => setTempFilters({
                    ...tempFilters,
                    fe: { ...tempFilters.fe, procedenteDeOtraIglesia: !tempFilters.fe.procedenteDeOtraIglesia }
                  })}
                />
              </div>
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 bg-white p-5 border-t border-[#E0E0E0] z-10 rounded-b-2xl">
              <button 
                onClick={applyFilters}
                className="w-full bg-[#4CAF50] text-white text-[16px] font-medium py-3 px-6 rounded-full mb-3"
              >
                FILTRAR
              </button>
              <button 
                onClick={() => setShowFilterModal(false)}
                className="w-full text-[#F21D61] text-[14px] font-medium underline"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            {/* Header */}
            <div className="p-5 border-b border-[#E0E0E0]">
              <div className="flex items-center justify-between">
                <h2 className="text-[24px] font-bold text-[#333333]">Ordenar por</h2>
                <button onClick={() => setShowOrderModal(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-5">
              <Dropdown
                label="Ordenar por"
                id="orderField"
                options={['Nombre', 'Grupo de hogar', 'Responsabilidad', 'Número de miembro']}
                selected={tempOrderBy.field}
                onSelect={(value) => setTempOrderBy({ ...tempOrderBy, field: value })}
              />
              <Dropdown
                label="Tipo de orden"
                id="orderDirection"
                options={['Ascendente', 'Descendente']}
                selected={tempOrderBy.direction === 'asc' ? 'Ascendente' : 'Descendente'}
                onSelect={(value) => setTempOrderBy({ 
                  ...tempOrderBy, 
                  direction: value === 'Ascendente' ? 'asc' : 'desc' 
                })}
              />
            </div>
            
            {/* Footer */}
            <div className="p-5 border-t border-[#E0E0E0]">
              <button 
                onClick={applyOrder}
                className="w-full bg-[#4CAF50] text-white text-[16px] font-medium py-3 px-6 rounded-full mb-3"
              >
                GUARDAR
              </button>
              <button 
                onClick={() => setShowOrderModal(false)}
                className="w-full text-[#4CAF50] text-[14px] font-medium"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
