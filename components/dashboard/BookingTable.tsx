// BookingTable.tsx
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';

import { BookingType } from '@/types/booking'
import { useUser } from '@/context/UserContext';
import { FilePenLine, Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { cancelBookingAction } from '@/app/actions/bookings'


const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Fecha no disponible";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Fecha inválida"; // Validación por si el string no es fecha

  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export function BookingTable({ data }: { data: BookingType[] }) {
  const { user } = useUser();
  //console.log("data desde table booking ", data[0])


  // 1. Tipado de estados
  const [bookings, setBookings] =  useState<BookingType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [updateState, setUpdateState] = useState<BookingType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActivo, setIsActivo] = useState(false);

  // 2. Validación de Seguridad Correcta
  // Nota: useEffect se encarga de la lógica, pero el renderizado se bloquea aquí
  if (user && user.role !== 'ADMIN') {
    //notFound(); 
    return null;
  }




  const handleUpdateState = async () => {
    if (!updateState?._id) return;
    setIsActivo(true);

    try {
      const res = await cancelBookingAction(updateState._id);


      if (res?.success) {
        setBookings((prevBookings:any) =>
          prevBookings.map((c:BookingType) =>
            c._id === updateState._id ? { ...c, state: !c.state } : c
          )
        );
        setUpdateState(null);
      } else {
        alert(res.message || "Error al cambiar el estado");
      }
    } catch (err) {
      console.error("Error en handleUpdateState:", err);
    } finally {
      setIsActivo(false);
    }
  };



  const stateStyles = {
    PENDING: "bg-gray-400 text-white",
    CONFIRMED: "bg-brand-gold text-brand-black hover:bg-amber-500 transition-colors cursor-pointer",
    CANCELLED: "bg-brand-black text-brand-gold",
    COMPLETED: "bg-green-600 text-white",
  };

  const stateLabels = {
    PENDING: "PENDIENTE",
    CONFIRMED: "CONFIRMADO",
    CANCELLED: "CANCELADO",
    COMPLETED: "COMPLETADO",
  };

  return (
    <div className="bg-brand-white rounded-xl shadow-sm border border-brand-gray p-6 lg:col-span-2">
      <h3 className="font-bold text-lg mb-4 text-brand-black">Últimos Alquileres</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-brand-gray text-gray-400 text-sm">
              <th className="pb-3 font-medium">Cliente</th>
              <th className="pb-3 font-medium">Cancha</th>
              <th className="pb-3 font-medium">Horario</th>
              <th className="pb-3 font-medium">Estado</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray/50">
            {data.map((row, i) => (
              <tr key={i}>
                <td className="py-4 text-sm font-semibold text-brand-black">{row.userId.name}</td>
                <td className="py-4 text-sm text-gray-600">{row.fieldId.name}</td>
                <td className="py-4 text-sm text-gray-600">
                 
                 <div className="text-gray-400 font-mono">{' De: ' + formatTime(row.startTime) + ' A:  ' + formatTime(row.endTime)} </div>
                  <div className="text-[11px] text-gray-400 font-mono">Dia: {formatDate(row.startTime)}</div>
                  </td>
                <td className="py-4">
          
                  <span
                    onClick={() => setUpdateState(row)}
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm transition-all duration-300 ${
                      // Buscamos el estilo en nuestro objeto, si no existe ponemos uno gris por defecto
                      stateStyles[row.state as keyof typeof stateStyles] || 'bg-slate-200 text-slate-500'
                      }`}
                  >
                    {stateLabels[row.state as keyof typeof stateLabels] || row.state}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link href={`/${user?.slug}/dashboard/reservas/admin/${row._id}`}>
                      <button title="Editar" className="p-2 text-brand-black hover:bg-yellow-50 rounded-lg transition-colors cursor-pointer">
                        <FilePenLine size={22} />
                      </button>
                    </Link>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* --- MODAL DE CONFIRMACIÓN UPDATE STATE (Se renderiza solo si se va acambniar el estado) --- */}
      {updateState && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-black text-brand-gold rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-brand-black">¿Estás seguro?</h3>
              <p className="text-gray-500 text-sm mt-2">
                Vas a cambiar de estado de este campo <strong className='text-brand-black font-medium text-base'>{updateState?.fieldId.name}</strong>.
                Esta acción no se puede deshacer y podrias eliminar las reservas vinculadas a este campo.
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setUpdateState(null)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateState}
                disabled={isActivo}
                className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                 ${updateState?.state
                    ? 'bg-red-600 hover:bg-red-700 text-white' // Si está activo, el botón es para desactivar (rojo)
                    : 'bg-brand-gold hover:bg-amber-500 text-brand-black' // Si está inactivo, es para activar (dorado)
                  }`}
              >
                {isActivo ? (
                  <Loader2 className="animate-spin border-2" size={18} />
                ) : (
                  <>
                    {updateState?.state ? 'Sí, desactivar' : 'Sí, activar'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}