import { CalendarDays, FolderDot } from 'lucide-react';
import BookingCard from '@/components/reserva/BookingCard';
import { getBookingsConFiltro, getBookingsConPagination } from '@/app/actions/bookings';
import { DatePicker } from '@/components/reserva/DatePicker';
import { FilterTabs } from '@/components/reserva/FilterTabs';
import BtnRetry from '@/components/BtnRetry'
import { PaginationControls } from '@/components/reserva/PaginationControls';
import { getServerUser } from '@/app/actions/userServer';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; date?: string; page:string; limit:string }>;
}) {

  const user = await getServerUser();
// 2. Validación de seguridad
  if (user?.role !== 'ADMIN' && user?.role !== 'USER') {
    
    // REDIRECCIÓN DE SERVIDOR
    // Nota: redirect() lanza un error interno de Next.js que detiene 
    // la ejecución del componente y manda al usuario a la nueva ruta.
    redirect(`/${user?.slug}/unauthorized`);
  }

  // En Next.js 15+, searchParams es una Promise
 // const { filter, date } = await searchParams;
  const { filter, date, page, limit } = await searchParams;
 // const response = await getBookingsConPagination(filter, date, page, limit);

  // Ejecutamos la función que tiene el try/catch
  const { data, meta, error } = await getBookingsConPagination(filter, date, page, limit);
  const bookings= data;
/* 
  */
  return (
    <div className="space-y-8 animate-in fade-in duration-500 w-[98vw] md:w-[65vw] lg:w-[75vw]  xl:ml-[0px] md:ml-[-25px]  lg:ml-[-30px] ">
    
      <header className="flex flex-col justify-between items-start  gap-2 bg-white p-6 rounded-2xl border border-brand-gray/50 shadow-sm">
            <div className='flex flex-col md:flex-row  gap-2 justify-between items-center p-4 rounded-lg md:w-full '>
              
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="text-brand-gold" size={24} />
                <h1 className="text-[16px] md:text-2xl font-black text-brand-black uppercase tracking-tighter">
                  Gestión de Reservas 
                </h1>
              </div>
              
              <p className="text-gray-500 text-xs font-medium">
                Filtro actual: <span className="text-brand-black uppercase">{meta?.appliedFilter || 'Hoy'}</span> 
                — {meta?.totalResults || 0} registros encontrados.
              </p>

               {  user?.role && user?.role =='ADMIN' &&(
                <Link href={`/${user?.slug}/dashboard/reservas/admin`}>
                    <button className="flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold/90
                     text-brand-black font-bold  px-2 py-1 text-xs md:text-[16px] md:py-2.5 md:px-6 rounded-lg transition-all shadow-sm active:scale-95">
                      <FolderDot size={20} />
                      Administar Reservas
                    </button>
                  </Link> 
            )}
              
            </div>
        
       <div className='h-full flex fle-col md:flex-row md:w-full md:items-center items-end-safe justify-between gap-2'>
        
             
                <FilterTabs />
         
    
               <DatePicker />
        
            

          
        
          </div>     
       

   
      </header>

    

      {/* 1. MOSTRAR ERROR AMIGABLE SI EXISTE */}
      {error && (
      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4">
        <p className="text-red-500 text-xs">{error}</p>
        <BtnRetry /> {/* El componente de cliente sí permite el onClick */}
      </div>
    )}

      {/* Grid de Reservas */}
  {/*     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 border-4"> */}
<div className="flex flex-row flex-wrap gap-2 lg:gap-4  items-center md:items-center sm:justify-between ">  
        {!error && bookings.length > 0 ? (
          bookings.map((booking: any) => (
            <BookingCard key={booking._id} booking={booking} />
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-brand-gray/5 rounded-3xl border-2 border-dashed border-brand-gray/50">
            <div className="inline-flex p-4 bg-white rounded-full mb-4 shadow-sm">
              <CalendarDays className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-500 font-bold">No se encontraron reservas.</p>
            <p className="text-gray-400 text-xs mt-1">Intenta cambiando los filtros o la fecha seleccionada.</p>
          </div>
        )}
      </div>

          {/* SECCIÓN DE PAGINACIÓN */}
            {bookings?.length > 0 && (
                <PaginationControls 
                totalResults={meta.totalResults}
                totalPages={meta.totalPages}
                currentPage={meta.page}
                limit={meta.limit}
                />
            )}
    </div>
  );
}