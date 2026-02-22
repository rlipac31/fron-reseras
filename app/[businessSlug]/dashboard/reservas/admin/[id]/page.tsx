"use client";

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useParams, useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Calendar, User, Trophy, CreditCard, Clock } from 'lucide-react';
import { getBookingId, getFieldIdReservations } from '@/app/actions/bookings'; 
import { useUser } from '@/context/UserContext';
import { updateBookingAction } from '@/app/actions/bookings';



// Configuración de Dayjs
dayjs.extend(utc);
dayjs.extend(timezone);
const TIMEZONE = "America/Lima";

const EditReserva = () => {
  const router = useRouter();              
  const params = useParams();
  const bookingId = String(params.id || "");
  const { user } = useUser();

  // --- ESTADOS ---
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false); // Para el Skeleton
  const [isEditable, setIsEditable] = useState<Record<string, boolean>>({});
  
  const [baseDate, setBaseDate] = useState<string>(dayjs().tz(TIMEZONE).format('YYYY-MM-DD'));
  const [bookingsData, setBookingsData] = useState<any[]>([]);

  // --- 1. CARGA INICIAL DE LA RESERVA ---
  useEffect(() => {
    const loadBooking = async () => {
      const res = await getBookingId(bookingId);
      if (res.success) {
        setBooking(res.content);
        // Sincronizar fecha inicial con la reserva
        const reservationDate = dayjs(res.content.startTime).tz(TIMEZONE).format('YYYY-MM-DD');
        setBaseDate(reservationDate);
      }
      setLoading(false);
    };
    loadBooking();
  }, [bookingId]);

  // --- 2. CARGA DE RESERVAS DEL DÍA (Para disponibilidad) ---
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!booking?.fieldId?._id || !baseDate) return;
      setFetchingSlots(true);
      const res = await getFieldIdReservations(booking.fieldId._id, baseDate);
      if (res.status === 'success') {
        setBookingsData(res.data);
      }
      setFetchingSlots(false);
    };
    fetchAvailability();
  }, [baseDate, booking?.fieldId?._id]);

  // --- 3. LÓGICA DE SLOTS DISPONIBLES (Tu lógica de FieldCard) ---
  const getAvailableSlots = () => {
    const openTime = 8;
    const closeTime = 23;
    const slots = [];

    const nowInLima = dayjs().tz(TIMEZONE);
    const isSelectedDateToday = baseDate === nowInLima.format('YYYY-MM-DD');

    for (let hour = openTime; hour <= closeTime; hour++) {
      const timeLabel = `${hour.toString().padStart(2, '0')}:00`;

      // Verificamos si la hora ya pasó o es la hora actual (bloqueo inmediato)
      let isPast = false;
      if (isSelectedDateToday) {
        // Bloquea si la hora del slot es menor O IGUAL a la hora actual de Lima
        isPast = hour <= nowInLima.hour();
      }

      // Verificamos si está ocupada en el servidor
      const isOccupied = bookingsData?.some((b: any) => {
        const bookingHour = dayjs(b.startTime).tz(TIMEZONE).hour();
        return bookingHour === hour;
      });

      // La hora actual de la reserva SIEMPRE debe ser seleccionable aunque esté ocupada
      const isCurrentReservationSlot = booking?.startTime && dayjs(booking.startTime).tz(TIMEZONE).hour() === hour && isSelectedDateToday;

      slots.push({
        hour,
        label: timeLabel,
        // Disponible si no está ocupada y no ha pasado (o si es la reserva que estamos editando)
        available: ( !isOccupied && !isPast ) || isCurrentReservationSlot,
        reason: isOccupied ? 'OCUPADO' : (isPast ? 'PASADO' : 'LIBRE')
      });
    }
    return slots;
  };

  // --- COMPONENTES INTERNOS ---
  const SkeletonSlots = () => (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {[...Array(15)].map((_, i) => (
        <div key={i} className="h-10 w-full bg-brand-gray/50 animate-pulse rounded-xl border border-gray-100" />
      ))}
    </div>
  );

  // --- MANEJADORES ---
  const handleTimeSelection = (hour: number) => {
    // Creamos el nuevo ISO combinando el baseDate con la hora elegida en TZ Lima
    const newStartTime = dayjs.tz(`${baseDate} ${hour}:00`, "YYYY-MM-DD HH:mm", TIMEZONE).toISOString();
    setBooking({ ...booking, startTime: newStartTime });
  };

  /*  update */

  // ... dentro de tu componente EditReserva ...

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  // Preparamos la data que espera tu backend
  // Nota: Enviamos solo lo necesario para no sobrecargar el body
  const updateData = {
   /*  userId: {
      name: booking.userId.name,
      uid: booking.userId.uid
    }, */
   // fieldId: booking.fieldId._id,
    startTime: booking.startTime,
    // El backend calculará el endTime si es necesario, 
    // pero si lo necesitas puedes enviarlo también
  };

  const result = await updateBookingAction(bookingId, updateData);

  if (result.success) {
    alert("✅ ¡Excelente! Reserva actualizada."); // Aquí puedes usar Sonner o Toast
    router.push(`/${user?.slug}/dashboard/reservas`);
    router.refresh();
  } else {
    // Aquí se mostrará el mensaje: "No puedes editar con menos de 2 horas..."
    alert(`❌ Error: ${result.message}`);
  }
  
  setSaving(false);
};
/* bolea el boton si si an npasado menos de 2 horas */
const isTooLateToEdit = () => {
  if (!booking?.startTime) return false;
  const now = dayjs();
  const start = dayjs(booking.startTime);
  return start.diff(now, 'hour', true) < 2;
};



  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="animate-spin text-brand-gold" size={40} />
      <p className="text-[10px] font-black text-brand-black uppercase tracking-widest">Cargando Reserva...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-brand-black mb-6 font-black text-[10px] uppercase">
          <ArrowLeft size={14} /> Volver al control
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-brand-gray overflow-hidden">
          {/* Header Superior */}
          <div className="bg-brand-black p-8 text-white flex justify-between items-center">
            <div>
              <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">Editor Maestro</span>
              <h1 className="text-2xl font-black uppercase leading-tight">{booking?.userId?.name}</h1>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hidden md:block">
               <Calendar className="text-brand-gold" size={32} />
            </div>
          </div>

          <form className="p-8 md:p-12 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* SECCIÓN IZQUIERDA: DATOS */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titular de Reserva</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      value={booking?.userId?.name || ""}
                      onChange={(e) => setBooking({...booking, userId: {...booking.userId, name: e.target.value}})}
                      disabled={!isEditable.user}
                      className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 font-bold text-sm transition-all
                      ${isEditable.user ? 'border-brand-gold bg-white' : 'border-brand-gray bg-slate-50 text-slate-400'}`}
                    />
                    <button type="button" onClick={() => setIsEditable({...isEditable, user: !isEditable.user})} className="absolute right-4 top-1/2 -translate-y-1/2">
                      {isEditable.user ? '🔓' : '🔒'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cancha</label>
                  <div className="relative">
                    <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select disabled className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-brand-gray bg-slate-50 text-slate-400 appearance-none font-bold text-sm">
                      <option>{booking?.fieldId?.name}</option>
                    </select>
                  </div>
                </div>

                <div className="bg-brand-gray/20 p-6 rounded-3xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="bg-white p-3 rounded-xl shadow-sm text-brand-gold"><CreditCard /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Total Pagado</p>
                        <p className="text-xl font-black text-brand-black">S/ {booking?.totalPrice}</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* SECCIÓN DERECHA: TIEMPO (Aquí incluimos el TimeGrid mejorado) */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">1. Elegir Fecha</label>
                  <input
                    type="date"
                    value={baseDate}
                    min={dayjs().tz(TIMEZONE).format('YYYY-MM-DD')}
                    disabled={!isEditable.time}
                    onChange={(e) => setBaseDate(e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-brand-gray font-bold text-sm focus:border-brand-gold outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">2. Bloque Horario</label>
                    <button type="button" onClick={() => setIsEditable({...isEditable, time: !isEditable.time})} className="text-xs font-bold text-brand-gold uppercase underline">
                      {isEditable.time ? "Fijar Hora" : "Cambiar Hora"}
                    </button>
                  </div>

                  {fetchingSlots ? (
                    <SkeletonSlots />
                  ) : isEditable.time ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {getAvailableSlots().map((slot) => (
                        <button
                          key={slot.hour}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => handleTimeSelection(slot.hour)}
                          className={`py-3 rounded-xl border-2 text-[11px] font-black transition-all
                            ${dayjs(booking.startTime).tz(TIMEZONE).hour() === slot.hour 
                              ? 'bg-brand-black border-brand-black/40 text-brand-gold' 
                              : slot.available 
                                ? 'bg-white border-brand-gray hover:border-brand-gold text-brand-black hover:text-brand-white hover:bg-brand-gold' 
                                : 'bg-slate-100 border-slate-100 text-slate-300 opacity-50 cursor-not-allowed'}`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-brand-black rounded-2xl flex items-center justify-between text-brand-gold border-2 border-brand-gold/20">
                      <div className="flex items-center gap-3">
                        <Clock size={16} />
                        <span className="font-black text-sm uppercase">
                          {dayjs(booking?.startTime).tz(TIMEZONE).format('hh:00 A')}
                        </span>
                      </div>
                      <span className="text-[9px] font-black opacity-60">CONFIRMADO</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={saving || isTooLateToEdit()}
              title={isTooLateToEdit() ? "Límite de tiempo excedido" : "Guardar"}
              className="w-full bg-brand-black text-brand-gold font-black py-5 rounded-[2rem] flex items-center justify-center gap-4 hover:scale-[1.01] transition-all shadow-2xl disabled:opacity-50 uppercase tracking-[0.2em] text-xs mt-4"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              {saving ? "Procesando cambios..." : isTooLateToEdit() ? "Edición bloqueada (-2h)" : "Actualizar Reserva"} 
             
            </button>


          </form>
        </div>
      </div>
    </div>
  );
};

export default EditReserva;