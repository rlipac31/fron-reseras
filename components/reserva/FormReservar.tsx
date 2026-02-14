"use client";
import { useState } from "react";
import { Calendar, Clock, Timer, User, Search, CheckCircle2 } from "lucide-react";
import { createBooking } from "@/app/actions/bookings";
import { useRouter } from "next/navigation";
//cpnetxt
import { useUser } from '../../context/UserContext'


// 1. Definimos la interfaz para que TypeScript sepa que es una Promesa
interface PageProps {
  searchParams: Promise<{ fieldId?: string; }>;
}


export default async function  FormReserva({ userId, fieldId, startTime, durationInMinutes }:
                               { userId: string, fieldId:string, startTime:Date, durationInMinutes:Number }){   

  // 3. ¡IMPORTANTE! Esperamos a que los searchParams se resuelvan
  /*   const params = await searchParams;
    const id = params.fieldId; */


  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {user} = useUser();
  console.log("cerando reserva  ok", user)

  // Estados del formulario (hardcoded IDs por ahora como en tu ejemplo)
  const [formData, setFormData] = useState({
    userId: user?.idUser,
    fieldId: fieldId,
    date: "",
    time: "",
    durationInMinutes: 60,
  });




   const handleSubmit = async (e: React.FormEvent) => {

  //   const result = await createBooking({ userId, fieldId, startTime, durationInMinutes });

    e.preventDefault();
    setLoading(true);
    setError(null);

    // Combinar fecha y hora para el formato ISO que espera tu API
    const startTimeISO = new Date(`${formData.date}T${formData.time}:00`).toISOString();

    const payload = {
      userId: formData.userId,
      fieldId: formData.fieldId,
      startTime: startTimeISO,
      durationInMinutes: Number(formData.durationInMinutes),
    };

    const result = await createBooking(payload);
    if (result.success) {
      setSuccess(true);
      console.log("debe ir a reserva:::")
      setTimeout(() => router.push("/dashboard/reservas"), 500);
    } else {
      setError(result.error);
      setLoading(false);
    }
  }; 

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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-brand-white rounded-2xl shadow-xl border border-brand-gray overflow-hidden">
        {/* Header Formulario */}
        <div className="bg-brand-black p-6 text-center">
          <h1 className="text-2xl font-bold text-brand-gold uppercase tracking-tight">Nueva Reserva</h1>
          <p className="text-gray-400 text-sm mt-1">Completa los datos del encuentro</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-xs p-3 rounded-lg text-center font-bold">
              {error}
            </div>
          )}

          {/* Campo ID (Solo lectura en este ejemplo) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">ID de Cancha</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-brand-gold" size={18} />
              <input
                disabled
                value={formData.fieldId}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-brand-gray rounded-lg text-sm text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Fecha */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Fecha del Partido</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-brand-gold" size={18} />
              <input
                required
                type="date"
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-brand-gray rounded-lg text-sm focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Hora */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Hora Inicio</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 text-brand-gold" size={18} />
                <input
                  required
                  type="time"
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-brand-gray rounded-lg text-sm focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Duración */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Duración</label>
              <div className="relative">
                <Timer className="absolute left-3 top-2.5 text-brand-gold" size={18} />
                <select
                  value={formData.durationInMinutes}
                  onChange={(e) => setFormData({ ...formData, durationInMinutes: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-2 border border-brand-gray rounded-lg text-sm focus:ring-2 focus:ring-brand-gold outline-none appearance-none bg-white"
                >
                  <option value={30}>30 min</option>
                  <option value={60}>60 min</option>
                  <option value={90}>90 min</option>
                  <option value={120}>120 min</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold uppercase tracking-widest text-sm transition-all shadow-lg ${
              loading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-brand-gold text-brand-black hover:bg-brand-black hover:text-brand-gold active:scale-95'
            }`}
          >
            {loading ? "Procesando..." : "Confirmar Reserva"}
          </button>
        </form>
      </div>
    </div>
  );
}