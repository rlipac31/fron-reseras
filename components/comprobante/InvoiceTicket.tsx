"use client";
import React from 'react';
import { Ticket, MapPin, Calendar, Clock, User, CreditCard } from 'lucide-react';

interface InvoiceProps {
  data: any; // Aquí pasas el objeto de tu API
}

export const InvoiceTicket = React.forwardRef<HTMLDivElement, InvoiceProps>(({ data }, ref) => {
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('es-PE', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <div ref={ref} className="p-8 bg-brand-white text-brand-black max-w-2xl mx-auto shadow-2xl print:shadow-none print:p-0">
      {/* Header Estilo Arena Prometeo */}
      <div className="flex justify-between items-start border-b-2 border-brand-gold pb-6 mb-6">
        <div>
          <h1 className="text-4xl font-black italic text-brand-black uppercase leading-none">
            Arena <span className="text-brand-gold print:text-black">Prometeo</span>
          </h1>
          <p className="text-xs text-brand-gray font-bold mt-1 uppercase tracking-tighter">
            {data.businessId.description}
          </p>
        </div>
        <div className="text-right">
          <div className="bg-brand-black text-brand-gold px-4 py-2 font-bold text-sm rounded-lg print:bg-white print:text-black print:border">
            NOTA DE VENTA
          </div>
          <p className="text-xs font-mono mt-2 text-brand-gray">ID: {data._id.toUpperCase()}</p>
        </div>
      </div>

      {/* Info Cliente y Pago */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase text-brand-gold mb-2 tracking-widest print:text-black">Cliente</h3>
          <div className="space-y-1">
            <p className="font-bold flex items-center gap-2"><User size={14} /> {data.nameCustomer}</p>
            <p className="text-sm text-brand-gray italic">DNI: {data.dniCustomer}</p>
          </div>
        </div>
        <div>
          <h3 className="text-[10px] font-black uppercase text-brand-gold mb-2 tracking-widest print:text-black">Detalles del Pago</h3>
          <div className="space-y-1 text-sm">
            <p className="flex items-center gap-2"><Calendar size={14} /> {formatDate(data.paymentDate)}</p>
            <p className="flex items-center gap-2 uppercase"><CreditCard size={14} /> {data.paymentMethod}</p>
          </div>
        </div>
      </div>

      {/* Detalle de la Reserva */}
      <div className="bg-brand-gray/10 rounded-xl p-6 mb-8 print:bg-white print:border">
        <h3 className="text-[10px] font-black uppercase text-brand-gold mb-4 tracking-widest print:text-black">Servicio</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl font-bold italic uppercase">{data.businessId.name}</p>
            <p className="text-sm text-brand-gray flex items-center gap-1">
              <MapPin size={12} /> Localidad: Surquillo
            </p>
          </div>
          <div className="text-right">
             <p className="text-xs font-bold text-brand-gray uppercase italic">Bloque Horario</p>
             <p className="font-mono font-bold text-lg">04:00 PM - 05:00 PM</p>
          </div>
        </div>
      </div>

      {/* Cálculos Finales */}
      <div className="border-t border-brand-gray/20 pt-6">
        <div className="flex flex-col gap-2 w-full max-w-[200px] ml-auto">
          <div className="flex justify-between text-sm">
            <span className="text-brand-gray uppercase font-bold text-[10px]">Subtotal</span>
            <span className="font-mono">S/ {data.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-red-600 font-bold">
            <span className="uppercase text-[10px]">Descuento</span>
            <span className="font-mono">- S/ {data.descuento.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center border-t-2 border-brand-gold pt-2 mt-2 print:border-black">
            <span className="text-brand-black font-black uppercase italic">Total</span>
            <span className="text-2xl font-black font-mono text-brand-black">S/ {data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center border-t border-dashed border-brand-gray/30 pt-6">
        <p className="text-[10px] text-brand-gray uppercase tracking-widest font-bold">
          Gracias por confiar en Arena Prometeo • www.arenaprometeo.com
        </p>
      </footer>
    </div>
  );
});

InvoiceTicket.displayName = "InvoiceTicket";