'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SoccerField } from '@/types/field';
import { MapPin, Clock, CalendarDays, PlusCircle, Calendar } from 'lucide-react';
import { GiSoccerKick } from "react-icons/gi";
import Link from 'next/link';
import { getServerUser } from '@/app/actions/userServer';
import { getFieldIdReservations } from '@/app/actions/bookings';

// importamos la configuracion de hora 
import dayjs from 'dayjs';
import { TIMEZONE } from '@/lib/dayjs';


interface FieldCardProps {
    field: SoccerField;
}

export default function FieldCard2({ field }: FieldCardProps) {

    const router = useRouter();

    // 1. Estado para la fecha (por defecto hoy en formato YYYY-MM-DD)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    // Dentro de FieldCard2 para  modal
    const [confirmSlot, setConfirmSlot] = useState<{ hour: number, label: string } | null>(null);
    /// fin datos fecha desde  campo
    const [bookingsData, setBookingsData] = useState<any>(null);
    const [isLoadingBookings, setIsLoadingBookings] = useState(true);
    const [user, setUser] = useState<any>(null);



    const fieldId = String(field?._id?.$oid || field?._id || "");

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // 2. Efecto modificado para re-ejecutarse cuando cambie selectedDate
    useEffect(() => {
        if (!fieldId) return;

        const loadBookings = async () => {
            console.log(" id campo ::::::::::: ", fieldId)
            setIsLoadingBookings(true);
            try {
                const usuario = await getServerUser();
                setUser(usuario);

                // Pasamos la fecha seleccionada a tu Action
                const response = await getFieldIdReservations(fieldId, selectedDate);
                // CORRECCIÓN AQUÍ:
                // Si tu backend devuelve { status: "success", data: [...] }
                // VALIDACIÓN CORRECTA basándose en tu JSON:
                if (response && response.status === "success") {
                    // Accedemos directamente a response.data que es donde está tu array
                    setBookingsData(response.data);
                } else {
                    setBookingsData([]);
                }

            } catch (error) {
                console.error("Error cargando reservas:", error);
                setBookingsData([]); // Reset en caso de error
            } finally {
                setIsLoadingBookings(false);
            }
        };

        loadBookings();
    }, [fieldId, selectedDate]); // <--- Se dispara al cambiar la fecha
    console.log("dataBooking  ", bookingsData)

    /*  logica para horarios disponibles */



    const getAvailableSlots = () => {
        const openTime = 8;  // 08:00 AM
        const closeTime = 23; // 10:00 PM
        const slots = [];

        // 1. Obtenemos el "AHORA" en Lima
        const nowInLima = dayjs().tz(TIMEZONE);
        const isSelectedDateToday = selectedDate === nowInLima.format('YYYY-MM-DD');

        for (let hour = openTime; hour <= closeTime; hour++) {
            const timeLabel = `${hour.toString().padStart(2, '0')}:00`;

            // 2. Verificamos si la hora ya pasó (solo si la fecha seleccionada es HOY)
            let isPast = false;
            if (isSelectedDateToday) {
                isPast = hour <= nowInLima.hour();
            }

            // 3. Verificamos si está ocupada en los datos del servidor
            const isOccupied = bookingsData?.some((booking: any) => {
                const bookingHour = dayjs(booking.startTime).tz(TIMEZONE).hour();
                return bookingHour === hour;
            });

            slots.push({
                hour: hour,
                label: timeLabel,
                available: !isOccupied && !isPast, // Solo disponible si no está ocupada Y no ha pasado
                reason: isOccupied ? 'OCUPADO' : (isPast ? 'PASADO' : 'LIBRE')
            });
        }
        return slots;
    };
    /*  fin horarios disponibles */

    return (
        <div className="bg-brand-white rounded-xl border border-brand-gray shadow-sm overflow-hidden hover:shadow-md transition-all group flex flex-col h-full w-[85vw] mx-auto md:w-full">
            <div className="p-4 flex-grow">
                {/* Header y Detalles (Nombre, Capacidad, etc.) */}
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-brand-black group-hover:text-brand-gold transition-colors uppercase">
                        {field.name}
                    </h3>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${field.state ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {field.state ? 'Activa' : 'Inactiva'}
                    </span>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin size={14} className="text-brand-gold" />
                        <span className="line-clamp-1">{field.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <GiSoccerKick size={18} className='text-brand-gold' />
                        <span>Capacidad: {field.capacity} personas</span>
                    </div>
                </div>

                {/* --- SECCIÓN DE RESERVAS CON DATEPICKER --- */}
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 text-[12px]  font-black text-brand-black uppercase tracking-wider">
                            <CalendarDays size={14} className="text-brand-gold" />
                            Agenda
                        </div>

                        {/* INPUT DE FECHA LOCAL A LA CARD */}
                        <div className="relative">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="text-[14px] font-bold border border-brand-gray rounded px-2 py-1 outline-none focus:border-brand-gold bg-slate-50 text-brand-black"
                            />
                        </div>
                    </div>
                    {/* 
       

                    {/* Sección de Slots Disponibles */}

                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Horarios Disponibles
                            </p>
                            <span className="text-[9px] text-brand-gold font-bold">Zona: Lima (GMT-5)</span>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                            {getAvailableSlots().map((slot) => {
                                // Estilos dinámicos según el estado
                                let buttonStyles = "";
                                if (slot.available) {
                                    buttonStyles = "border-green-500/30 text-[12px]  bg-green-50 text-green-700 hover:bg-green-600 hover:text-brand-white cursor-pointer";
                                } else if (slot.reason === 'PASADO') {
                                    buttonStyles = "border-slate-100 bg-slate-50 text-slate-500 cursor-not-allowed  opacity-60";
                                } else {
                                    buttonStyles = "border-red-100 bg-red-50 text-red-400 cursor-not-allowed";
                                }

                                return (
                            
                                    <button
                                    key={slot.label}
                                    disabled={!slot.available}
                                    onClick={() => setConfirmSlot({ hour: slot.hour, label: slot.label })} // <-- Cambiamos esto
                                    className={`py-2 rounded-lg text-[10px] font-black transition-all border text-center ${buttonStyles}`}
                                    >
                                    {slot.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    {/*Fin Sección de Slots Disponibles */}
                </div>
            </div>


            {/* Footer */}
            <div className="bg-brand-gray/10 px-5 py-3 border-t border-brand-gray flex justify-between items-center mt-auto">
                <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-brand-black">S/ {field.pricePerHour}</span>
                    <span className="text-[10px] text-gray-500 font-medium uppercase">/ hr</span>
                </div>
                <Link href={`/${user?.slug}/dashboard/reservas/save?fieldId=${fieldId}&name=${field.name}&date=${selectedDate}`}>
                    <button className="flex items-center gap-2 text-xs font-black text-brand-black bg-brand-gold px-4 py-2 rounded-lg hover:bg-black hover:text-brand-gold transition-all shadow-sm active:scale-95">
                        <PlusCircle size={14} />
                        RESERVAR
                    </button>
                </Link>
            </div>

            {/* MODAL CON CONFIRMACION DE INICIO DE RESERVA AL PRESIONAR BOTON HORA */}

          
            {confirmSlot && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xs rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="bg-brand-black p-4 text-center">
                            <div className="mx-auto w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center mb-2">
                                <Clock className="text-brand-gold" size={24} />
                            </div>
                            <h4 className="text-brand-gold font-black text-sm uppercase tracking-tighter">Confirmar Horario</h4>
                        </div>

                        <div className="p-6 text-center">
                            <p className="text-gray-500 text-xs mb-1 uppercase font-bold">Cancha</p>
                            <p className="text-brand-black font-black text-lg leading-tight mb-4">{field.name}</p>

                            <div className="grid grid-cols-2 gap-2 py-3 border-y border-brand-gray/50 border-dashed mb-6">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Fecha</p>
                                    <p className="text-[16px] font-black text-brand-black">{dayjs(selectedDate).format('DD/MM/YYYY')}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Hora</p>
                                    <p className="text-[16px] font-black text-brand-black">{confirmSlot.label}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => {
                                        const hourParam = confirmSlot.hour.toString().padStart(2, '0') + ':00';
                                        router.push(`/${user?.slug}/dashboard/reservas/save?fieldId=${fieldId}&name=${field.name}&date=${selectedDate}&time=${hourParam}`);
                                    }}
                                    className="w-full bg-brand-gold text-brand-black font-black py-3 rounded-xl text-xs uppercase
                                     hover:bg-black hover:text-brand-gold transition-all shadow-lg shadow-brand-gold/20"
                                >
                                    Ir a Reservar
                                </button>
                                <button
                                    onClick={() => setConfirmSlot(null)}
                                    className="w-full bg-transparent text-gray-400 font-bold py-2 text-[10px] uppercase hover:text-brand-black transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

              {/* FIN MODAL DE CONFIRMACIÓN */}
        </div>
    );
}