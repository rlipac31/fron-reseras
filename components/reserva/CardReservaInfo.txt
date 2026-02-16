"use client";
import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation'; // IMPORTANTE: next/navigation
import Link from 'next/link';
import { cancelBookingAction } from '../../app/actions/bookings'
import { useUser } from '@/context/UserContext';
//para notificaciuones
import { toast } from 'sonner'; // Importamos toast

// Definimos la interfaz para los datos que recibes
interface BookingResponse {
 
  _id: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  state: string;
  durationInMinutes: number;
  [key: string]: any; // Por si llegan más campos de la API
}

interface BookingCardProps {
  data: BookingResponse;
  nameField?: any; // Add this line
  userToken:string;
}


export  const BookingCardInfo: React.FC<BookingCardProps> = ({ data, nameField, userToken }) => {
  const [isPending, startTransition] = useTransition();
  const { user }= useUser();
  const router = useRouter();
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  const id = data?._id;



const handleCancel = () => {
 const token = userToken;
    // Definimos la promesa de la Server Action
    const promise = () => new Promise(async (resolve, reject) => {
      const result = await cancelBookingAction(data._id, token);
      if (result.success) {
        resolve(result);
        router.push(`/${user?.slug}/dashboard/campos`);
      } else {
        reject(new Error(result.message));
      }
    });

    // Disparamos el toast con los tres estados
    toast.promise(promise, {
      loading: 'Cancelando tu reserva...',
      success: (data: any) => `${data.message}`,
      error: (err) => `Error: ${err.message}`,
    });
  };


  const formatDate = (date: Date) => 
    date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const formatTime = (date: Date) => 
    date.toLocaleTimeString('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true }).replace(/\./g, '');

  return (
    <div className="bg-brand-black border border-brand-gray/10 rounded-2xl shadow-xl p-6 max-w-lg mx-auto overflow-hidden text-brand-white">
      {/* Estado */}
    {/*   <div className="flex justify-end mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-gold text-brand-black">
          {data.state === 'PENDING' ? 'PENDIENTE' : data.state}
        </span>
      </div> */}

      <div className="space-y-6">
        {/* Fecha Principal */}
        <div>
          <span className='font-medium mb-2'><strong className='text-xs font-medium text-brand-gray/60 uppercase   tracking-widest'> </strong> {nameField}</span>
          <p className="text-brand-gray/60 text-xs font-medium uppercase tracking-widest">Reserva confirmada para</p>
          <h2 className="text-base font-bold capitalize mt-1">
            {formatDate(start)}
          </h2>
        </div>

        {/* Horarios */}
        <div className="grid grid-cols-2 gap-px bg-brand-gray/10 rounded-xl overflow-hidden border border-brand-gray/10">
          <div className="bg-brand-black p-4">
            <p className="text-[7px] md:text-[10px] text-brand-gold uppercase font-bold">Inicio</p>
            <p className="text-lg font-bold">{formatTime(start)}</p>
          </div>
          <div className="bg-brand-black p-4 border-l border-brand-gray/10">
            <p className="text-[7px] md:text-[10px] text-brand-gold uppercase font-bold">Fin</p>
            <p className="text-lg font-bold">{formatTime(end)}</p>
          </div>
        </div>

        {/* Info y Precio */}
        <div className="flex justify-between items-end border-b border-brand-gray/10 pb-4">
          <div className="text-sm">
            <span className="text-brand-gray/60">Duración: </span>
            <span className="font-semibold text-brand-gold">{data.durationInMinutes} min</span>
          </div>
         {/*  <div className="text-right">
            <p className="text-[10px] text-brand-gray/60 uppercase">Total</p>
            <p className="text-2xl font-black text-brand-gold">${data.totalPrice}</p>
          </div> */}
        </div>

        {/* BOTONES */}
        <div className="flex gap-3 pt-2">
          <button 
          onClick={handleCancel}
            type="button"
            className="flex-1 px-4 py-1 rounded-xl text-sm font-bold border border-danger text-danger hover:bg-danger hover:text-white transition-colors"
          >
            {isPending ? 'Cancelando...' : 'Cancelar'}
          </button>
        <Link href={`/${user?.slug}/dashboard/campos`} >
          <button 
            type="button"
            className="flex-1 px-4 py-2 rounded-xl text-sm font-bold bg-brand-black text-brand-gold border-2 border-brand-gold hover:bg-brand-gold hover:text-brand-black transition-colors"
          >
            Dejar pendiente
          </button>
        </Link>   
     
        </div>
      </div>
    </div>
  );
};

