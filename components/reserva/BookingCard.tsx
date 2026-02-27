"use client";
import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { BookingType } from '../../types/booking';
import { cancelBookingAction } from '@/app/actions/bookings';
//icons
import {
  Clock, MapPin, User, Calendar, CreditCard, IdCard,
  Trash2, Edit2, Loader2, AlertTriangle, X, CheckCircle
} from 'lucide-react';
//routes
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

export default function BookingCard({ booking }: { booking: BookingType }) {
  const { user } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const slug = booking.businessId?.slug || user?.slug;

  console.info("booking", booking);

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const stateColors: any = {
    CONFIRMED: 'bg-brand-black text-brand-gold border-green-500/20',
    PENDING: 'bg-brand-gold text-brand-black border-brand-gold/20',
    CANCELLED: 'bg-red-500/10 text-red-600 border-red-500/20',
    COMPLETED: 'bg-brand-black text-brand-white border-brand-black',
  };

  const stateLabels: any = {
    CONFIRMED: '● Confirmada',
    PENDING: '○ Pendiente',
    CANCELLED: '✕ Cancelada',
    COMPLETED: '✓ Completada',
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await cancelBookingAction(booking._id);
      if (res.success) {
        setShowCancelModal(false);
        router.refresh();
      } else {
        alert(res.message);
      }
    } catch (error) {
      alert("Error al intentar cancelar la reserva");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToEdit = () => {
    router.push(`/${slug}/dashboard/reservas/admin/${booking._id}`);
  };

  const isTooLateToEdit = () => {
    if (!booking?.startTime) return false;
    const now = dayjs();
    const start = dayjs(booking.startTime);
    return start.diff(now, 'hour', true) < 2;
  };

  return (
    <>
      <div className="w-full md:w-[17rem] bg-brand-white rounded-xl border border-brand-gray shadow-sm overflow-hidden
       flex flex-col hover:border-brand-gold transition-all animate-in fade-in duration-300">

        {/* Indicador de Estado Superior */}
        <div className={`text-[11px] font-black py-1.5 px-4 border-b uppercase tracking-widest transition-colors ${stateColors[booking.state] || 'bg-brand-gray text-gray-500'}`}>
          {stateLabels[booking.state] || booking.state}
        </div>

        <div className="p-5 flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-brand-black truncate text-[15px] leading-tight uppercase">
                {booking.fieldId?.name}
              </h3>
              <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                <MapPin size={12} />
                {booking.fieldId.location}
              </div>
            </div>
            <div className="text-right">
              <span className="block text-xs text-gray-400 font-bold uppercase">Total</span>
              <span className="text-[16px] font-black text-brand-black">{user?.currency?.symbol || "S/"} {booking.totalPrice}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-brand-gray/50 border-dashed">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                <Calendar size={10} /> Fecha
              </span>
              <p className="text-sm font-semibold text-brand-black">{formatDate(booking.startTime)}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                <Clock size={10} /> Horario
              </span>
              <p className="text-sm font-semibold text-brand-black">
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </p>
            </div>
          </div>

          <div className='flex flex-col items-start gap-2 mt-4'>
            <div className="flex flex-row items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-gray/20 flex items-center justify-center">
                <User size={16} className="text-brand-gold" />
              </div>
              <span className="text-[11px] font-bold text-gray-600 tracking-tigh capitalize">
                {booking?.customerName}
              </span>
            </div>
            <div className='flex flex-row gap-2 items-center'>
              <div className="w-8 h-8 rounded-full bg-brand-gray/20 flex items-center justify-center">
                <IdCard size={16} className="text-brand-gold" />
              </div>
              <span className="text-xs font-medium text-gray-400">{booking?.customerDNI}</span>
            </div>
          </div>
        </div>
        {/* Acciones Rápidas */}


        <div className="bg-brand-gray/5 p-3 mt-auto">
          {booking.state === 'CANCELLED' ? (
            <div className="w-full text-center px-2 py-2 bg-red-50 border border-red-100 rounded-lg">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                ✕ Reserva Cancelada
              </span>
            </div>
          ) : booking.state === 'COMPLETED' ? (
            <div className="w-full text-center px-2 py-2 bg-brand-black rounded-lg">
              <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest">
                ✓ Reserva Completada
              </span>
            </div>
          ) : (
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-black bg-white border-2 border-brand-gray text-gray-400 py-2.5 rounded-xl uppercase hover:border-red-500 hover:text-red-500 transition-all active:scale-95"
              >
                <Trash2 size={14} /> Cancelar
              </button>

              <button
                onClick={() => setShowEditModal(true)}
                className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-black bg-brand-black text-brand-gold py-2.5 rounded-xl uppercase hover:bg-brand-black/90 transition-all active:scale-95 shadow-md"
              >
                <Edit2 size={14} /> Editar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL CANCELAR --- */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-brand-black/80 backdrop-blur-sm z-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="bg-red-600 p-8 text-center relative">
              <button
                onClick={() => setShowCancelModal(false)}
                className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Trash2 size={40} className="text-red-600" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight">
                ¿Cancelar Reserva?
              </h3>
            </div>
            <div className="p-8 text-center space-y-6">
              <div className="space-y-2">
                <p className="text-slate-500 text-sm font-medium leading-normal">
                  Esta acción liberará el espacio de la cancha
                  <span className="block font-black text-brand-black text-base uppercase mt-1 italic">
                    {booking.fieldId?.name}
                  </span>
                </p>
                <div className="flex items-center justify-center gap-2 text-red-500 bg-red-50 py-2 rounded-xl border border-red-100 mt-4">
                  <AlertTriangle size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Advertencia Irreversible</span>

                </div>
                <span className="bg-brand-black text-brand-gold p-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Advertencia: El pago tambien quedara eliminado!</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-4 border-2 border-brand-gray rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                >
                  Regresar
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-4 bg-red-600 text-white rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL EDITAR (ADVERTENCIA) --- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-brand-black/80 backdrop-blur-sm z-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="bg-brand-black p-8 text-center relative border-b-4 border-brand-gold">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl border-4 border-white">
                <Edit2 size={40} className="text-brand-black" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight">
                Modo Edición
              </h3>
            </div>
            <div className="p-8 text-center space-y-6">
              <p className="text-slate-500 text-sm font-medium leading-normal">
                Vas a entrar al administrador de la reserva. Ten en cuenta que solo puedes modificar el horario si el nuevo bloque está <span className="text-brand-black font-black italic">DISPONIBLE</span>.
              </p>

              <div className="flex items-center gap-3 bg-brand-gold/10 p-4 rounded-2xl border border-brand-gold/20 text-left">
                <div className="text-brand-gold"><Clock size={20} /></div>
                <p className="text-[10px] font-bold text-gray-700 leading-tight uppercase">
                  No podrás guardar cambios si faltan menos de 2 horas para el inicio.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-4 border-2 border-brand-gray rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGoToEdit}
                  disabled={isTooLateToEdit()}
                  className={`px-4 py-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg ${isTooLateToEdit()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-300 shadow-none'
                    : 'bg-brand-black text-brand-gold hover:bg-brand-black/90'
                    }`}
                >
                  {isTooLateToEdit() ? "Bloqueado" : "Proceder"} <CheckCircle size={14} />
                </button>
              </div>
              {isTooLateToEdit() && (
                <p className="text-[9px] text-red-500 font-black uppercase mt-4 animate-pulse">
                  ⚠️ Tiempo límite excedido (-2h)
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}