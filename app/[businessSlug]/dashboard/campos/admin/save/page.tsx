"use client";
import { useState, useEffect } from "react"; // Añadimos useEffect
import { Calendar, Clock, Timer, Search, CheckCircle2, MapPin, Loader2 } from "lucide-react";
import { GiSoccerKick } from "react-icons/gi";
import { createField } from "@/app/actions/fields";// Importamos useSearchParams
import { useUser } from '@/context/UserContext';
import { useRouter, useSearchParams, notFound } from "next/navigation";
import { Suspense } from "react";

//import { ErrorAlert } from "@/components/Alert"; // Importa el componente de arriba

function CreateFieldForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook para capturar parámetros en el cliente
  const businessId = searchParams.get("businessId"); // Obtenemos el valor de ?businessId=..
 const { user } = useUser(); // Es vital saber si está cargando.


  const slug = user?.slug;
// Validación de seguridad (Corregida para el Build)
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push(`/${user.slug}/unauthorized`);
    }
  }, [user, router]);



  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Inicializamos el estado del formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    capacity: undefined,
    pricePerHour: undefined,
  });

  // Sincronizamos los datos del usuario y el fieldId cuando cargue el componente
  useEffect(() => {
    if (businessId) {
      setFormData((prev) => ({
        ...prev,
        businessId: businessId || "" // Prioridad al context o fallback
      }));
    }
  }, [businessId]);

  //.log(" id negocio desde crear campos", user);


  // 2. FUNCIÓN PARA CAPTURAR LOS CAMBIOS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value // Actualiza solo el campo que cambió
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.businessId) return setError("No se ha seleccionado una cancha.");

    setLoading(true);
    setError(null);

    const payload = {
      name: formData.name,
      description: formData.description,
      location: formData.location,
      capacity: formData.capacity,
      pricePerHour: formData.pricePerHour,
      businessId: user?.businessId
    };

    const result = await createField(payload);
    

    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push(`/${slug}/dashboard/campos/admin`), 1000);
    } else {
      console.log("error tipo :: ", result.error)
      setError(result.error);
      setLoading(false);
    }
  };
if (user?.role !== 'ADMIN') return null;

  if (success) {
    return (
      <div className="min-h-screen bg-brand-white flex items-center justify-center p-4">
        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
          <CheckCircle2 size={80} className="text-success mx-auto" />
          <h2 className="text-2xl font-bold text-brand-black">¡Reserva Creada!</h2>
          <p className="text-gray-500">Redirigiendo al panel principal...</p>
        </div>
      </div>
    );
  }



  return (
  <div className="min-h-screen bg-gray-50/50 py-12 px-4 flex items-center justify-center">
    <div className="max-w-md w-full bg-brand-white rounded-3xl shadow-2xl border border-brand-gray overflow-hidden">
      
      {/* Header con tus colores de marca */}
      <div className="bg-brand-black p-8 text-center relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-gold"></div>
        <h1 className="text-2xl font-black text-brand-gold uppercase tracking-tighter">
          Nuevo Campo
        </h1>
        <p className="text-gray-400 text-xs mt-2 font-medium tracking-widest uppercase">
          Configuración de Instalación
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {error && (
          <div className="bg-danger/10 border-l-4 border-danger text-danger text-xs p-4 rounded-r-lg font-bold animate-in fade-in slide-in-from-top-1">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Nombre de la Cancha */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="ml-1 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
              Nombre de la Cancha
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Estadio Central"
              className="w-full px-4 py-2.5 bg-gray-50 border border-brand-gray rounded-xl text-sm transition-all focus:ring-4 focus:ring-brand-gold/20 focus:border-brand-gold focus:bg-brand-white focus:outline-none"
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="ml-1 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
              Descripción Corta
            </label>
            <input
              id="description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Cancha sintética profesional..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-brand-gray rounded-xl text-sm transition-all focus:ring-4 focus:ring-brand-gold/20 focus:border-brand-gold focus:bg-brand-white focus:outline-none"
            />
          </div>

          {/* Ubicación */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="location" className="flex items-center ml-1 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
              Ubicación
               <MapPin size={14} className="text-brand-gold ml-2" />
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Av. Principal 123"
              className="w-full px-4 py-2.5 bg-gray-50 border border-brand-gray rounded-xl text-sm transition-all focus:ring-4 focus:ring-brand-gold/20 focus:border-brand-gold focus:bg-brand-white focus:outline-none"
            />
          </div>

          {/* Fila doble: Capacidad y Precio */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              
              <label htmlFor="capacity" className="flex  items-center ml-1 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                  Capacidad
                <GiSoccerKick size={18} className='text-brand-gold ml-2'/>
               
              </label>
              
              <input
                id="capacity"
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                placeholder="10"
                className="w-full px-4 py-2.5 bg-gray-50 border border-brand-gray rounded-xl text-sm transition-all focus:ring-4 focus:ring-brand-gold/20 focus:border-brand-gold focus:bg-brand-white focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="pricePerHour" className="ml-1 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                Precio / Hora
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">{user?.currency?.symbol || "$"}</span>
                <input
                  id="pricePerHour"
                  type="number"
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                  placeholder="25"
                  className="w-full pl-7 pr-4 py-2.5 bg-gray-50 border border-brand-gray rounded-xl text-sm transition-all focus:ring-4 focus:ring-brand-gold/20 focus:border-brand-gold focus:bg-brand-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botón de Acción con tus colores */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-brand-gold/10 ${
            loading
              ? 'bg-brand-gray text-gray-400 cursor-not-allowed'
              : 'bg-brand-gold text-brand-black hover:bg-brand-black hover:text-brand-gold active:scale-95'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Procesando...
            </span>
          ) : "Confirmar Registro"}
        </button>
      </form>
    </div>
  </div>
);
}

// 2. Exportamos la página envuelta en Suspense (Esto arregla el error de Vercel)
export default  function CreateFieldPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
      </div>
    }>
      <CreateFieldForm />
    </Suspense>
  );
}