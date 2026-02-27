"use client";
import { useEffect, useState } from 'react';
import {
    PlusCircle, Calendar, RefreshCw, AlertCircle, LayoutDashboard
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// Componentes y Acciones
import { getDashboardData } from '@/app/actions/dashboard';
import { DashboardResponse } from '@/types/dashboard';
import {
    KpiSection,
    TimelineSection,
    NextMatchAlert,
    FieldRankingSection,
    HeatmapSection
} from '@/components/dashboard/DashboardComponents';

export default function SoccerDashboard() {
    const { user } = useUser();
    if (user?.role !== 'ADMIN' && user?.role !== 'USER') {
        redirect(`/${user?.slug}/dashboard/campos`);
    }


    const currency = user?.currency?.symbol || "$";

    const [data, setData] = useState<DashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        const result = await getDashboardData();
        if (result.success && result.data) {
            setData(result.data);
            setError(null);
        } else {
            setError(result.error || "Ocurrió un error inesperado");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <RefreshCw className="animate-spin text-brand-gold" size={48} />
                <p className="text-brand-black font-black uppercase tracking-widest animate-pulse">Cargando Dashboard...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-8 max-w-2xl mx-auto text-center space-y-4">
                <div className="bg-danger/10 p-6 rounded-2xl border-2 border-danger/20 inline-block">
                    <AlertCircle className="text-danger mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-black text-brand-black uppercase">Ups, algo salió mal</h2>
                    <p className="text-gray-500 font-medium mt-2">{error || "No se pudo conectar con el servidor"}</p>
                </div>
                <div>
                    <button
                        onClick={fetchData}
                        className="bg-brand-black text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
                    >
                        REINTENTAR CONEXIÓN
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">

            {/* HEADER CON ACCIONES RÁPIDAS */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-gold text-brand-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <LayoutDashboard size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-brand-black tracking-tight uppercase">Dashboard</h1>
                        <p className="text-gray-500 font-medium">Estado del complejo: <span className="text-success font-bold">Abierto</span></p>
                    </div>
                </div>
                {/* <div className="flex gap-3">
                    <button
                        onClick={fetchData}
                        className="p-3 bg-brand-gray/20 text-gray-400 rounded-xl hover:text-brand-black hover:bg-brand-gray transition-colors"
                        title="Refrescar datos"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <button className="hidden lg:flex items-center gap-2 bg-brand-black text-white px-4 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform cursor-pointer">
                        <Calendar size={18} />
                        Bloquear Horario
                    </button>
                    <button className="flex items-center gap-2 bg-brand-gold text-brand-black px-6 py-2.5 rounded-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer">
                        <PlusCircle size={20} />
                        NUEVA RESERVA
                    </button>
                </div> */}
            </header>

            {/* MÉTRICAS PRINCIPALES (KPIs) */}
            <KpiSection kpis={data.kpis} currency={currency} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUMNA IZQUIERDA: TIMELINE DE CANCHAS */}
                <div className="lg:col-span-2 space-y-8">
                    <TimelineSection bookings={data.timeline} />
                </div>

                {/* COLUMNA DERECHA: ALERTAS Y RANKING */}
                <div className="space-y-6">
                    {/* PRÓXIMO PARTIDO */}
                    <NextMatchAlert nextMatch={data.proximoPartido} currency={currency} />

                    {/* RANKING DE CANCHAS */}
                    <FieldRankingSection ranking={data.rankingCampos} currency={currency} />

                    {/* MAPA DE DEMANDA (Heatmap) */}
                    <HeatmapSection items={data.mapaCalor} />
                </div>
            </div>
        </div>
    );
}