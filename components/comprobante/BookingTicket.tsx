"use client";
import { useState } from "react";
import { Printer, Download, QrCode, CheckCircle2 } from "lucide-react";
import dayjs from "dayjs";





export default function BookingTicket({ booking }: { booking: any }) {

  const [isDownloading, setIsDownloading] = useState(false);
  
  const handlePrint = () => {
    window.print();
  };



  /*  logica para descargar comprobante */



  /*  fin de comprobante */
  

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto py-4">
      
      {/* CONTENEDOR DEL TICKET */}
      <div 
        id="printable-ticket" 
        className="bg-white text-slate-900 p-8 rounded-sm shadow-2xl w-full relative border-t-[12px] border-brand-gold print:shadow-none print:m-0"
      >
        {/* Agujeros laterales estéticos de ticket */}
        <div className="absolute -left-3 top-1/2 w-6 h-6 bg-brand-black rounded-full print:hidden"></div>
        <div className="absolute -right-3 top-1/2 w-6 h-6 bg-brand-black rounded-full print:hidden"></div>

        <div className="text-center space-y-1 mb-6 border-b border-dashed border-slate-300 pb-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">{booking.business || 'ARENA PROMETEO'}</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comprobante de Reserva</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Cancha</span>
            <span className="text-sm font-black text-right text-[14px] ">{booking?.campoName || 'Cancha Premium 66'}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Fecha</span>
            <span className="text-sm font-bold text-[10px] uppercase ">{booking.fechaJuego}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Horario</span>
            <span className="text-sm font-bold text-[10px] uppercase">
              {booking.horaInicio} - {booking.horaFin}
            </span>
          </div>
           <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Duracion</span>
            <span className="text-sm font-bold text-[10px] uppercase">
              {booking.duracion} minutos
            </span>
          </div>

           <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Cliente</span>
            <span className="text-sm font-bold text-[10px] uppercase">
              {booking.cliente}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Precio</span>
            <span className="text-sm font-bold text-[10px] uppercase">
              S/{booking.precio}  
            </span>
          </div>
            <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Descuento</span>
            <span className="text-sm font-bold text-[10px] uppercase">
              {booking.descuento}%
            </span>
          </div> 
           <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Metodo de Pago</span>
            <span className="text-sm font-bold text-[10px] uppercase">
              {booking.metodoPago}
            </span>
          </div>
            <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Fecha De Pago</span>
            <span className="text-sm font-bold text-[9.5px] uppercase">
              {booking.fechaPago} - {booking.horaPago}
            </span>
          </div> 
         

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Referencia</span>
            <span className="text-sm font-mono font-bold tracking-tighter">
                #{booking.ref.slice(-10).toUpperCase() ||  'PROMETEO-X'}
                
            </span>
          </div>

          <div className="pt-6 border-t border-dashed border-slate-300">
            <div className="flex justify-between items-end">
                <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Estado</span>
                    <div className="flex items-center gap-1 text-green-600 font-black text-xs uppercase">
                        <CheckCircle2 size={14} /> Confirmado
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Pagado</span>
                    <span className="text-3xl font-black">S/ {booking.total}</span>
                </div>
            </div>
          </div>
        </div>

        {/* QR de Validación Simulado */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-2">
          <div className="bg-slate-100 p-3 rounded-lg">
             <QrCode size={80} className="text-slate-800" />
          </div>
          <p className="text-[8px] text-slate-400 font-bold uppercase text-center leading-tight">
            Escanee este código en la entrada<br/>para validar su acceso.
          </p>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex gap-3 w-full print:hidden">
        <button 
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 bg-brand-gold text-brand-black font-black py-4 rounded-2xl text-xs uppercase hover:bg-white transition-all shadow-lg active:scale-95"
        >
          <Printer size={18} /> Imprimir
        </button>

      </div>
    </div>
  );
}