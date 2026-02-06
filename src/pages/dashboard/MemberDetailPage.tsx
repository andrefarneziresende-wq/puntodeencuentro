import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppHeader } from '../../components/layout';
import { api } from '../../services/api';

interface MemberDetail {
  id: string;
  numero: number;
  nombre: string;
  foto: string | null;
  email: string;
  telefono: string;
  edad: number;
  fechaNacimiento: string;
  direccion: string;
  rol: 'responsable' | 'ayudante' | 'supervisor' | null;
  grupo: string | null;
  gruposSupervisa?: string[];
  esMiembro: boolean;
  nuevoCreyente: boolean;
  etiquetas: string[];
  porcentaje: number | null;
  asistencia: {
    ultimoMes: number;
    ultimoAno: number;
    desdeSiempre: number;
  };
  formacion: {
    discipuladoInicial: 'Terminado' | 'Iniciado' | 'No iniciado';
    preBautismos: 'Terminado' | 'Iniciado' | 'No iniciado';
    escuelaBiblica: 'Terminado' | 'Iniciado' | 'No iniciado';
    escuelaDiscipulado: 'Terminado' | 'Iniciado' | 'No iniciado';
    entrenamiento: 'Terminado' | 'Iniciado' | 'No iniciado';
  };
  bautizado: boolean;
  nuevoBautizado: boolean;
  iglesiaProcedente: string | null;
  ministerios: string[];
  observaciones: string;
  servicios: Array<{
    fecha: string;
    nombre: string;
    asistio: boolean;
  }>;
}

export function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showDarBajaModal, setShowDarBajaModal] = useState(false);
  const [showNoPuedeBajaModal, setShowNoPuedeBajaModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    loadMember();
  }, [id]);

  const loadMember = async () => {
    setLoading(true);
    try {
      const result = await api.getIntegrante(id || '');
      if (result.data?.integrante) {
        setMember(result.data.integrante as MemberDetail);
      }
    } catch (error) {
      console.error('Error loading member:', error);
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleWhatsApp = () => {
    if (member) {
      const phone = member.telefono.replace(/\s/g, '').replace('+', '');
      window.open(`https://wa.me/${phone}`, '_blank');
      setShowWhatsAppModal(false);
    }
  };

  const handleCall = () => {
    if (member) {
      window.location.href = `tel:${member.telefono}`;
      setShowCallModal(false);
    }
  };

  const handleDarBaja = () => {
    if (member?.rol === 'responsable' || member?.rol === 'supervisor') {
      setShowDarBajaModal(false);
      setShowNoPuedeBajaModal(true);
    } else {
      // Process dar de baja
      setShowDarBajaModal(false);
      navigate('/dashboard/integrantes');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Terminado':
        return <span className="bg-[#4CAF50] text-white text-[11px] px-3 py-1 rounded">Terminado</span>;
      case 'Iniciado':
        return <span className="bg-[#CDDC39] text-black text-[11px] px-3 py-1 rounded">Iniciado</span>;
      case 'No iniciado':
        return <span className="bg-[#F21D61] text-white text-[11px] px-3 py-1 rounded">No iniciado</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <AppHeader />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CAF50]"></div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <AppHeader />
        <div className="px-5 py-10 text-center">
          <p className="text-[#666]">Integrante no encontrado</p>
          <Link to="/dashboard/integrantes" className="text-[#4CAF50] mt-4 inline-block">
            Volver a Integrantes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <AppHeader />
      
      <main className="px-5 pt-3 pb-32 max-w-2xl mx-auto">
        {/* Back link and Member number */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/dashboard/integrantes" className="flex items-center gap-1 text-[#4CAF50] text-[14px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Miembros
          </Link>
          <div className="flex items-center gap-2">
            {!member.esMiembro && (
              <span className="bg-[#F21D61] text-white text-[11px] px-3 py-1 rounded">No es miembro</span>
            )}
            <span className="text-[#666] text-[14px]">Miembro: {member.numero}</span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
          {/* Contact Info */}
          <div className="flex items-start gap-4 mb-4">
            {/* Photo */}
            <div className="w-20 h-20 rounded-full bg-[#E0E0E0] overflow-hidden flex-shrink-0">
              {member.foto ? (
                <img src={member.foto} alt={member.nombre} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#9E9E9E]">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Contact Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13px] text-[#333] truncate">{member.email}</span>
                <button 
                  onClick={() => copyToClipboard(member.email, 'email')}
                  className="p-1"
                >
                  <img src="/icon-copy.png" alt="Copiar" width="20" height="20" />
                </button>
                {copiedField === 'email' && <span className="text-[10px] text-[#4CAF50]">Copiado</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-[#333]">{member.telefono}</span>
                <button onClick={() => setShowWhatsAppModal(true)} className="p-1">
                  <img src="/icon-whatsapp.png" alt="WhatsApp" width="20" height="20" />
                </button>
                <button onClick={() => setShowCallModal(true)} className="p-1">
                  <img src="/icon-phone.png" alt="Llamar" width="20" height="20" />
                </button>
                <button 
                  onClick={() => copyToClipboard(member.telefono, 'phone')}
                  className="p-1"
                >
                  <img src="/icon-copy.png" alt="Copiar" width="20" height="20" />
                </button>
              </div>
            </div>
          </div>

          {/* Name */}
          <h1 className="text-[28px] font-bold text-[#333] leading-tight mb-2">{member.nombre}</h1>
          
          {/* Age and Date */}
          <p className="text-[14px] text-[#333] mb-2">
            <span className="font-bold">{member.edad} años</span> <span className="ml-2">{member.fechaNacimiento}</span>
          </p>

          {/* Address */}
          <div className="flex items-start gap-1 mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" className="mt-0.5 flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-[13px] text-[#666]">{member.direccion}</span>
          </div>

          {/* Badges */}
          <div className="flex flex-col gap-2">
            {/* Role badge */}
            {member.rol && (
              <span className="inline-flex items-center gap-1 w-fit bg-[#CBCBCB] text-white text-[12px] font-medium px-3 py-1 rounded">
                {member.rol === 'responsable' && 'Responsable'}
                {member.rol === 'ayudante' && 'Ayudante'}
                {member.rol === 'supervisor' && 'Supervisor'}
              </span>
            )}

            {/* Nuevo creyente */}
            {member.nuevoCreyente && (
              <span className="inline-flex items-center gap-1 w-fit bg-[#FFEB3B] text-black text-[12px] font-medium px-3 py-1 rounded">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
                Nuevo creyente
                <button className="ml-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#45C1EE" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </button>
              </span>
            )}

            {/* Group badge */}
            {member.grupo ? (
              <span className="inline-flex items-center gap-1 w-fit bg-[#72E6EA] text-black text-[12px] font-medium px-3 py-1 rounded underline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {member.grupo}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 w-fit bg-[#F21D61] text-white text-[12px] font-medium px-3 py-1 rounded">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Sin grupo
              </span>
            )}

            {/* Grupos que supervisa */}
            {member.gruposSupervisa && member.gruposSupervisa.map((grupo, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 w-fit bg-[#72E6EA] text-black text-[12px] font-medium px-3 py-1 rounded underline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {grupo}
              </span>
            ))}

            {/* Etiquetas */}
            {member.etiquetas && member.etiquetas.length > 0 && member.etiquetas.map((etiqueta, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 w-fit bg-[#72E6EA] text-black text-[12px] font-medium px-3 py-1 rounded">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {etiqueta}
              </span>
            ))}
          </div>
        </div>

        {/* Asistencia Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
          <h2 className="text-[20px] font-light text-[#333] mb-4">Asistencia</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[14px] text-[#333]">Último MES</span>
                <span className="text-[14px] text-[#333]">{member.asistencia.ultimoMes} %</span>
              </div>
              <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                <div className="h-full bg-[#4CAF50] rounded-full" style={{ width: `${member.asistencia.ultimoMes}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[14px] text-[#333]">Último AÑO</span>
                <span className="text-[14px] text-[#333]">{member.asistencia.ultimoAno} %</span>
              </div>
              <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                <div className="h-full bg-[#4CAF50] rounded-full" style={{ width: `${member.asistencia.ultimoAno}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[14px] text-[#333]">Desde SIEMPRE</span>
                <span className="text-[14px] text-[#333]">{member.asistencia.desdeSiempre} %</span>
              </div>
              <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                <div className="h-full bg-[#4CAF50] rounded-full" style={{ width: `${member.asistencia.desdeSiempre}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Formación y Fe Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
          <h2 className="text-[20px] font-light text-[#333] mb-4">Formación y Fe</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#333]">Discipulado inicial</span>
              {getStatusBadge(member.formacion.discipuladoInicial)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#333]">Pre bautismos</span>
              {getStatusBadge(member.formacion.preBautismos)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#333]">Escuela bíblica</span>
              {getStatusBadge(member.formacion.escuelaBiblica)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#333]">Escuela discipulado</span>
              {getStatusBadge(member.formacion.escuelaDiscipulado)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#333]">Entrenamiento</span>
              {getStatusBadge(member.formacion.entrenamiento)}
            </div>

            <div className="border-t border-[#E0E0E0] pt-3 mt-3">
              {member.iglesiaProcedente && (
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[14px] text-[#333] flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 2H6a2 2 0 0 0-2 2v16l8-4 8 4V4a2 2 0 0 0-2-2z"/>
                    </svg>
                    Iglesia procedente
                    <button className="ml-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#45C1EE" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                      </svg>
                    </button>
                  </span>
                  <span className="text-[14px] text-[#333]">{member.iglesiaProcedente}</span>
                </div>
              )}

              <div className="flex justify-between items-center mb-3">
                <span className="text-[14px] text-[#333] flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                  Bautizado
                  <button className="ml-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#45C1EE" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                  </button>
                </span>
                <span className="text-[14px] text-[#333] flex items-center gap-2">
                  {member.bautizado ? 'Sí' : 'No'}
                  {member.nuevoBautizado && <span className="text-[12px] text-[#666]">- Nuevo bautizado</span>}
                  {!member.bautizado && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F21D61" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-[14px] text-[#333]">Ministerios</span>
                <span className="text-[14px] text-[#333]">
                  {member.ministerios.length > 0 ? member.ministerios.join(', ') : 'Voluntarios'}
                </span>
              </div>

              <div>
                <span className="text-[14px] text-[#333] font-medium">Observaciones</span>
                <p className="text-[14px] text-[#666] mt-1">{member.observaciones || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Servicios Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
          <h2 className="text-[20px] font-light text-[#333] mb-4">Servicios</h2>
          
          <div className="space-y-2">
            {member.servicios.map((servicio, idx) => (
              <div key={idx} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span className="text-[13px] text-[#666]">{servicio.fecha}</span>
                  <span className="text-[13px] text-[#333]">{servicio.nombre}</span>
                </div>
                {servicio.asistio ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#4CAF50" stroke="none">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E0E0E0" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Buttons */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white px-5 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="max-w-2xl mx-auto">
          <button className="w-full bg-[#4CAF50] text-white text-[16px] font-medium py-3 px-6 rounded-full mb-2">
            EDITAR
          </button>
          <button 
            onClick={() => setShowDarBajaModal(true)}
            className="w-full text-[#F21D61] text-[14px] font-medium py-2"
          >
            DAR DE BAJA
          </button>
        </div>
      </footer>

      {/* WhatsApp Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="flex justify-end mb-2">
              <button onClick={() => setShowWhatsAppModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <h3 className="text-[20px] font-bold text-[#333] mb-2">Conversar por Whatsapp.</h3>
            <p className="text-[14px] text-[#666] mb-6">
              ¿Quieres ir a Whatsapp para hablar con <span className="text-[#4CAF50]">{member.nombre}</span>?
            </p>
            <button 
              onClick={handleWhatsApp}
              className="w-full bg-[#4CAF50] text-white text-[14px] font-medium py-3 px-6 rounded-full mb-3"
            >
              IR A WHATSAPP
            </button>
            <button 
              onClick={() => setShowWhatsAppModal(false)}
              className="w-full text-[#F21D61] text-[14px] font-medium"
            >
              NO
            </button>
          </div>
        </div>
      )}

      {/* Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-w-md p-4">
            <button 
              onClick={handleCall}
              className="w-full bg-[#FFEB3B] text-[#333] text-[14px] font-medium py-4 px-6 rounded-full mb-3 flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Llamar al {member.telefono}
            </button>
            <button 
              onClick={() => setShowCallModal(false)}
              className="w-full text-[#F21D61] text-[14px] font-medium py-3"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Dar de Baja Modal */}
      {showDarBajaModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="flex justify-end mb-2">
              <button onClick={() => setShowDarBajaModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <h3 className="text-[20px] font-bold text-[#333] mb-6">¿Desea dar de baja a este integrante?</h3>
            <button 
              onClick={handleDarBaja}
              className="w-full bg-[#4CAF50] text-white text-[14px] font-medium py-3 px-6 rounded-full mb-3"
            >
              SÍ
            </button>
            <button 
              onClick={() => setShowDarBajaModal(false)}
              className="w-full text-[#F21D61] text-[14px] font-medium"
            >
              NO
            </button>
          </div>
        </div>
      )}

      {/* No Puede Dar de Baja Modal */}
      {showNoPuedeBajaModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="flex justify-end mb-2">
              <button onClick={() => setShowNoPuedeBajaModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <h3 className="text-[20px] font-bold text-[#333] mb-2">No es posible dar de baja.</h3>
            <p className="text-[14px] text-[#666] mb-1">
              Este integrante es {member?.rol === 'supervisor' ? 'responsable y supervisor de grupos' : 'responsable de un grupo'}.
            </p>
            <p className="text-[14px] text-[#666] mb-6">
              Para dar de baja este integrante antes debe asignar otro responsable {member?.rol === 'supervisor' && 'y supervisor'} a su{member?.rol === 'supervisor' ? 's grupos' : ' grupo'}.
            </p>
            <button 
              onClick={() => setShowNoPuedeBajaModal(false)}
              className="w-full bg-[#4CAF50] text-white text-[14px] font-medium py-3 px-6 rounded-full"
            >
              CERRAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
