
import { FilterTabs } from "@/components/reserva/FilterTabs";
import { DatePicker } from "@/components/reserva/DatePicker";
import { PaginationControls } from "@/components/reserva/PaginationControls";
import { getBookingsConFiltro } from "@/app/actions/bookings";

import {BookingType} from '@/types/booking'
import { BookingTable } from "@/components/dashboard/BookingTable";
import { getServerUser } from "@/app/actions/userServer";
import { redirect } from "next/navigation";

/* interface Booking {
  _id: string;
  startTime: string;
  fieldId: { name: string; location: string };
  userId: { name: string; email: string };
} */

interface Meta {
  totalResults: number;
  page: number;
  limit: number;
  appliedFilter: string;
}

interface ApiResponse {
  status: string;
  meta: Meta;
  data: BookingType;
}


export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
 
 const user = await getServerUser();
// 2. Validación de seguridad
  if (user?.role !== 'ADMIN' && user?.role !== 'USER') {
    
    // REDIRECCIÓN DE SERVIDOR
    // Nota: redirect() lanza un error interno de Next.js que detiene 
    // la ejecución del componente y manda al usuario a la nueva ruta.
    redirect(`/${user?.slug}/unauthorized`);
  }


  // 1. Esperamos a los parámetros de la URL
  const { filter, date, page } = await searchParams;

  // 2. Llamamos a tu Server Action
  const response = await getBookingsConFiltro(filter, date);
  
  const bookings = response.data || [];
  const meta = response.meta || { totalResults: 0, page: 1, limit: 12 };

      const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 text-brand-black">
      {/* Header & Filtros */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Panel de <span className="text-brand-gold">Reservas</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">Gestiona y visualiza los horarios de tus canchas.</p>
        </div>
        
        <div className="flex flex-wrap items-end gap-4">
          <DatePicker />
          <FilterTabs />
        </div>
      </header>

      {/* Tabla de Reservas */}
   {/*    <div className="bg-white border-2 border-brand-gray/50 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-black text-brand-gold uppercase text-[10px] font-black tracking-widest">
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Cancha</th>
              <th className="px-6 py-4 text-center">Fecha y Hora</th>
              <th className="px-6 py-4 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-brand-gray/30">
            {bookings.length > 0 ? (
              bookings.map((booking:BookingType) => (
                <tr key={booking._id} className="hover:bg-brand-gray/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-sm">{booking.userId.name}</div>
                    <div className="text-[10px] text-gray-400 uppercase">{booking.userId?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {booking.fieldId.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-brand-gray/40 px-3 py-1 rounded-full text-xs font-bold">
                      {formatTime(booking.startTime)+' de '}
                    </span>
                     <span className="bg-brand-gray/40 px-3 py-1 rounded-full text-xs font-bold">
                        {formatTime(booking.endTime)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                         
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-gray-400 font-bold italic">
                  No se encontraron reservas para este filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}
      <BookingTable 
        data={bookings}

      />


      {/* Paginación */}
      <div className="mt-8">
       {/*  <PaginationControls meta={meta} /> */}
         <PaginationControls 
                totalResults={meta.totalResults}
                totalPages={meta.totalPages}
                currentPage={meta.page}
                limit={meta.limit}
                />
      </div>
    </div>
  );
}