import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '../../components/layout';
import { api } from '../../services/api';

interface HighlightedTestimony {
  id: string;
  title: string;
  content: string;
  groupName: string;
  createdAt: string;
}

export function HomePage() {
  const [highlightedTestimonies, setHighlightedTestimonies] = useState<HighlightedTestimony[]>([]);
  const [loadingTestimonies, setLoadingTestimonies] = useState(true);

  useEffect(() => {
    loadHighlightedTestimonies();
  }, []);

  const loadHighlightedTestimonies = async () => {
    setLoadingTestimonies(true);
    const result = await api.getHighlightedTestimonies();
    if (result.data) {
      setHighlightedTestimonies(result.data.testimonies.slice(0, 2));
    }
    setLoadingTestimonies(false);
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
        <div className="relative z-10 flex flex-col justify-center h-full px-4">
          <h1 
            className="text-white"
            style={{ 
              fontFamily: 'Roboto, sans-serif', 
              fontWeight: 700, 
              fontSize: '40px',
              lineHeight: '100%'
            }}
          >
            Bienvenido
          </h1>
          <p 
            className="text-white"
            style={{ 
              fontFamily: 'Roboto, sans-serif', 
              fontWeight: 700, 
              fontSize: '40px',
              lineHeight: '100%'
            }}
          >
            a la gestión y seguimiento de
          </p>
          <p 
            className="text-white mt-2"
            style={{ 
              fontFamily: 'Roboto, sans-serif', 
              fontWeight: 700, 
              fontSize: '40px',
              lineHeight: '100%'
            }}
          >
            grupos de hogar
          </p>
        </div>
      </div>

      <main className="px-4 py-5 max-w-2xl mx-auto">
        
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
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
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
                  <div className="inline-flex items-center gap-1.5 bg-[#72E6EA] text-white text-[12px] font-medium px-3 py-1.5 rounded-full mb-3">
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
            <div className="inline-flex items-center gap-1.5 bg-[#72E6EA] text-white text-[13px] font-medium px-3 py-1.5 rounded-full mb-4">
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
                <div className="inline-flex items-center gap-1.5 bg-[#4CAF50] text-white text-[11px] font-medium px-2.5 py-1 rounded-full mb-2">
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
                <div className="inline-flex items-center gap-1.5 bg-[#4CAF50] text-white text-[11px] font-medium px-2.5 py-1 rounded-full mb-2">
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
                  <div className="inline-flex items-center gap-1.5 bg-[#4CAF50] text-white text-[11px] font-medium px-2.5 py-1 rounded-full mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="7" r="4"/>
                      <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2"/>
                    </svg>
                    Integrantes
                  </div>
                </div>
                <div>
                  <p className="text-[28px] font-bold text-[#333333] leading-none">86</p>
                  <div className="inline-flex items-center gap-1.5 bg-[#4CAF50] text-white text-[11px] font-medium px-2.5 py-1 rounded-full mt-1">
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
                <div className="inline-block bg-[#F5F5F5] text-[#333333] text-[10px] font-medium px-2 py-1 rounded-full mt-1">
                  Supervisor
                </div>
                <p className="text-[10px] text-[#9E9E9E] mt-1">1 cada 5,1 grupos</p>
              </div>
              <div>
                <p className="text-[32px] font-bold text-[#333333] leading-none">51</p>
                <div className="inline-block bg-[#F5F5F5] text-[#333333] text-[10px] font-medium px-2 py-1 rounded-full mt-1">
                  Responsable
                </div>
              </div>
              <div>
                <p className="text-[32px] font-bold text-[#333333] leading-none">33</p>
                <div className="inline-block bg-[#F5F5F5] text-[#333333] text-[10px] font-medium px-2 py-1 rounded-full mt-1">
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
                <p className="text-[40px] font-bold text-[#333333] leading-none">67</p>
                <p className="text-[12px] text-[#9E9E9E]">1,5 en cada grupo</p>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-[#F5F5F5] text-[#333333] text-[12px] font-medium px-3 py-1.5 rounded-full">
                <img src="/icon-visitor.png" alt="" width="14" height="14" />
                Visitantes
              </div>
            </div>
            
            {/* Divider */}
            <div className="h-[1px] bg-[#E0E0E0] my-4"></div>
            
            {/* Nuevos creyentes */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-[40px] font-bold text-[#333333] leading-none">23</p>
                <p className="text-[12px] text-[#9E9E9E]">0,5 en cada grupo</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 bg-[#D4E157] text-[#333333] text-[12px] font-medium px-3 py-1.5 rounded-full">
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
                <p className="text-[40px] font-bold text-[#333333] leading-none">12</p>
                <p className="text-[12px] text-[#9E9E9E]">0,5 en cada grupo</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 bg-[#C8EDFA] text-[#333333] text-[12px] font-medium px-3 py-1.5 rounded-full">
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
                <p className="text-[40px] font-bold text-[#333333] leading-none">7</p>
                <p className="text-[12px] text-[#9E9E9E]">0,5 en cada grupo</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 bg-[#F5F5F5] text-[#333333] text-[12px] font-medium px-3 py-1.5 rounded-full">
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

      </main>
    </div>
  );
}
