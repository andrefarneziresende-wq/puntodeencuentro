import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '../../components/layout';
import { api } from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';

interface HighlightedTestimony {
  id: string;
  title: string;
  content: string;
  groupName: string;
  createdAt: string;
}

interface DashboardStats {
  gruposDeHogar: {
    total: number;
    integrantes: { total: number; porGrupo: number; sinGrupo: number; sinGrupoPorcentaje: number };
    miembros: { total: number; porGrupo: number; sinGrupo: number; sinGrupoPorcentaje: number };
    enMinisterio: { integrantes: number; miembros: number };
    liderazgo: { supervisores: number; supervisoresPorGrupo: number; responsables: number; ayudantes: number };
  };
  fe: {
    visitantes: { total: number; porGrupo: number };
    nuevosCreyentes: { total: number; porGrupo: number };
    nuevosBautizados: { total: number; porGrupo: number };
    procedentesOtraIglesia: { total: number; porGrupo: number };
  };
  reunionesStats: {
    tipos: { periodicas: number; comunion: number; evangelisticas: number };
    frecuencia: { semanal: number; quincenal: number; mensual: number };
  };
  asistencia: {
    ultimoMes: number;
    ultimoAno: number;
    desdeSiempre: number;
    historico: Array<{
      fecha: string;
      integrantes: number;
      visitantes: number;
      total: number;
      mediaIntegrantes: number;
      mediaVisitantes: number;
      mediaTotal: number;
    }>;
  };
  formacion: {
    discipuladoInicial: { terminado: { total: number; porcentaje: number }; iniciado: { total: number; porcentaje: number }; noIniciado: { total: number; porcentaje: number } };
    preBautismo: { terminado: { total: number; porcentaje: number }; iniciado: { total: number; porcentaje: number }; noIniciado: { total: number; porcentaje: number } };
    escuelaBiblica: { terminado: { total: number; porcentaje: number }; iniciado: { total: number; porcentaje: number }; noIniciado: { total: number; porcentaje: number } };
    escuelaDiscipulado: { terminado: { total: number; porcentaje: number }; iniciado: { total: number; porcentaje: number }; noIniciado: { total: number; porcentaje: number } };
    entrenamiento: { terminado: { total: number; porcentaje: number }; iniciado: { total: number; porcentaje: number }; noIniciado: { total: number; porcentaje: number } };
  };
  oracion: {
    motivosDeOracion: number;
    oracionesContestadas: number;
  };
}

export function HomePage() {
  const [highlightedTestimonies, setHighlightedTestimonies] = useState<HighlightedTestimony[]>([]);
  const [loadingTestimonies, setLoadingTestimonies] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    loadHighlightedTestimonies();
    loadDashboardStats();
  }, []);

  const loadHighlightedTestimonies = async () => {
    setLoadingTestimonies(true);
    const result = await api.getHighlightedTestimonies();
    if (result.data) {
      setHighlightedTestimonies(result.data.testimonies.slice(0, 2));
    }
    setLoadingTestimonies(false);
  };

  const loadDashboardStats = async () => {
    const result = await api.getDashboardStats();
    if (result.data?.stats) {
      setStats(result.data.stats);
    }
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <AppHeader />

      {/* Hero Section with Background Image */}
      <div 
        className="relative w-full bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(/home-bg.png)',
          height: '220px'
        }}
      >
        {/* Dark Overlay for contrast */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Welcome Text */}
        <div className="relative z-10 flex flex-col justify-center h-full px-5">
          <h1 
            className="text-white"
            style={{ 
              fontFamily: 'Roboto, sans-serif', 
              fontWeight: 700, 
              fontSize: '32px',
              lineHeight: '110%'
            }}
          >
            Bienvenido
          </h1>
          <p 
            className="text-white"
            style={{ 
              fontFamily: 'Roboto, sans-serif', 
              fontWeight: 700, 
              fontSize: '32px',
              lineHeight: '110%'
            }}
          >
            a la gestión y seguimiento de
          </p>
          <p 
            className="text-white mt-1"
            style={{ 
              fontFamily: 'Roboto, sans-serif', 
              fontWeight: 700, 
              fontSize: '32px',
              lineHeight: '110%'
            }}
          >
            grupos de hogar
          </p>
        </div>
      </div>

      <main className="px-5 py-5 max-w-2xl mx-auto">
        
        {/* Testimonios Destacados */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h2 
              className="text-[24px] text-[#333333]"
              style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}
            >
              Testimonios destacados
            </h2>
            {/* Bookmark Icon */}
            <svg width="12" height="15" viewBox="0 0 16 20" fill="#333333">
              <path d="M0 0h16v20l-8-5-8 5V0z"/>
            </svg>
          </div>

          {loadingTestimonies ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4CAF50]"></div>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
              {highlightedTestimonies.map((testimony) => (
                <Link
                  key={testimony.id}
                  to={`/dashboard/testimonio/${testimony.id}`}
                  className="flex-shrink-0 w-[280px] bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow"
                >
                  {/* Date */}
                  <p className="text-[12px] text-[#9E9E9E] mb-2">
                    {new Date(testimony.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                  
                  {/* Title */}
                  <h3 className="text-[18px] font-bold text-[#333333] mb-3 leading-tight">
                    {testimony.title}
                  </h3>
                  
                  {/* Group Badge */}
                  <div className="inline-flex items-center gap-1.5 bg-[#72E6EA] text-black text-[12px] font-medium px-3 py-1.5 rounded-lg mb-3 underline">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    {testimony.groupName}
                  </div>
                  
                  {/* Content */}
                  <p className="text-[14px] text-[#757575] leading-relaxed mb-1">
                    {truncateText(testimony.content, 200)}
                  </p>
                  
                  {/* Ellipsis */}
                  <p className="text-[14px] text-[#757575] mb-3">...</p>
                  
                  {/* Read More */}
                  <span className="text-[#4CAF50] text-[14px] font-bold uppercase">
                    LEER TODO
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Grupos de Hogar */}
        <section className="mb-6">
          <Link to="/dashboard/grupos" className="block bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow">
            {/* Title */}
            <h2 
              className="text-[24px] text-[#333333] mb-2"
              style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}
            >
              Grupos de Hogar
            </h2>
            
            {/* Number */}
            <p className="text-[48px] font-bold text-[#333333] leading-none mb-3">2</p>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#72E6EA] text-black text-[13px] font-medium px-3 py-1.5 rounded-lg mb-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Grupos de Hogar
            </div>
            
            {/* Divider Line */}
            <div className="h-[1px] bg-[#555555] mb-4"></div>
            
            {/* Stats Grid - Integrantes / Miembros */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Integrantes */}
              <div>
                <p className="text-[40px] font-bold text-[#333333] leading-none">323</p>
                <p className="text-[12px] text-[#9E9E9E] mb-2">7 en cada grupo</p>
                <div className="inline-flex items-center gap-1.5 bg-[#4CAF50] text-white text-[11px] font-medium px-2.5 py-1 rounded-lg mb-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2"/>
                  </svg>
                  Integrantes
                </div>
                <div className="flex items-center gap-2 bg-[#F21D61] rounded-lg px-3 py-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <span className="text-white text-[10px] leading-tight">Sin<br/>grupo</span>
                  <div className="flex flex-col items-center text-center ml-auto">
                    <span className="text-white text-[18px] font-bold leading-none">183</span>
                    <span className="text-white text-[11px]">72%</span>
                  </div>
                </div>
              </div>
              
              {/* Miembros */}
              <div>
                <p className="text-[40px] font-bold text-[#333333] leading-none">298</p>
                <p className="text-[12px] text-[#9E9E9E] mb-2">6,5 en cada grupo</p>
                <div className="inline-flex items-center gap-1.5 bg-[#4CAF50] text-white text-[11px] font-medium px-2.5 py-1 rounded-lg mb-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2"/>
                  </svg>
                  Miembros
                </div>
                <div className="flex items-center gap-2 bg-[#F21D61] rounded-lg px-3 py-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <span className="text-white text-[10px] leading-tight">Sin<br/>grupo</span>
                  <div className="flex flex-col items-center text-center ml-auto">
                    <span className="text-white text-[18px] font-bold leading-none">183</span>
                    <span className="text-white text-[11px]">72%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Divider Line */}
            <div className="h-[1px] bg-[#555555] my-4"></div>
            
            {/* En ministerio */}
            <div className="mb-4">
              <p className="text-[14px] font-semibold text-[#333333] mb-3">En ministerio</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">86</p>
                  <div className="inline-flex items-center gap-1.5 bg-[#4CAF50] text-white text-[11px] font-medium px-2.5 py-1 rounded-lg mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="7" r="4"/>
                      <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2"/>
                    </svg>
                    Integrantes
                  </div>
                </div>
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">86</p>
                  <div className="inline-flex items-center gap-1.5 bg-[#4CAF50] text-white text-[11px] font-medium px-2.5 py-1 rounded-lg mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="7" r="4"/>
                      <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2"/>
                    </svg>
                    Miembros
                  </div>
                </div>
              </div>
            </div>
            
            {/* Divider Line */}
            <div className="h-[1px] bg-[#555555] my-4"></div>
            
            {/* Bottom Stats - Supervisor, Responsable, Ayudante */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-[32px] font-bold text-[#333333] leading-none">9</p>
                <div className="inline-block bg-[#F5F5F5] text-[#333333] text-[10px] font-medium px-2 py-1 rounded-lg mt-1">
                  Supervisor
                </div>
                <span className="block bg-[#F2F2F2] text-[#9E9E9E] text-[8px] px-1.5 py-0.5 rounded-lg mt-1">1 cada 5,1 grupos</span>
              </div>
              <div>
                <p className="text-[32px] font-bold text-[#333333] leading-none">51</p>
                <div className="inline-block bg-[#F5F5F5] text-[#333333] text-[10px] font-medium px-2 py-1 rounded-lg mt-1">
                  Responsable
                </div>
              </div>
              <div>
                <p className="text-[32px] font-bold text-[#333333] leading-none">33</p>
                <div className="inline-block bg-[#F5F5F5] text-[#333333] text-[10px] font-medium px-2 py-1 rounded-lg mt-1">
                  Ayudante
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Fe */}
        <section className="mb-6">
          <div className="bg-white rounded-2xl shadow-md p-5">
            {/* Title */}
            <h2 
              className="text-[24px] text-[#333333] mb-4"
              style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}
            >
              Fe
            </h2>
            
            {/* Visitantes */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-[40px] font-bold text-[#333333] leading-none">{stats?.fe?.visitantes?.total || 0}</p>
                <span className="bg-[#F2F2F2] text-[#9E9E9E] text-[12px] px-2 py-0.5 rounded-lg relative -top-1">{stats?.fe?.visitantes?.porGrupo || 0} en cada grupo</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-[#E0E0E0] text-[#333333] text-[12px] font-medium px-3 py-1.5 rounded-lg">
                <img src="/icon-visitor.png" alt="" width="14" height="14" />
                Visitantes
              </div>
            </div>
            
            {/* Divider */}
            <div className="h-[1px] bg-[#E0E0E0] my-4"></div>
            
            {/* Nuevos creyentes */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-[40px] font-bold text-[#333333] leading-none">{stats?.fe?.nuevosCreyentes?.total || 0}</p>
                <span className="bg-[#F2F2F2] text-[#9E9E9E] text-[12px] px-2 py-0.5 rounded-lg relative -top-1">{stats?.fe?.nuevosCreyentes?.porGrupo || 0} en cada grupo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 bg-[#D4E157] text-[#333333] text-[12px] font-medium px-3 py-1.5 rounded-lg">
                  <img src="/icon-believer.png" alt="" width="14" height="14" />
                  Nuevos creyentes
                </div>
                <div className="w-5 h-5 rounded-full border border-[#45C1EE] flex items-center justify-center">
                  <span className="text-[10px] text-[#45C1EE]">i</span>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="h-[1px] bg-[#E0E0E0] my-4"></div>
            
            {/* Nuevos bautizados */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-[40px] font-bold text-[#333333] leading-none">{stats?.fe?.nuevosBautizados?.total || 0}</p>
                <span className="bg-[#F2F2F2] text-[#9E9E9E] text-[12px] px-2 py-0.5 rounded-lg relative -top-1">{stats?.fe?.nuevosBautizados?.porGrupo || 0} en cada grupo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 bg-[#C8EDFA] text-[#333333] text-[12px] font-medium px-3 py-1.5 rounded-lg">
                  <img src="/icon-baptized.png" alt="" width="14" height="14" />
                  Nuevos bautizados
                </div>
                <div className="w-5 h-5 rounded-full border border-[#45C1EE] flex items-center justify-center">
                  <span className="text-[10px] text-[#45C1EE]">i</span>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="h-[1px] bg-[#E0E0E0] my-4"></div>
            
            {/* Procedentes de otra iglesia */}
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-[40px] font-bold text-[#333333] leading-none">{stats?.fe?.procedentesOtraIglesia?.total || 0}</p>
                <span className="bg-[#F2F2F2] text-[#9E9E9E] text-[12px] px-2 py-0.5 rounded-lg relative -top-1">{stats?.fe?.procedentesOtraIglesia?.porGrupo || 0} en cada grupo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 bg-[#F5F5F5] text-[#333333] text-[12px] font-medium px-3 py-1.5 rounded-lg">
                  <img src="/icon-church.png" alt="" width="14" height="14" />
                  Procedentes de otra iglesia
                </div>
                <div className="w-5 h-5 rounded-full border border-[#45C1EE] flex items-center justify-center">
                  <span className="text-[10px] text-[#45C1EE]">i</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reuniones */}
        <section className="mb-6">
          <div className="bg-white rounded-2xl shadow-md p-5">
            {/* Title */}
            <h2 
              className="text-[24px] text-[#333333] mb-4"
              style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}
            >
              Reuniones
            </h2>
            
            {/* First Row - Percentages with badges */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-[32px] font-bold text-[#333333] leading-none mb-2">{stats?.reunionesStats?.tipos?.periodicas || 0}%</p>
                <div className="inline-block bg-[#72E6EA] text-black text-[11px] font-medium px-2.5 py-1 rounded-lg">
                  Periódicas
                </div>
              </div>
              <div>
                <p className="text-[32px] font-bold text-[#333333] leading-none mb-2">{stats?.reunionesStats?.tipos?.comunion || 0}%</p>
                <div className="inline-block bg-[#72E6EA] text-black text-[11px] font-medium px-2.5 py-1 rounded-lg">
                  Comunión
                </div>
              </div>
              <div>
                <p className="text-[32px] font-bold text-[#333333] leading-none mb-2">{stats?.reunionesStats?.tipos?.evangelisticas || 0}%</p>
                <div className="inline-block bg-[#72E6EA] text-black text-[11px] font-medium px-2.5 py-1 rounded-lg">
                  Evangelísticas
                </div>
              </div>
            </div>
            
            {/* Second Row - Frequencies */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[32px] font-bold text-[#333333] leading-none mb-1">{stats?.reunionesStats?.frecuencia?.semanal || 0}%</p>
                <div className="flex items-center gap-1.5 text-[#9E9E9E] text-[12px]">
                  <img src="/icon-schedule.png" alt="" width="14" height="14" />
                  Semanal
                </div>
              </div>
              <div>
                <p className="text-[32px] font-bold text-[#333333] leading-none mb-1">{stats?.reunionesStats?.frecuencia?.quincenal || 0}%</p>
                <div className="flex items-center gap-1.5 text-[#9E9E9E] text-[12px]">
                  <img src="/icon-schedule.png" alt="" width="14" height="14" />
                  Quincenal
                </div>
              </div>
              <div>
                <p className="text-[32px] font-bold text-[#333333] leading-none mb-1">{stats?.reunionesStats?.frecuencia?.mensual || 0}%</p>
                <div className="flex items-center gap-1.5 text-[#9E9E9E] text-[12px]">
                  <img src="/icon-schedule.png" alt="" width="14" height="14" />
                  Mensual
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Localización */}
        <section className="mb-6">
          <div className="bg-white rounded-2xl shadow-md p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 
                className="text-[24px] text-[#333333]"
                style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}
              >
                Localización
              </h2>
            </div>
            
            {/* Tabs */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[14px] font-medium text-[#333333]">Grupos de Hogar</span>
              <span className="text-[14px] font-medium text-[#4CAF50]">→ INTEGRANTES</span>
            </div>
            
            {/* Map */}
            <div className="rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d99089.57696587789!2d-0.4545851!3d39.4699075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd604f4cf0efb06f%3A0xb4a351011f7f1d39!2sValencia%2C%20Spain!5e0!3m2!1sen!2s!4v1706000000000!5m2!1sen!2s"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de Localización"
              ></iframe>
            </div>
          </div>
        </section>

        {/* Asistencia */}
        <section className="mb-6">
          <div className="bg-white rounded-2xl shadow-md p-5">
            {/* Title */}
            <h2 
              className="text-[24px] text-[#333333] mb-5"
              style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}
            >
              Asistencia
            </h2>
            
            {/* Progress Bars */}
            <div className="space-y-5 mb-6">
              {/* Último MES */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block bg-[#F5F5F5] text-[#333333] text-[13px] font-bold px-3 py-1 rounded">
                    Último MES
                  </span>
                  <span className="text-[28px] font-bold text-[#333333]">{stats?.asistencia?.ultimoMes || 53} %</span>
                </div>
                <div className="h-3 bg-[#E0E0E0] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#4CAF50] rounded-full transition-all duration-500"
                    style={{ width: `${stats?.asistencia?.ultimoMes || 53}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Último AÑO */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block bg-[#F5F5F5] text-[#333333] text-[13px] font-bold px-3 py-1 rounded">
                    Último AÑO
                  </span>
                  <span className="text-[28px] font-bold text-[#333333]">{stats?.asistencia?.ultimoAno || 75} %</span>
                </div>
                <div className="h-3 bg-[#E0E0E0] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#4CAF50] rounded-full transition-all duration-500"
                    style={{ width: `${stats?.asistencia?.ultimoAno || 75}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Desde SIEMPRE */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block bg-[#F5F5F5] text-[#333333] text-[13px] font-bold px-3 py-1 rounded">
                    Desde SIEMPRE
                  </span>
                  <span className="text-[28px] font-bold text-[#333333]">{stats?.asistencia?.desdeSiempre || 85} %</span>
                </div>
                <div className="h-3 bg-[#E0E0E0] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#4CAF50] rounded-full transition-all duration-500"
                    style={{ width: `${stats?.asistencia?.desdeSiempre || 85}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Chart */}
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={stats?.asistencia?.historico || [
                    { fecha: '01/10', integrantes: 270, visitantes: 55, total: 270, mediaIntegrantes: 280, mediaVisitantes: 30, mediaTotal: 310 },
                    { fecha: '08/10', integrantes: 275, visitantes: 60, total: 275, mediaIntegrantes: 280, mediaVisitantes: 30, mediaTotal: 310 },
                    { fecha: '15/10', integrantes: 265, visitantes: 50, total: 265, mediaIntegrantes: 280, mediaVisitantes: 30, mediaTotal: 310 },
                    { fecha: '22/10', integrantes: 293, visitantes: 45, total: 338, mediaIntegrantes: 280, mediaVisitantes: 30, mediaTotal: 310 },
                    { fecha: '29/10', integrantes: 300, visitantes: 55, total: 320, mediaIntegrantes: 280, mediaVisitantes: 30, mediaTotal: 310 },
                    { fecha: '05/11', integrantes: 310, visitantes: 60, total: 330, mediaIntegrantes: 280, mediaVisitantes: 30, mediaTotal: 310 },
                    { fecha: '12/11', integrantes: 295, visitantes: 120, total: 320, mediaIntegrantes: 280, mediaVisitantes: 30, mediaTotal: 310 },
                  ]}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis 
                    dataKey="fecha" 
                    tick={{ fontSize: 10, fill: '#9E9E9E' }}
                    axisLine={{ stroke: '#E0E0E0' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#9E9E9E' }}
                    axisLine={{ stroke: '#E0E0E0' }}
                    tickLine={false}
                    domain={[0, 360]}
                    ticks={[0, 60, 120, 180, 240, 300, 360]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="integrantes" 
                    fill="rgba(76, 175, 80, 0.3)" 
                    stroke="#4CAF50" 
                    strokeWidth={2}
                    name="Integrantes"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#C5E1A5" 
                    strokeWidth={2}
                    dot={{ fill: '#C5E1A5', strokeWidth: 0, r: 3 }}
                    name="Total"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visitantes" 
                    stroke="#2196F3" 
                    strokeWidth={2}
                    dot={{ fill: '#2196F3', strokeWidth: 0, r: 3 }}
                    name="Visitantes"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mediaIntegrantes" 
                    stroke="#4CAF50" 
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Media Integrantes"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mediaVisitantes" 
                    stroke="#2196F3" 
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Media Visitantes"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mediaTotal" 
                    stroke="#333333" 
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Media Total"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#4CAF50]"></span>
                <span className="text-[#666666]">Integrantes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#2196F3]"></span>
                <span className="text-[#666666]">Visitantes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#C5E1A5]"></span>
                <span className="text-[#666666]">Total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#4CAF50] border-2 border-dashed border-[#4CAF50]"></span>
                <span className="text-[#666666]">Media Integrantes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#2196F3] border-2 border-dashed border-[#2196F3]"></span>
                <span className="text-[#666666]">Media Visitantes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#333333]"></span>
                <span className="text-[#666666]">Media Total</span>
              </div>
            </div>
          </div>
        </section>

        {/* Formación */}
        <section className="mb-6">
          <div className="bg-white rounded-2xl shadow-md p-5">
            {/* Title */}
            <h2 
              className="text-[24px] text-[#333333] mb-5"
              style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}
            >
              Formación
            </h2>
            
            {/* Discipulado inicial */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                </svg>
                <span className="text-[14px] font-medium text-[#333333]">Discipulado inicial</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">
                    {stats?.formacion?.discipuladoInicial?.terminado?.total || 183}
                    <span className="text-[12px] font-normal text-[#9E9E9E] ml-1">{stats?.formacion?.discipuladoInicial?.terminado?.porcentaje || 72}%</span>
                  </p>
                  <span className="inline-block bg-[#4CAF50] text-white text-[10px] font-medium px-2.5 py-1 rounded-lg mt-1">Terminado</span>
                </div>
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">
                    {stats?.formacion?.discipuladoInicial?.iniciado?.total || 42}
                    <span className="text-[12px] font-normal text-[#9E9E9E] ml-1">{stats?.formacion?.discipuladoInicial?.iniciado?.porcentaje || 22}%</span>
                  </p>
                  <span className="inline-block bg-[#C6DE41] text-[#333333] text-[10px] font-medium px-2.5 py-1 rounded-lg mt-1">Iniciado</span>
                </div>
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">
                    {stats?.formacion?.discipuladoInicial?.noIniciado?.total || 21}
                    <span className="text-[12px] font-normal text-[#9E9E9E] ml-1">{stats?.formacion?.discipuladoInicial?.noIniciado?.porcentaje || 6}%</span>
                  </p>
                  <span className="inline-block bg-[#F44336] text-white text-[10px] font-medium px-2.5 py-1 rounded-lg mt-1">No iniciado</span>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="h-[1px] bg-[#E0E0E0] mb-5"></div>
            
            {/* Pre bautismo */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                </svg>
                <span className="text-[14px] font-medium text-[#333333]">Pre bautismo</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">
                    {stats?.formacion?.preBautismo?.terminado?.total || 183}
                    <span className="text-[12px] font-normal text-[#9E9E9E] ml-1">{stats?.formacion?.preBautismo?.terminado?.porcentaje || 72}%</span>
                  </p>
                  <span className="inline-block bg-[#4CAF50] text-white text-[10px] font-medium px-2.5 py-1 rounded-lg mt-1">Terminado</span>
                </div>
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">
                    {stats?.formacion?.preBautismo?.iniciado?.total || 42}
                    <span className="text-[12px] font-normal text-[#9E9E9E] ml-1">{stats?.formacion?.preBautismo?.iniciado?.porcentaje || 22}%</span>
                  </p>
                  <span className="inline-block bg-[#C6DE41] text-[#333333] text-[10px] font-medium px-2.5 py-1 rounded-lg mt-1">Iniciado</span>
                </div>
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">
                    {stats?.formacion?.preBautismo?.noIniciado?.total || 21}
                    <span className="text-[12px] font-normal text-[#9E9E9E] ml-1">{stats?.formacion?.preBautismo?.noIniciado?.porcentaje || 6}%</span>
                  </p>
                  <span className="inline-block bg-[#F44336] text-white text-[10px] font-medium px-2.5 py-1 rounded-lg mt-1">No iniciado</span>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="h-[1px] bg-[#E0E0E0] mb-5"></div>
            
            {/* Escuela bíblica */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                </svg>
                <span className="text-[14px] font-medium text-[#333333]">Escuela bíblica</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">
                    {stats?.formacion?.escuelaBiblica?.terminado?.total || 183}
                    <span className="text-[12px] font-normal text-[#9E9E9E] ml-1">{stats?.formacion?.escuelaBiblica?.terminado?.porcentaje || 72}%</span>
                  </p>
                  <span className="inline-block bg-[#4CAF50] text-white text-[10px] font-medium px-2.5 py-1 rounded-lg mt-1">Terminado</span>
                </div>
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">
                    {stats?.formacion?.escuelaBiblica?.iniciado?.total || 21}
                    <span className="text-[12px] font-normal text-[#9E9E9E] ml-1">{stats?.formacion?.escuelaBiblica?.iniciado?.porcentaje || 6}%</span>
                  </p>
                  <span className="inline-block bg-[#C6DE41] text-[#333333] text-[10px] font-medium px-2.5 py-1 rounded-lg mt-1">Iniciado</span>
                </div>
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">
                    {stats?.formacion?.escuelaBiblica?.noIniciado?.total || 42}
                    <span className="text-[12px] font-normal text-[#9E9E9E] ml-1">{stats?.formacion?.escuelaBiblica?.noIniciado?.porcentaje || 22}%</span>
                  </p>
                  <span className="inline-block bg-[#F44336] text-white text-[10px] font-medium px-2.5 py-1 rounded-lg mt-1">No iniciado</span>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="h-[1px] bg-[#E0E0E0] mb-5"></div>
            
            {/* Escuela discipulado */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                </svg>
                <span className="text-[14px] font-medium text-[#333333]">Escuela discipulado</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">
                    {stats?.formacion?.escuelaDiscipulado?.terminado?.total || 21}
                    <span className="text-[12px] font-normal text-[#9E9E9E] ml-1">{stats?.formacion?.escuelaDiscipulado?.terminado?.porcentaje || 6}%</span>
                  </p>
                  <span className="inline-block bg-[#4CAF50] text-white text-[10px] font-medium px-2.5 py-1 rounded-lg mt-1">Terminado</span>
                </div>
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">
                    {stats?.formacion?.escuelaDiscipulado?.iniciado?.total || 183}
                    <span className="text-[12px] font-normal text-[#9E9E9E] ml-1">{stats?.formacion?.escuelaDiscipulado?.iniciado?.porcentaje || 72}%</span>
                  </p>
                  <span className="inline-block bg-[#C6DE41] text-[#333333] text-[10px] font-medium px-2.5 py-1 rounded-lg mt-1">Iniciado</span>
                </div>
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">
                    {stats?.formacion?.escuelaDiscipulado?.noIniciado?.total || 42}
                    <span className="text-[12px] font-normal text-[#9E9E9E] ml-1">{stats?.formacion?.escuelaDiscipulado?.noIniciado?.porcentaje || 22}%</span>
                  </p>
                  <span className="inline-block bg-[#F44336] text-white text-[10px] font-medium px-2.5 py-1 rounded-lg mt-1">No iniciado</span>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="h-[1px] bg-[#E0E0E0] mb-5"></div>
            
            {/* Entrenamiento */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                </svg>
                <span className="text-[14px] font-medium text-[#333333]">Entrenamiento</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">
                    {stats?.formacion?.entrenamiento?.terminado?.total || 21}
                    <span className="text-[12px] font-normal text-[#9E9E9E] ml-1">{stats?.formacion?.entrenamiento?.terminado?.porcentaje || 6}%</span>
                  </p>
                  <span className="inline-block bg-[#4CAF50] text-white text-[10px] font-medium px-2.5 py-1 rounded-lg mt-1">Terminado</span>
                </div>
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">
                    {stats?.formacion?.entrenamiento?.iniciado?.total || 183}
                    <span className="text-[12px] font-normal text-[#9E9E9E] ml-1">{stats?.formacion?.entrenamiento?.iniciado?.porcentaje || 72}%</span>
                  </p>
                  <span className="inline-block bg-[#C6DE41] text-[#333333] text-[10px] font-medium px-2.5 py-1 rounded-lg mt-1">Iniciado</span>
                </div>
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">
                    {stats?.formacion?.entrenamiento?.noIniciado?.total || 42}
                    <span className="text-[12px] font-normal text-[#9E9E9E] ml-1">{stats?.formacion?.entrenamiento?.noIniciado?.porcentaje || 22}%</span>
                  </p>
                  <span className="inline-block bg-[#F44336] text-white text-[10px] font-medium px-2.5 py-1 rounded-lg mt-1">No iniciado</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Oración */}
        <section className="mb-6">
          <div className="bg-white rounded-2xl shadow-md p-5">
            {/* Title */}
            <h2 
              className="text-[24px] text-[#333333] mb-5"
              style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}
            >
              Oración
            </h2>
            
            {/* Motivos de Oración */}
            <div className="mb-4">
              <p className="text-[36px] font-bold text-[#333333] leading-none mb-1">
                {(stats?.oracion?.motivosDeOracion || 7084).toLocaleString('es-ES')}
              </p>
              <div className="flex items-center gap-2 text-[#666666] text-[14px]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
                <span>Motivos de Oración</span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="h-[1px] bg-[#E0E0E0] mb-4"></div>
            
            {/* Oraciones contestadas */}
            <div>
              <p className="text-[36px] font-bold text-[#333333] leading-none mb-1">
                {(stats?.oracion?.oracionesContestadas || 4359).toLocaleString('es-ES')}
              </p>
              <div className="flex items-center gap-2 text-[#666666] text-[14px]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
                <span>Oraciones contestadas</span>
              </div>
            </div>
          </div>
        </section>

        {/* Nueva Reunión Button */}
        <section className="mb-6">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <button className="w-full bg-[#4CAF50] text-white text-[16px] font-medium py-4 px-6 rounded-full hover:bg-[#43A047] transition-colors">
              NUEVA REUNIÓN
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
