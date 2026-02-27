// components/dashboard/DashboardComponents.tsx
'use client'
import { useEffect, useState } from 'react';
import {
    Wallet, Calendar, Users, TrendingUp,
    ArrowUpRight, ArrowDownRight, Clock,
    AlertCircle, Star, Filter, Loader2
} from 'lucide-react';
import { StatCard } from './StatCard';
import { DashboardKPIs, TimelineBooking, FieldRanking, HeatmapItem } from '@/types/dashboard';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { searchPaymentByBookingId } from '@/app/actions/payments';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

// 1. KPI SECTION
export const KpiSection = ({ kpis, currency }: { kpis?: DashboardKPIs, currency: string }) => {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Ingresos Recaudados"
                value={`${currency} ${kpis?.ingresos?.recaudado || 0}`}
                trend={`+${kpis?.nuevas24h} nuevas`}
                icon={<Wallet className="hover:bg-brand-gold text-brand-black" />}
            />
            <StatCard
                title="Pendiente de Cobro"
                value={`${currency} ${kpis?.ingresos?.pendiente || 0}`}
                trend={`${kpis?.cancelaciones} cancelaciones`}
                trendType="neutral"
                icon={<AlertCircle className="text-danger" />}
            />
            <StatCard
                title="Ocupación"
                value={`${kpis?.ocupacionPorcentaje?.toFixed(0) || 0} %`}
                trend="Promedio semanal"
                icon={<TrendingUp className="hover:bg-brand-gold text-brand-black" />}
            />
            <StatCard
                title="Nuevas (24h)"
                value={kpis?.nuevas24h || 0}
                trend="Último día"
                icon={<Users className="hover:bg-brand-gold text-brand-black" />}
            />
        </section>
    );
};

// 2. TIMELINE SECTION (Horizontal Schedule)
export const TimelineSection = ({ bookings }: { bookings: TimelineBooking[] }) => {
    const { user } = useUser();
    const TZ = user?.zonaHoraria;

    // Generar horas para el timeline (ej: 08:00 a 23:00)
    const hours = Array.from({ length: 16 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

    // Agrupar bookings por cancha
    const fields = Array.from(new Set(bookings.map(b => b.fieldName)));

    return (
        <div className="bg-white rounded-2xl border-2 border-brand-gray p-6 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl text-brand-black uppercase flex items-center gap-2">
                    <Clock size={20} /> Cronograma de Hoy
                </h3>
                <div className="flex gap-2">
                    <span className="text-[10px] font-bold bg-success/10 text-success px-2 py-1 rounded italic uppercase">En tiempo real</span>
                </div>
            </div>

            <div className="relative overflow-x-auto custom-scrollbar">
                <div className="min-w-[800px]">
                    {/* Header de horas */}
                    <div className="flex border-b border-brand-gray mb-4 pb-2">
                        <div className="w-40 shrink-0 font-black text-[10px] text-gray-400 uppercase">Cancha / Hora</div>
                        {hours.map(hour => (
                            <div key={hour} className="flex-1 text-center text-[10px] font-bold text-gray-400">{hour}</div>
                        ))}
                    </div>

                    {/* Filas por cancha */}
                    <div className="space-y-4">
                        {fields.length > 0 ? fields.map(field => (
                            <div key={field} className="flex items-center group">
                                <div className="w-40 font-bold text-xs text-brand-black truncate pr-2 group-hover:text-brand-gold transition-colors">{field}</div>
                                <div className="flex-1 flex gap-1 h-14 bg-gray-50/50 rounded-xl p-1 relative border border-dashed border-gray-200">
                                    {hours.map(hour => {
                                        const booking = bookings.find(b =>
                                            b.fieldName === field &&
                                            (TZ ? dayjs(b.startTime).tz(TZ) : dayjs(b.startTime)).format('HH:00') === hour
                                        );

                                        return (
                                            <div
                                                key={hour}
                                                className={`flex-1 rounded-lg transition-all relative group/item
                                                    ${booking
                                                        ? (booking.state === 'CONFIRMED' ? 'bg-brand-black text-brand-gold border-l-4 border-brand-gold shadow-md' : 'bg-gray-200 text-gray-500 border-l-4 border-gray-400')
                                                        : 'hover:bg-brand-gold/10 cursor-alias'
                                                    }`}
                                            >
                                                {booking && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-1 overflow-hidden">
                                                        <span className="text-[8px] font-black leading-none truncate w-full text-center">
                                                            {booking.customerName.split(' ')[0]}
                                                        </span>
                                                        <span className="text-[7px] opacity-70 mt-0.5">{booking.state === 'PENDING' ? 'Pte' : 'Conf'}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )) : (
                            <div className="py-10 text-center text-gray-400 italic text-sm">No hay reservas programadas para hoy</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 3. NEXT MATCH ALERT
export const NextMatchAlert = ({ nextMatch, currency }: { nextMatch: TimelineBooking | null, currency: string }) => {
    if (!nextMatch) return null;
    const { user } = useUser();
    const router = useRouter();
    const TZ = user?.zonaHoraria;
    const [loading, setLoading] = useState(false);

    const handleViewDetails = async () => {
        setLoading(true);
        try {
            const result = await searchPaymentByBookingId(nextMatch._id);
            if (result.success && result.data) {
                router.push(`/${user?.slug}/dashboard/pagos/${result.data._id}`);
            } else {
                console.error("No se encontró un pago asociado a esta reserva.");
            }
        } catch (error) {
            console.error("Error al intentar ver el detalle:", error);
        } finally {
            setLoading(false);
        }
    }

    const isUrgent = nextMatch.minutosParaInicio < 60 && nextMatch.minutosParaInicio > 0;

    return (
        <div className={`rounded-2xl border-2 p-6 transition-all shadow-lg ${isUrgent ? 'bg-brand-black border-brand-black  ' : 'bg-brand-black border-brand-gold text-white'
            }`}>

            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl ${isUrgent ? 'bg-brand-black text-brand-gold animate-pulse' : 'bg-brand-gold text-brand-gray'}`}>
                    <Clock size={20} />
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${isUrgent ? 'bg-brand-gold text-brand-black' : 'bg-white text-brand-black'
                    }`}>
                    {isUrgent ? '¡Empieza Pronto!' : 'Siguiente Partido'}
                </div>
            </div>

            <h4 className={`text-xl font-black capitalize mb-1 ${isUrgent ? 'text-brand-gold' : 'text-brand-black'}`}>
                {nextMatch.customerName}
            </h4>
            <div className={`text-sm font-bold mb-4 ${isUrgent ? 'text-brand-gold/80 ' : 'text-gray-400'}`}>
                {nextMatch.fieldName} • {(TZ ? dayjs(nextMatch.startTime).tz(TZ) : dayjs(nextMatch.startTime)).format('HH:mm')} hs
            </div>

            <div className={`p-4 rounded-xl flex items-center justify-between ${isUrgent ? 'bg-brand-gol/50 border border-black/20  animate-pulse' : 'bg-white/5 border border-white/10'
                }`}>
                <div>
                    <p className="text-[9px] font-black text-brand-white uppercase opacity-60">Faltan:</p>
                    <p className="text-lg font-black text-brand-gold" >{Math.max(0, Math.floor(nextMatch.minutosParaInicio))} min</p>
                </div>
                <button
                    onClick={handleViewDetails}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg font-black text-xs transition-transform hover:scale-105 flex items-center gap-2 ${isUrgent ? 'bg-brand-gold text-brand-black shadow-md' : 'bg-brand-gold text-brand-black'
                        }`}>
                    {loading ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            CARGANDO...
                        </>
                    ) : (
                        'DETALLE'
                    )}
                </button>

            </div>
        </div>
    );
};

// 4. FIELD RANKING
export const FieldRankingSection = ({ ranking, currency }: { ranking: FieldRanking[], currency: string }) => {
    const maxRevenue = Math.max(...ranking.map(r => r.totalGenerado), 1);

    return (
        <div className="bg-white rounded-2xl border-2 border-brand-gray p-6">
            <h3 className="font-black text-lg text-brand-black uppercase mb-6 flex items-center gap-2">
                <Star size={18} className="text-brand-gold" /> Ranking de Canchas
            </h3>
            <div className="space-y-6">
                {ranking.map((field, index) => (
                    <div key={field._id} className="space-y-2">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase block">Puesto #{index + 1}</span>
                                <span className="font-bold text-sm text-brand-black">{field.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-black text-brand-black block">{currency}{field.totalGenerado}</span>
                                <span className="text-[9px] font-bold text-gray-500 uppercase">{field.vecesReservada} usos</span>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-brand-gold transition-all duration-1000"
                                style={{ width: `${(field.totalGenerado / maxRevenue) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 5. HEATMAP (Simple version)
// export const HeatmapSection = ({ items }: { items: HeatmapItem[] }) => {
//     // 0 = Dom, 1 = Lun, ..., 6 = Sab (según JS, pero el API parece usar 1-7)
//     const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
//     const peaks = [18, 19, 20, 21, 22]; // Horas pico habituales

//     console.log("itens mapaCalor", items);

//     return (
//         <div className="bg-brand-black rounded-2xl p-6 text-white shadow-xl">
//             <h3 className="font-bold text-lg mb-6 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                     <TrendingUp size={18} className="text-brand-gold" /> Mapa de Demanda
//                 </div>
//                 <div className="flex gap-1">
//                     {[1, 2, 3].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i === 3 ? 'bg-brand-gold' : i === 2 ? 'bg-brand-gold/50' : 'bg-brand-gold/20'}`} />)}
//                 </div>
//             </h3>

//             <div className="flex flex-col gap-4">
//                 {/* Visualización simplificada de horas más pedidas */}
//                 <div className="grid grid-cols-5 gap-2 h-24 items-end">
//                     {peaks.map(hour => {
//                         const totalAtHour = items.filter(i => i._id.hora === hour).reduce((acc, curr) => acc + curr.cantidad, 0);
//                         const maxAtHour = 10; // Normalización arbitraria

//                         return (
//                             <div key={hour} className="flex-1 flex flex-col items-center gap-2 group">
//                                 <div className="w-full bg-brand-gold rounded-t-lg transition-all duration-500 group-hover:bg-white"
//                                     style={{ height: `${Math.min(100, (totalAtHour / maxAtHour) * 100)}%`, opacity: 0.3 + (totalAtHour / maxAtHour) }}>
//                                 </div>
//                                 <span className="text-[10px] font-black text-gray-500">{hour}h</span>
//                             </div>
//                         );
//                     })}
//                 </div>
//                 <p className="text-[9px] text-gray-500 italic text-center border-t border-white/5 pt-2">Basado en el histórico de los últimos 30 días</p>
//             </div>
//         </div>
//     );
// };

export const HeatmapSection = ({ items }: { items: HeatmapItem[] }) => {
    // 1. Agrupamos el total de reservas por cada hora para identificar cuáles son las más ocupadas
    const totalsByHour = items.reduce((acc, curr) => {
        const hour = curr._id.hora;
        acc[hour] = (acc[hour] || 0) + curr.cantidad;
        return acc;
    }, {} as Record<number, number>);

    // 2. Extraemos las 6 horas con mayor demanda (peaks) de forma dinámica
    const dynamicPeaks = Object.entries(totalsByHour)
        .sort(([, a], [, b]) => b - a) // Ordenamos por cantidad (mayor a menor)
        .slice(0, 6)                   // Tomamos las 6 más importantes(con mayor cantidad de reservas)
        .map(([hour]) => parseInt(hour))
        .sort((a, b) => a - b);        // Las re-ordenamos cronológicamente para la vista

    // Calculamos el valor máximo para normalizar la altura de las barras
    const maxVal = Math.max(...Object.values(totalsByHour), 1);

    return (
        <div className="bg-brand-black rounded-2xl p-6 text-white shadow-xl">
            <h3 className="font-bold text-lg mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-brand-gold" /> Mapa de Demanda
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i === dynamicPeaks.length ? 'bg-brand-gold' : 'bg-brand-gold/20'}`} />)}
                </div>
            </h3>

            <div className="flex flex-col gap-4">


                {/* Visualización dinámica de las horas con más reservas */}
                <div className="grid grid-cols-6 gap-2 h-24 items-end">
                    {dynamicPeaks.length > 0 ? dynamicPeaks.map(hour => {
                        const totalAtHour = totalsByHour[hour] || 0;

                        return (
                            <div key={hour} className="flex-1 flex flex-col items-center justify-end gap-2 group h-full"> {/* Añadido h-full y justify-end */}
                                <div
                                    className="w-full bg-brand-gold rounded-t-sm transition-all duration-500 group-hover:bg-white border-x border-t border-brand-gold/30"
                                    style={{
                                        height: `${Math.min(100, (totalAtHour / maxVal) * 100)}%`,
                                        opacity: 0.4 + (totalAtHour / maxVal) * 0.6
                                    }}
                                >
                                </div>
                                <span className="text-[10px] font-black text-gray-500 leading-none">{hour}h</span>
                            </div>
                        );
                    }) : (
                        <div className="col-span-6 text-center text-gray-500 text-[10px] italic py-4">Sin datos de tendencia aún</div>
                    )}
                </div>


                <p className="text-[9px] text-gray-500 italic text-center border-t border-white/5 pt-2">
                    Análisis de las {dynamicPeaks.length} horas más solicitadas en los últimos 30 días
                </p>
            </div>
        </div>
    );
};

