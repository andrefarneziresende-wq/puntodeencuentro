import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppHeader } from '../../components/layout';
import { api, getImageUrl } from '../../services/api';

interface MemberFormData {
  foto: string | null;
  esMiembro: boolean;
  numero: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  prefijo: string;
  telefono: string;
  email: string;
  direccion: string;
  grupo: string;
  responsabilidad: {
    ayudante: boolean;
    ayudanteGrupos: string[];
    responsable: boolean;
    responsableGrupos: string[];
    supervisor: boolean;
    supervisorGrupos: string[];
  };
  formacion: {
    discipuladoInicial: string;
    preBautismos: string;
    escuelaBiblica: string;
    escuelaDiscipulado: string;
    entrenamiento: string;
  };
  fe: {
    nuevoCreyente: boolean;
    nuevoBautizado: boolean;
    bautizado: boolean;
    bautizadoDesde: string;
    procedenteOtraIglesia: boolean;
    procedenteDesde: string;
    nombreIglesiaCiudad: string;
  };
  ministerios: string[];
  ministerioResponsable: boolean;
  ministerioDelQueEsResponsable: string;
  observaciones: string;
}

const initialFormData: MemberFormData = {
  foto: null,
  esMiembro: false,
  numero: '',
  nombre: '',
  apellidos: '',
  fechaNacimiento: '',
  prefijo: '+34',
  telefono: '',
  email: '',
  direccion: '',
  grupo: '',
  responsabilidad: {
    ayudante: false,
    ayudanteGrupos: [],
    responsable: false,
    responsableGrupos: [],
    supervisor: false,
    supervisorGrupos: []
  },
  formacion: {
    discipuladoInicial: '',
    preBautismos: '',
    escuelaBiblica: '',
    escuelaDiscipulado: '',
    entrenamiento: ''
  },
  fe: {
    nuevoCreyente: false,
    nuevoBautizado: false,
    bautizado: false,
    bautizadoDesde: '',
    procedenteOtraIglesia: false,
    procedenteDesde: '',
    nombreIglesiaCiudad: ''
  },
  ministerios: [],
  ministerioResponsable: false,
  ministerioDelQueEsResponsable: '',
  observaciones: ''
};

const gruposOptions = [
  'Casa de Samuel',
  'Casa de María Inés',
  'Casa Enrique y Julia',
  'Hombres adultos 1',
  'Hombres adultos 2',
  'Hombres senior',
  'Jóvenes chicos 16 a 18 años',
  'Jóvenes chicos 19 a 25 años',
  'Mujeres senior',
  'Parejas jóvenes'
];

const formacionOptions = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'no_iniciado', label: 'No iniciado' },
  { value: 'cursando', label: 'Cursando' },
  { value: 'terminado', label: 'Terminado' }
];

const ministeriosOptions = [
  'Alabanza',
  'Escuela Bíblica',
  'Infantil',
  'Jóvenes',
  'Multimedia',
  'Obra social',
  'Redes sociales',
  'Voluntarios'
];

export function MemberFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState<MemberFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      loadMember();
    }
  }, [id]);

  const loadMember = async () => {
    setLoading(true);
    try {
      const result = await api.getIntegrante(id || '');
      if (result.data?.integrante) {
        const member = result.data.integrante;
        setFormData({
          foto: member.foto,
          esMiembro: member.esMiembro,
          numero: member.numero?.toString() || '',
          nombre: member.nombre?.split(' ')[0] || '',
          apellidos: member.nombre?.split(' ').slice(1).join(' ') || '',
          fechaNacimiento: member.fechaNacimiento || '',
          prefijo: '+34',
          telefono: member.telefono?.replace('+34 ', '') || '',
          email: member.email || '',
          direccion: member.direccion || '',
          grupo: member.grupo || '',
          responsabilidad: member.responsabilidad ? {
            ayudante: member.responsabilidad.ayudante || false,
            ayudanteGrupos: member.responsabilidad.ayudanteGrupos || [],
            responsable: member.responsabilidad.responsable || false,
            responsableGrupos: member.responsabilidad.responsableGrupos || [],
            supervisor: member.responsabilidad.supervisor || false,
            supervisorGrupos: member.responsabilidad.supervisorGrupos || []
          } : {
            // Fallback for old data format - use grupo as default if gruposSupervisa is empty
            ayudante: member.rol === 'ayudante',
            ayudanteGrupos: member.rol === 'ayudante' 
              ? (member.gruposSupervisa && member.gruposSupervisa.length > 0 ? member.gruposSupervisa : (member.grupo ? [member.grupo] : [])) 
              : [],
            responsable: member.rol === 'responsable',
            responsableGrupos: member.rol === 'responsable' 
              ? (member.gruposSupervisa && member.gruposSupervisa.length > 0 ? member.gruposSupervisa : (member.grupo ? [member.grupo] : [])) 
              : [],
            supervisor: member.rol === 'supervisor',
            supervisorGrupos: member.rol === 'supervisor' 
              ? (member.gruposSupervisa && member.gruposSupervisa.length > 0 ? member.gruposSupervisa : (member.grupo ? [member.grupo] : [])) 
              : []
          },
          formacion: {
            discipuladoInicial: member.formacion?.discipuladoInicial?.toLowerCase().replace(' ', '_') || '',
            preBautismos: member.formacion?.preBautismos?.toLowerCase().replace(' ', '_') || '',
            escuelaBiblica: member.formacion?.escuelaBiblica?.toLowerCase().replace(' ', '_') || '',
            escuelaDiscipulado: member.formacion?.escuelaDiscipulado?.toLowerCase().replace(' ', '_') || '',
            entrenamiento: member.formacion?.entrenamiento?.toLowerCase().replace(' ', '_') || ''
          },
          fe: {
            nuevoCreyente: member.nuevoCreyente || false,
            nuevoBautizado: member.nuevoBautizado || false,
            bautizado: member.bautizado || false,
            bautizadoDesde: '',
            procedenteOtraIglesia: !!member.iglesiaProcedente,
            procedenteDesde: '',
            nombreIglesiaCiudad: member.iglesiaProcedente || ''
          },
          ministerios: member.ministerios || [],
          ministerioResponsable: false,
          ministerioDelQueEsResponsable: '',
          observaciones: member.observaciones || ''
        });
        if (member.foto) {
          setPreviewUrl(member.foto);
        }
      }
    } catch (error) {
      console.error('Error loading member:', error);
    }
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 4 MB.');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (previewUrl) {
      setFormData({ ...formData, foto: previewUrl });
    }
    setShowPhotoModal(false);
    setUploadProgress(0);
  };

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (saving) return;
    
    const validationErrors: string[] = [];
    
    // Required fields validation
    if (!formData.nombre.trim()) {
      validationErrors.push('El campo Nombre es obligatorio.');
    }
    if (!formData.apellidos.trim()) {
      validationErrors.push('El campo Apellidos es obligatorio.');
    }
    if (!formData.fechaNacimiento.trim()) {
      validationErrors.push('El campo Fecha de Nacimiento es obligatorio.');
    }
    if (!formData.prefijo.trim()) {
      validationErrors.push('El campo Prefijo es obligatorio.');
    }
    if (!formData.telefono.trim()) {
      validationErrors.push('El campo Teléfono es obligatorio.');
    }
    if (!formData.direccion.trim()) {
      validationErrors.push('El campo Dirección es obligatorio.');
    }
    
    // If "es miembro" is selected, "numero" is required
    if (formData.esMiembro && !formData.numero.trim()) {
      validationErrors.push('Si es miembro, el campo Número es obligatorio.');
    }
    
    // Formación fields validation
    if (!formData.formacion.discipuladoInicial) {
      validationErrors.push('El campo Discipulado inicial es obligatorio.');
    }
    if (!formData.formacion.preBautismos) {
      validationErrors.push('El campo Pre bautismos es obligatorio.');
    }
    if (!formData.formacion.escuelaBiblica) {
      validationErrors.push('El campo Escuela bíblica es obligatorio.');
    }
    if (!formData.formacion.escuelaDiscipulado) {
      validationErrors.push('El campo Escuela discipulado es obligatorio.');
    }
    if (!formData.formacion.entrenamiento) {
      validationErrors.push('El campo Entrenamiento es obligatorio.');
    }
    
    // Validate that if a role is selected, at least one group must be selected
    if (formData.responsabilidad.supervisor && formData.responsabilidad.supervisorGrupos.length === 0) {
      validationErrors.push('Si seleccionas Supervisor, debes seleccionar al menos un Grupo de Hogar.');
    }
    if (formData.responsabilidad.responsable && formData.responsabilidad.responsableGrupos.length === 0) {
      validationErrors.push('Si seleccionas Responsable, debes seleccionar al menos un Grupo de Hogar.');
    }
    if (formData.responsabilidad.ayudante && formData.responsabilidad.ayudanteGrupos.length === 0) {
      validationErrors.push('Si seleccionas Ayudante, debes seleccionar al menos un Grupo de Hogar.');
    }
    
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }
    
    setSaving(true);
    
    try {
      let dataToSave = { ...formData };
      
      // Upload image if there's a new one (base64 format)
      if (formData.foto && formData.foto.startsWith('data:image')) {
        const uploadResult = await api.uploadImage(formData.foto);
        if (uploadResult.data?.url) {
          dataToSave.foto = uploadResult.data.url;
        }
      }
      
      if (isEditing && id) {
        await api.updateIntegrante(id, dataToSave);
      } else {
        await api.createIntegrante(dataToSave);
      }
      navigate('/dashboard/integrantes');
    } catch (error) {
      console.error('Error saving integrante:', error);
      alert('Error al guardar el integrante. Por favor, inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (val: boolean) => void; label?: string }) => (
    <div className="flex items-center gap-2">
      {label && <span className="text-[14px] text-[#333]">{label}</span>}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-[#4CAF50]' : 'bg-[#E0E0E0]'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );

  const Dropdown = ({ 
    label, 
    value, 
    options, 
    onChange, 
    id,
    required = false,
    multiple = false,
    selectedValues = []
  }: { 
    label: string; 
    value: string; 
    options: { value: string; label: string }[] | string[];
    onChange: (val: string) => void;
    id: string;
    required?: boolean;
    multiple?: boolean;
    selectedValues?: string[];
  }) => {
    const isOpen = openDropdown === id;
    const normalizedOptions = options.map(opt => 
      typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    return (
      <div className="mb-4 relative">
        <label className="block text-[14px] text-[#333] mb-1">
          {label}{required && ' *'}
        </label>
        <button
          type="button"
          onClick={() => setOpenDropdown(isOpen ? null : id)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#E0E0E0] rounded-lg text-left"
        >
          <span className={`text-[14px] ${value || selectedValues.length > 0 ? 'text-[#333]' : 'text-[#999]'}`}>
            {multiple 
              ? (selectedValues.length > 0 ? selectedValues.join(', ') : 'Selecciona una o varias opciones')
              : (normalizedOptions.find(o => o.value === value)?.label || 'Selecciona una opción')}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
            <polyline points={isOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E0E0E0] rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {normalizedOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (multiple) {
                    const newValues = selectedValues.includes(opt.value)
                      ? selectedValues.filter(v => v !== opt.value)
                      : [...selectedValues, opt.value];
                    onChange(newValues.join(','));
                  } else {
                    onChange(opt.value);
                    setOpenDropdown(null);
                  }
                }}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#F5F5F5] border-b border-[#E0E0E0] last:border-b-0"
              >
                <span className="text-[14px] text-[#333]">{opt.label}</span>
                {multiple && (
                  <div className={`w-5 h-5 border-2 rounded ${selectedValues.includes(opt.value) ? 'bg-[#4CAF50] border-[#4CAF50]' : 'border-[#E0E0E0]'} flex items-center justify-center`}>
                    {selectedValues.includes(opt.value) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
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

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <AppHeader />
      
      <main className="px-5 pt-3 pb-32 max-w-2xl mx-auto">
        {/* Back link */}
        <Link to="/dashboard/integrantes" className="flex items-center gap-1 text-[#4CAF50] text-[14px] mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Miembros
        </Link>

        <form onSubmit={handleSubmit}>
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
            <h1 className="text-[24px] font-bold text-[#333] mb-6">
              {isEditing ? 'Editar integrante' : 'Alta de integrante'}
            </h1>

            {/* Photo and Member Toggle */}
            <div className="flex items-start gap-4 mb-6">
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="relative w-16 h-16 flex-shrink-0"
              >
                {formData.foto || previewUrl ? (
                  <img src={getImageUrl(formData.foto) || previewUrl || ''} alt="Foto" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <img src="/icon-photo-placeholder.png" alt="Foto" className="w-full h-full object-contain" />
                )}
                {/* Camera icon - bottom right */}
                <img 
                  src="/icon-camera.png" 
                  alt="Cambiar foto" 
                  className="absolute bottom-0 right-0 w-6 h-6"
                />
              </button>
              <div className="flex-1">
                {/* Es miembro toggle - aligned right */}
                <div className="flex items-center justify-end gap-2 mb-2">
                  <span className="text-[14px] text-[#333]">¿Es miembro?</span>
                  <Toggle checked={formData.esMiembro} onChange={(val) => setFormData({ ...formData, esMiembro: val })} />
                </div>
                {formData.esMiembro && (
                  <>
                    {/* Separator line - only between the content */}
                    <div className="flex justify-end my-2">
                      <div className="w-44 border-t border-[#E0E0E0]"></div>
                    </div>
                    {/* Número - label and input side by side, aligned right */}
                    <div className="flex items-center justify-end gap-2">
                      <label className="text-[14px] text-[#333]">Número *</label>
                      <input
                        type="text"
                        value={formData.numero}
                        onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                        className="w-20 px-3 py-2 border border-[#E0E0E0] rounded-lg text-[14px]"
                        placeholder=""
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="mb-4">
              <label className="block text-[14px] text-[#333] mb-1">Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg text-[14px]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[14px] text-[#333] mb-1">Apellidos *</label>
              <input
                type="text"
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg text-[14px]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[14px] text-[#333] mb-1">Fecha de Nacimiento *</label>
              <input
                type="text"
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg text-[14px]"
                placeholder="dd/mm/aaaa"
                required
              />
            </div>

            <div className="flex gap-3 mb-4">
              <div className="w-24">
                <label className="block text-[14px] text-[#333] mb-1">Prefijo *</label>
                <select
                  value={formData.prefijo}
                  onChange={(e) => setFormData({ ...formData, prefijo: e.target.value })}
                  className="w-full px-3 py-3 border border-[#E0E0E0] rounded-lg text-[14px] bg-white"
                >
                  <option value="+34">+34</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-[14px] text-[#333] mb-1">Teléfono *</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg text-[14px]"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[14px] text-[#333] mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg text-[14px]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[14px] text-[#333] mb-1">Dirección *</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg text-[14px]"
                required
              />
            </div>

            {/* Grupo de Hogar */}
            <div className="border-t border-[#E0E0E0] pt-4 mt-4">
              <Dropdown
                label="Grupo de Hogar"
                id="grupo"
                value={formData.grupo}
                options={gruposOptions}
                onChange={(val) => setFormData({ ...formData, grupo: val })}
              />
            </div>

            {/* Responsabilidad */}
            <div className="border-t border-[#E0E0E0] pt-4 mt-4">
              <h3 className="text-[16px] font-bold text-[#333] mb-4">Responsabilidad</h3>
              
              {/* Ayudante */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] text-[#333]">Ayudante</span>
                <Toggle 
                  checked={formData.responsabilidad.ayudante} 
                  onChange={(val) => setFormData({ 
                    ...formData, 
                    responsabilidad: { ...formData.responsabilidad, ayudante: val }
                  })} 
                />
              </div>
              {formData.responsabilidad.ayudante && (
                <Dropdown
                  label="Grupo de Hogar"
                  id="ayudanteGrupos"
                  value=""
                  options={gruposOptions}
                  onChange={(val) => setFormData({ 
                    ...formData, 
                    responsabilidad: { 
                      ...formData.responsabilidad, 
                      ayudanteGrupos: val.split(',').filter(v => v) 
                    }
                  })}
                  multiple
                  selectedValues={formData.responsabilidad.ayudanteGrupos}
                />
              )}

              {/* Responsable */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] text-[#333]">Responsable</span>
                <Toggle 
                  checked={formData.responsabilidad.responsable} 
                  onChange={(val) => setFormData({ 
                    ...formData, 
                    responsabilidad: { ...formData.responsabilidad, responsable: val }
                  })} 
                />
              </div>
              {formData.responsabilidad.responsable && (
                <Dropdown
                  label="Grupo de Hogar"
                  id="responsableGrupos"
                  value=""
                  options={gruposOptions}
                  onChange={(val) => setFormData({ 
                    ...formData, 
                    responsabilidad: { 
                      ...formData.responsabilidad, 
                      responsableGrupos: val.split(',').filter(v => v) 
                    }
                  })}
                  multiple
                  selectedValues={formData.responsabilidad.responsableGrupos}
                />
              )}

              {/* Supervisor */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] text-[#333]">Supervisor</span>
                <Toggle 
                  checked={formData.responsabilidad.supervisor} 
                  onChange={(val) => setFormData({ 
                    ...formData, 
                    responsabilidad: { ...formData.responsabilidad, supervisor: val }
                  })} 
                />
              </div>
              {formData.responsabilidad.supervisor && (
                <Dropdown
                  label="Grupo de Hogar"
                  id="supervisorGrupos"
                  value=""
                  options={gruposOptions}
                  onChange={(val) => setFormData({ 
                    ...formData, 
                    responsabilidad: { 
                      ...formData.responsabilidad, 
                      supervisorGrupos: val.split(',').filter(v => v) 
                    }
                  })}
                  multiple
                  selectedValues={formData.responsabilidad.supervisorGrupos}
                />
              )}
            </div>

            {/* Formación */}
            <div className="border-t border-[#E0E0E0] pt-4 mt-4">
              <h3 className="text-[16px] font-bold text-[#333] mb-4">Formación</h3>
              
              <Dropdown
                label="Discipulado inicial"
                id="discipuladoInicial"
                value={formData.formacion.discipuladoInicial}
                options={formacionOptions}
                onChange={(val) => setFormData({ 
                  ...formData, 
                  formacion: { ...formData.formacion, discipuladoInicial: val }
                })}
                required
              />

              <Dropdown
                label="Pre bautismos"
                id="preBautismos"
                value={formData.formacion.preBautismos}
                options={formacionOptions}
                onChange={(val) => setFormData({ 
                  ...formData, 
                  formacion: { ...formData.formacion, preBautismos: val }
                })}
                required
              />

              <Dropdown
                label="Escuela bíblica"
                id="escuelaBiblica"
                value={formData.formacion.escuelaBiblica}
                options={formacionOptions}
                onChange={(val) => setFormData({ 
                  ...formData, 
                  formacion: { ...formData.formacion, escuelaBiblica: val }
                })}
                required
              />

              <Dropdown
                label="Escuela discipulado"
                id="escuelaDiscipulado"
                value={formData.formacion.escuelaDiscipulado}
                options={formacionOptions}
                onChange={(val) => setFormData({ 
                  ...formData, 
                  formacion: { ...formData.formacion, escuelaDiscipulado: val }
                })}
                required
              />

              <Dropdown
                label="Entrenamiento"
                id="entrenamiento"
                value={formData.formacion.entrenamiento}
                options={formacionOptions}
                onChange={(val) => setFormData({ 
                  ...formData, 
                  formacion: { ...formData.formacion, entrenamiento: val }
                })}
                required
              />
            </div>

            {/* Fe */}
            <div className="border-t border-[#E0E0E0] pt-4 mt-4">
              <h3 className="text-[16px] font-bold text-[#333] mb-4">Fe</h3>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] text-[#333]">Nuevo creyente</span>
                <Toggle 
                  checked={formData.fe.nuevoCreyente} 
                  onChange={(val) => setFormData({ 
                    ...formData, 
                    fe: { ...formData.fe, nuevoCreyente: val }
                  })} 
                />
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] text-[#333]">Nuevo bautizado</span>
                <Toggle 
                  checked={formData.fe.nuevoBautizado} 
                  onChange={(val) => setFormData({ 
                    ...formData, 
                    fe: { ...formData.fe, nuevoBautizado: val }
                  })} 
                />
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] text-[#333]">Bautizado</span>
                <Toggle 
                  checked={formData.fe.bautizado} 
                  onChange={(val) => setFormData({ 
                    ...formData, 
                    fe: { ...formData.fe, bautizado: val }
                  })} 
                />
              </div>

              {formData.fe.bautizado && (
                <div className="mb-4 ml-4">
                  <label className="block text-[14px] text-[#333] mb-1">Desde *</label>
                  <input
                    type="text"
                    value={formData.fe.bautizadoDesde}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      fe: { ...formData.fe, bautizadoDesde: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg text-[14px]"
                    placeholder="dd/mm/aaaa"
                  />
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] text-[#333]">Procedente de otra iglesia</span>
                <Toggle 
                  checked={formData.fe.procedenteOtraIglesia} 
                  onChange={(val) => setFormData({ 
                    ...formData, 
                    fe: { ...formData.fe, procedenteOtraIglesia: val }
                  })} 
                />
              </div>

              {formData.fe.procedenteOtraIglesia && (
                <>
                  <div className="mb-4 ml-4">
                    <label className="block text-[14px] text-[#333] mb-1">Desde *</label>
                    <input
                      type="text"
                      value={formData.fe.procedenteDesde}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        fe: { ...formData.fe, procedenteDesde: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg text-[14px]"
                      placeholder="dd/mm/aaaa"
                    />
                  </div>
                  <div className="mb-4 ml-4">
                    <label className="block text-[14px] text-[#333] mb-1">Nombre de la iglesia y Ciudad *</label>
                    <input
                      type="text"
                      value={formData.fe.nombreIglesiaCiudad}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        fe: { ...formData.fe, nombreIglesiaCiudad: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg text-[14px]"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Ministerios */}
            <div className="border-t border-[#E0E0E0] pt-4 mt-4">
              <Dropdown
                label="Ministerios"
                id="ministerios"
                value=""
                options={ministeriosOptions}
                onChange={(val) => setFormData({ 
                  ...formData, 
                  ministerios: val.split(',').filter(v => v)
                })}
                multiple
                selectedValues={formData.ministerios}
              />

              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] text-[#333]">Responsable</span>
                <Toggle 
                  checked={formData.ministerioResponsable} 
                  onChange={(val) => setFormData({ ...formData, ministerioResponsable: val })} 
                />
              </div>

              {formData.ministerioResponsable && (
                <Dropdown
                  label="Ministerio del que es responsable"
                  id="ministerioResponsableDe"
                  value={formData.ministerioDelQueEsResponsable}
                  options={ministeriosOptions}
                  onChange={(val) => setFormData({ ...formData, ministerioDelQueEsResponsable: val })}
                />
              )}
            </div>

            {/* Observaciones */}
            <div className="border-t border-[#E0E0E0] pt-4 mt-4">
              <label className="block text-[14px] text-[#333] mb-1">Observaciones</label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg text-[14px] min-h-[100px] resize-none"
              />
            </div>
          </div>
        </form>
      </main>

      {/* Footer Buttons */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white px-5 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="max-w-2xl mx-auto">
          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={saving}
            className={`w-full text-white text-[16px] font-medium py-3 px-6 rounded-full mb-2 ${saving ? 'bg-[#9E9E9E]' : 'bg-[#4CAF50]'}`}
          >
            {saving ? 'GUARDANDO...' : 'GUARDAR'}
          </button>
          <button 
            type="button"
            onClick={() => navigate('/dashboard/integrantes')}
            className="w-full text-[#F21D61] text-[14px] font-medium py-2"
          >
            CANCELAR
          </button>
        </div>
      </footer>

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[20px] font-bold text-[#333]">Fotografía</h3>
              <button onClick={() => setShowPhotoModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Preview or Placeholder */}
            <div className="flex justify-center mb-4">
              {previewUrl ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#4CAF50]">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <img src="/icon-photo-placeholder.png" alt="Foto" className="w-24 h-24 object-contain" />
              )}
            </div>

            {/* Progress Bar */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#4CAF50] transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-[12px] text-[#666]">{uploadProgress} %</span>
                </div>
                {selectedFile && (
                  <p className="text-[12px] text-[#666]">
                    JPG {(selectedFile.size / 1024 / 1024).toFixed(1)} Mb
                  </p>
                )}
              </div>
            )}

            {/* Select Image Button */}
            <label className="block text-center mb-4">
              <span className="text-[#4CAF50] text-[14px] font-medium cursor-pointer">
                SELECCIONAR IMAGEN
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>

            <p className="text-[12px] text-[#666] text-center mb-6">
              El peso máximo del documento es de 4 Mb.<br />
              Formato JPG o PNG.
            </p>

            <button 
              onClick={handleSavePhoto}
              className="w-full bg-[#4CAF50] text-white text-[14px] font-medium py-3 px-6 rounded-full mb-3"
            >
              GUARDAR
            </button>
            <button 
              onClick={() => {
                setShowPhotoModal(false);
                setPreviewUrl(formData.foto);
                setSelectedFile(null);
                setUploadProgress(0);
              }}
              className="w-full text-[#F21D61] text-[14px] font-medium"
            >
              CANCELAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
