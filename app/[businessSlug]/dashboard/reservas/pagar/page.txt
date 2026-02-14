

import PaymentFormPendiente from '@/components/pagos/PaymentFormPendiente';


// 1. Definimos la interfaz para que TypeScript sepa que es una Promesa
interface PageProps {
  searchParams: Promise<{ bookingId?: string; amount?: string }>;
}

// 2. La función debe ser async
export default async function PagosPage({ searchParams }: PageProps) {
  
  // 3. ¡IMPORTANTE! Esperamos a que los searchParams se resuelvan
  const params = await searchParams;
  const bookingId = params.bookingId;
  const amount = params.amount;

 // console.log("promesas page:  ", params, bookingId, amount)

  return (
    <div className="min-h-[80vh]  flex flex-col items-center justify-center ">
      
      {bookingId && amount ? (
        <PaymentFormPendiente bookingId={bookingId} amount={Number(amount)} />
      ) : (
        <div className="text-center bg-brand-white p-10 rounded-xl border border-brand-gray">
          <p className="text-gray-400">Datos de reserva no encontrados.</p>
          <a href="/dashboard/reservas" className="text-brand-gold font-bold underline mt-4 block">
            Volver a Reservas
          </a>
        </div>
      )}
    </div>
  );
}