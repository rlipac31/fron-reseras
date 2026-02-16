//interfaces
import { BookingType } from '../../types/booking';
//icons
import { Clock, MapPin, User, Calendar, CreditCard, Mail } from 'lucide-react';
//routes
import Link from 'next/link';

export default function BookingCard({ booking }: { booking: BookingType }) {

   const slug = booking.businessId?.slug;
   console.log(" name bookind card ", booking)

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
const stateColors = {
    CONFIRMED: 'bg-green-500/10 text-green-600 border-green-500/20',
    PENDING:   'bg-brand-gold/10 text-brand-gold border-brand-gold/20',
    CANCELLED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    COMPLETED: 'bg-brand-black text-brand-white border-brand-black',
  };

  // 2. Mapeo de etiquetas amigables
  const stateLabels = {
    CONFIRMED: '● Confirmada',
    PENDING:   '○ Pendiente',
    CANCELLED: '✕ Cancelada',
    COMPLETED: '✓ Completada',
  };

  return (
    <div className="bg-brand-white rounded-xl border border-brand-gray shadow-sm overflow-hidden flex flex-col hover:border-brand-gold transition-all">


 {/* Indicador de Estado Superior */}
      <div className={`text-[11px] font-black py-1.5 px-4 border-b uppercase tracking-widest transition-colors ${stateColors[booking.state] || 'bg-brand-gray text-gray-500'}`}>
        {stateLabels[booking.state] || booking.state}
      </div>
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-brand-black text-lg leading-tight uppercase">
              {booking.fieldId?.name}
              
            </h3>
            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
              <MapPin size={12} />
              {booking.fieldId.location}
            </div>
          </div>
          <div className="text-right">
            <span className="block text-xs text-gray-400 font-bold uppercase">Total</span>
            <span className="text-xl font-black text-brand-black">S/ {booking.totalPrice}</span>
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
  {/*     <span className="text-[11px] font-bold text-gray-400 uppercase">
            duracion: {booking.durationInMinutes} min
          </span> */}
        <div className="mt-4 flex items-center justify-between  ">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-gray/20 flex items-center justify-center">
              <User size={18} className="text-brand-gold" />
            </div>
            <span className="text-xs font-medium text-gray-600 italic">{booking.userId.name}</span>
          </div>
        </div>
        <div className='flex  flex-row gap-1'>
            <Mail size={18} className="text-brand-gold" />
             <span className="text-xs font-medium text-gray-600 italic">{booking.userId?.email}</span> 
        </div>
          
         
      </div>

      {/* Acciones Rápidas */}
            <div className="bg-brand-gray/5 p-3">
            {booking.state === 'CONFIRMED' ? (
                /* VISTA CUANDO YA ESTÁ PAGADO/CONFIRMADO */
                <div className="w-full text-center px-2 py-2 bg-black/90 border border-success/20 rounded">
                <span className="text-[10px] font-black text-success uppercase tracking-widest">
                    ✓ Reserva Confirmada y Pagada
                </span>
                </div>
            ) : (
                /* VISTA CUANDO ESTÁ PENDIENTE */
                <div className="flex gap-2 w-full">
                {/*  <button 
                    className="flex-1 text-[10px] font-bold bg-brand-black text-brand-gold py-2 rounded uppercase hover:bg-brand-black/90 transition-all"
                >
                    Cancelar
                </button>

                <Link 
                    href={`/${booking.businessId.slug}/dashboard/reservas/pagar?bookingId=${booking._id}&amount=${booking.totalPrice}`}
                    className="flex-1"
                >
                    <button className="w-full text-[10px] font-bold bg-success/80 text-brand-black py-2 rounded uppercase hover:bg-success transition-all">
                    Pagar S/ {booking.totalPrice}
                    </button>
                </Link>  */}
                </div>
            )}
            </div>
    </div>
  );
}