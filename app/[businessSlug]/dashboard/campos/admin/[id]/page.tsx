"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, ArrowLeft, Lock, Unlock, Info, DollarSign, Users, MapPin, Loader2, Banknote } from 'lucide-react';
// Importa tu función de actualización aquí (ej: updateField)
import { getfieldId, getUpdatefield  } from '@/app/actions/fields';
import { useUser } from '@/context/UserContext';

const EditCampo = () => {
  const router = useRouter();
  const params = useParams();
  const idfield = params.id;
  const { user } = useUser();

  const [campo, setCampo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState({});
  const [saving, setSaving] = useState(false);
  const [mensage, setMensage] = useState('');

  const fieldId = String(idfield?.$oid || idfield || "");

  useEffect(() => {
    if (!fieldId) return;
    const loadField = async () => {
      try {
        // Asumo que getUpdateField es tu función de carga por ID
        const response = await getfieldId(fieldId); 
        console.log("response edit ", response)
        if (response.success) {
          setCampo(response.data.field);
        }
      } catch (error) {
        console.error("Error cargando campo:", error);
      } finally {
        setLoading(false);
      }
    };
    loadField();
  }, [fieldId]);

  const toggleLock = (fieldName) => {
    setIsEditable(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCampo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Aquí llamarías a tu API: const res = await updateFieldAction(fieldId, campo);
    if (!fieldId) return;
    const res = getUpdatefield(fieldId, campo);
    if (res.success) {
          console.log("se actualizao correctamente")
           setMensage("el campo se acualizo correctamente")
        }
   
    // Simulación de guardado
    setTimeout(() => {
        setSaving(false);
        setMensage('')
        router.push(`/${user?.slug}/dashboard/campos/admin`);
    }, 100);
  };
console.log("campo desde editar ", campo)
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="animate-spin text-brand-gold" size={40} />
      <p className="text-sm font-bold text-brand-black uppercase">Cargando datos del servidor...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-10">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-black mb-6 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} /> Volver al listado
        </button>
      { mensage !== '' && (
         <div className='bg-brand-black/20'>
            <span className='text-blue-600 text-xl font-medium'>{mensage}</span>
        </div>
      )}
        

        <div className="bg-white rounded-2xl shadow-xl border border-brand-gray overflow-hidden">
          {/* Cabecera */}
          <div className="bg-brand-black p-6 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-brand-gold uppercase tracking-tight">
                {campo?.name || "Editar Campo"}
              </h1>
              <p className="text-[10px] text-gray-400 font-mono mt-1">UUID: {campo?._id}</p>
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Estado</span>
                <input 
                    type="checkbox" 
                    name="state"
                    checked={campo?.state || false}
                    onChange={handleChange}
                    className="w-5 h-5 accent-brand-gold cursor-pointer"
                />
                <span className={`text-[11px] font-black ${campo?.state ? "text-brand-gold" : "text-red-500"}`}>
                    {campo?.state ? 'ACTIVO' : 'INACTIVO'}
                </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <FieldInput 
                label="Nombre de la Cancha"
                name="name"
                value={campo?.name}
                icon={<Info size={16}/>}
                isEditable={isEditable.name}
                onToggle={() => toggleLock('name')}
                onChange={handleChange}
              />

              {/* Ubicación */}
              <FieldInput 
                label="Ubicación / Sector"
                name="location"
                value={campo?.location}
                icon={<MapPin size={16}/>}
                isEditable={isEditable.location}
                onToggle={() => toggleLock('location')}
                onChange={handleChange}
              />

              {/* Precio */}
              <FieldInput 
                label="Precio por Hora (S/)"
                name="pricePerHour"
                type="number"
                value={campo?.pricePerHour}
                icon={<Banknote size={16}/>}
                isEditable={isEditable.pricePerHour}
                onToggle={() => toggleLock('pricePerHour')}
                onChange={handleChange}
              />

              {/* Capacidad */}
              <FieldInput 
                label="Capacidad (Jugadores)"
                name="capacity"
                type="number"
                value={campo?.capacity}
                icon={<Users size={16}/>}
                isEditable={isEditable.capacity}
                onToggle={() => toggleLock('capacity')}
                onChange={handleChange}
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Descripción detallada</label>
                <button
                  type="button"
                  onClick={() => toggleLock('description')}
                  className="bg-brand-gold p-2 rounded-sm hover:bg-brand-gold/80 text-brand-black transition-all duration-300 text-[12px] font-bold  uppercase hover:underline"
                >
                  {isEditable.description ? 'Cerrar edición' : 'Editar Descripcion'}
                </button>
              </div>
              <textarea
                name="description"
                value={campo?.description || ""}
                onChange={handleChange}
                rows={4}
                disabled={!isEditable.description}
                className={`w-full p-4 rounded-xl border text-sm transition-all outline-none resize-none
                    ${isEditable.description ? 'border-brand-gold bg-white ring-4 ring-brand-gold/5' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
              />
            </div>

            {/* Botón Guardar */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-brand-black text-brand-gold font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-brand-black/90 transition-all shadow-xl active:scale-[0.98] disabled:opacity-70 mt-4 uppercase tracking-widest text-sm"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {saving ? "Guardando..." : "Confirmar Actualización"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Sub-componente para los inputs y no repetir código
const FieldInput = ({ label, name, value, icon, isEditable, onToggle, onChange, type = "text" }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>
    <div className="flex gap-2">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        <input
          name={name}
          type={type}
          value={value || ""}
          onChange={onChange}
          disabled={!isEditable}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all outline-none
            ${isEditable 
              ? 'border-brand-gold bg-white ring-4 ring-brand-gold/5 font-medium' 
              : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'}`}
        />
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`p-3 rounded-xl border transition-all ${isEditable ? 'bg-brand-gold border-brand-gold text-brand-black shadow-md shadow-brand-gold/20' : 'bg-white border-gray-200 text-gray-400'}`}
      >
        {isEditable ? <Unlock size={18}/> : <Lock size={18}/>}
      </button>
    </div>
  </div>
);

export default EditCampo;