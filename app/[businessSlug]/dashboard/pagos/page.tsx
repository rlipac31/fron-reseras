import { CalendarDays, FolderDot } from 'lucide-react';
import BookingCard from '@/components/reserva/BookingCard';
import { getBookingsConFiltro, getBookingsConPagination } from '@/app/actions/bookings';
import { DatePicker } from '@/components/reserva/DatePicker';
import { FilterTabs } from '@/components/reserva/FilterTabs';
import BtnRetry from '@/components/BtnRetry'
import { PaginationControls } from '@/components/reserva/PaginationControls';
import { PagosTable } from '@/components/pagos/PagosTable'
import { getServerUser } from '@/app/actions/userServer';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getPagosConFiltro } from '@/app/actions/payments';
import { dataPaymentType } from '@/types/payment'
import { MethodFilter } from '@/components/pagos/MethodFilter';
import { EmptyState } from '@/components/pagos/EmptyState';

export default async function PagosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; date?: string; method: string, page: string; limit: string }>;
}) {

  const user = await getServerUser();
  // 2. Validación de seguridad
  if (user?.role !== 'ADMIN' && user?.role !== 'USER') {
    console.log("user pagos page dnetro del if no autrizado", user)

    // REDIRECCIÓN DE SERVIDOR
    // Nota: redirect() lanza un error interno de Next.js que detiene 
    // la ejecución del componente y manda al usuario a la nueva ruta.
    redirect(`/${user?.slug}/unauthorized`);
  }
  console.log("user pagos page", user)



  const { filter, date, method, page, limit } = await searchParams;
  // const response = await getBookingsConPagination(filter, date, page, limit);

  // Ejecutamos la función que tiene el try/catch
  const { success, pagination, resumen, data, error } = await getPagosConFiltro(filter, date, method, page, limit);
  const pagos = data;

  console.log("pagos ", pagos, "error ", error, "succes   ", success);

  return (
    <div className="w-[98vw] space-y-6 animate-in fade-in duration-500 lg:max-w-full mx-auto p-2 md:p-4">

      {/* SECCIÓN DE RESUMEN (CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Global" value={resumen.totalGlobal} icon="💰" color="bg-brand-black text-brand-gold" symbol={user?.currency?.symbol} />
        <StatCard title="Vía Pago Movil" value={resumen.porYape} icon="📱" color="bg-white border border-brand-gray" symbol={user?.currency?.symbol} />
        <StatCard title="Efectivo" value={resumen.porEfectivo} icon="💵" color="bg-white border border-brand-gray" symbol={user?.currency?.symbol} />
        <StatCard title="Tarjetas" value={resumen.porTarjeta} icon="💳" color="bg-white border border-brand-gray" symbol={user?.currency?.symbol} />
      </div>

      <header className="flex flex-col gap-4 p-2 lg:gap-6 bg-white lg:p-6 rounded-2xl border border-brand-gray/50 shadow-sm">
        <div className='flex flex-row gap-2 items-center p-4 rounded-lg '>
          <h1 className="ml-[-15px] text-[16px] md:text-2xl font-black text-brand-black uppercase tracking-tighter flex items-center gap-2">
            <CalendarDays size={40} className="text-brand-gold" /> Control de Caja
          </h1>
          <p className="text-gray-400 text-xs font-medium">
            {pagination?.totalResults || 0} operaciones registradas
          </p>
        </div>
        <div className="flex flex-col items-start md:flex-row justify-between  md:items-center gap-4 mt-[-30px]">

          <MethodFilter />
          <div className="flex flex-row gap-6 md:gap-2 flex-nowrap items-center md:mt-[-26px] l">
            <div className="flex items-center">
              <FilterTabs />
            </div>
            <div className="translate-y-[2px]">
              <DatePicker />
            </div>
          </div>
        </div>


      </header>

      {/* TABLA */}
      <div className="bg-white rounded-2xl border border-brand-gray/50 overflow-hidden">
        {!error && pagos.length > 0 ? (
          <PagosTable datos={pagos} />
        ) : (
          <EmptyState />
        )}
      </div>

      <div className="border-t border-brand-gray/50 pt-4 flex justify-between items-center">
        <PaginationControls
          totalResults={pagination?.totalResults}
          totalPages={pagination?.totalPages}
          currentPage={pagination?.currentPage}
          limit={pagination?.limit}
        />

      </div>
    </div>
  );

  // Componente pequeño para las cards de arriba
  function StatCard({ title, value, icon, color, symbol }: any) {
    return (
      <div className={`p-5 w-[93vw] md:w-auto rounded-2xl shadow-sm flex items-center justify-between ${color}`}>
        <div>
          <p className="text-[10px] uppercase font-black opacity-70 tracking-widest">{title}</p>
          <p className="text-2xl font-black mt-1">{symbol || "S/"} {value.toLocaleString()}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    )
  }

}