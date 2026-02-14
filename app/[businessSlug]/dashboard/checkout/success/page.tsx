"use client";

import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ReceiptText, Clock, Hash, Share2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { SearchParams } from "next/dist/server/request/search-params";
//componente comprobante
import BookingTicket from '@/components/comprobante/BookingTicket'

//para boton compartir 
import dayjs from "dayjs";

function SuccessContent() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();


  //const [ dataTikeck, setDatatikeck ] = useState<any>(null)

  const business = searchParams.get("business");
  const campo = searchParams.get("campo") || "Cancha"; ("campo");
  const cliente = searchParams.get("cliente");
  const precio = searchParams.get("precio");
  const descuento = searchParams.get("descuento");
  const total = searchParams.get("total");
  const inicio = searchParams.get("inicio");
  const fin = searchParams.get("fin");
  const duracion = searchParams.get("duracion");
  const metodoPago = searchParams.get("metodoPago");
  const fechaPago = searchParams.get("fechaPago");
  const ref = searchParams.get("ref");



  /* useEffect(() => {
     const loadTikeck = ()=>{
         
     }
     loadTikeck() 
   }, [searchParams]) */



  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  //date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const horaInicio = formatTime(inicio);
  const fechaJuego = formatDate(inicio);
  const horaFin = formatTime(fin);
  const fechaDePago = formatDate(fechaPago);
  const horaPago = formatTime(fechaPago)

  /*  useEffect(() => {
     const timer = setTimeout(() => {
       router.push(`/${user?.slug}/dashboard/campos`);
     }, 15000);
 
     return () => clearTimeout(timer);
   }, [router]); */
  //////////
  /*  Boton compartir*/

  const handleShare = async () => {
    // Formateamos los datos para el mensaje
    //  const formattedDate = dayjs().format('dddd D [de] MMMM');
    const shareData = {
      title: '¡Cancha Reservada! ⚽',
      text:
        `Hola Gente soy: ${cliente} y reserve la` +
        ` ${campo}\n` +
        ` para el dia  ${fechaJuego}\n` +
        ` Desde ${horaInicio} hasta las: ${horaFin} ...\n\n` +
        ` ¡Puntuales por favor!!!`,
      url: window.location.origin // O un link específico si lo tienes
    };

    try {
      // Si el navegador soporta el menú nativo (Móviles/Safari)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback para PC (WhatsApp Web)
        const waMessage = encodeURIComponent(shareData.text);
        window.open(`https://wa.me/?text=${waMessage}`, '_blank');
      }
    } catch (err) {
      console.log('El usuario canceló el compartir o hubo un error');
    }
  };

  const dataTikeck = {
    business: business || '',
    campoName: campo || '',
    cliente: cliente || '',
    precio: precio || '',
    descuento: descuento || '',
    total: total || '',
    inicio: inicio || '',
    fin: fin || '',
    duracion: duracion || '',
    metodoPago: metodoPago || '',
    fechaPago: fechaDePago || '',
    horaPago:horaPago || '',
    ref: ref || '',
    // Agregamos los ya formateados para que el ticket sea legible
    horaInicio,
    horaFin,
    fechaJuego
  };


  /* fin boton compartir */

  return (
    <div className="bg-brand-white/5 p-2  md:p-8 rounded-2xl border border-brand-gold/20 text-center max-w-md w-full animate-in fade-in zoom-in duration-500">
      <div className="flex justify-center mb-6">
        <div className="bg-brand-gold/10 p-4 rounded-full">
          <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16  text-brand-gold" />
        </div>
      </div>

      <h1 className="text-xl md:2xl lg:text-3xl  font-bold text-brand-white mb-2 italic uppercase">
        ¡Reserva Confirmada!
      </h1>
      <h2 className="text-xl md:text-2xl font-bold text-brand-white mb-2 italic uppercase">{business}</h2>

      {/* Ticket de Reserva Estilo "Arena Prometeo" */}
      <div className="bg-brand-black/80 rounded-xl p-5 mb-8  border-white/10 text-left space-y-4 relative">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-brand-gold text-[10px] uppercase font-black tracking-widest">Cancha</p>
            <p className="text-brand-white font-bold">{campo}</p>
            <p className="text-brand-gold text-[10px] uppercase font-black tracking-widest">Cliente</p>
            <p className="text-brand-white font-medium text-[12px] md:text-[15px]">{cliente}</p>
          </div>
          <ReceiptText size={20} className="text-brand-white/20" />
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
          <div>
            <p className="text-brand-gold text-[10px] uppercase font-black tracking-widest flex items-center gap-1">
              <Clock size={10} /> Horario
            </p>
            <p className="text-brand-white text-sm">Inicio:{formatTime(inicio) || "Por confirmar"}</p>
            <p className="text-brand-white text-sm">Fin: {formatTime(fin) || "Por confirmar"}</p>
            <p className="text-brand-white text-sm">duracion: {duracion || "Por confirmar"} minutos</p>
          </div>
          <div>
            <p className="text-brand-gold text-[10px] uppercase font-black tracking-widest flex items-center gap-1">
              <Hash size={10} /> Referencia
            </p>
            <p className="text-brand-white text-sm font-mono">{ref?.slice(0, 12).toUpperCase() || "N/A"}</p>
            <p className="text-brand-white text-sm font-mono">Precio: S/{precio || "0.0"}</p>
            <p className="text-brand-white text-sm font-mono">Descuento {descuento || "0.0"}%</p>
          </div>
        </div>
        <div>
          <p className="text-brand-white font-medium uppercase   text-[12px] md:text-[14px]">Fecha De Pago: {formatDate(fechaPago)}</p>
          <p className="text-brand-gold font-medium uppercase text-[12px] md:text-[14px]">Metodo De Pago: {metodoPago}</p>
        </div>
        <div className="border-t border-dashed border-white/20 pt-4 flex justify-between items-center">
          <p className="text-brand-white font-bold uppercase text-xs">Total Pagado</p>
          <p className="text-brand-gold font-black text-xl">S/ {total}</p>
        </div>
      </div>

      {/* Barra de progreso y redirección */}
      <div className="space-y-3">
        <div className="h-1 w-full bg-brand-black rounded-full overflow-hidden">
          <div className="h-full bg-brand-gold animate-loading-slide"></div>
        </div>
        <p className="text-[10px] text-brand-gray uppercase tracking-widest animate-pulse">
          Generando tu pase de entrada...
        </p>
      </div>


        // ... en tu JSX bton compartir ...
      <button
        onClick={handleShare}
        className="w-full group flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-gray-300 font-bold py-4 rounded-2xl text-[11px] uppercase tracking-widest hover:bg-white/10 hover:text-brand-gold transition-all duration-300"
      >
        <div className="p-2 rounded-full bg-brand-gold/10 text-brand-gold group-hover:scale-110 transition-transform">
          <Share2 size={18} />
        </div>
        Compartir con mi equipo
      </button>

      <BookingTicket booking={dataTikeck} />
    </div>



  );
}

// ... mantener el export default SuccessPage con Suspense igual que antes
export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center p-4  rounded-xl">
      <Suspense fallback={
        <div className="text-brand-gold animate-pulse uppercase font-bold tracking-widest">
          Cargando...
        </div>
      }>

        <SuccessContent />



      </Suspense>
    </div>
  );
}