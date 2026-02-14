"use client";
import { PlusCircle } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { BookingTable } from '@/components/dashboard/BookingTable';
import { useUser } from '@/context/UserContext';

//export default function SoccerDashboard() {
export default  function DashboardPage({ params }: { params: { slug: string } }) {
  const { slug } = params; // Aquí tienes "prometeo"
  const { user }= useUser();
  console.log("user  desde page dashboard", user)


  // Estos datos vendrán de tu API de Node.js en el futuro
  const bookings = [
    { user: "Carlos Ruiz", cancha: "Cancha 1", time: "18:00 - 19:00", status: "Pagado" },
    { user: "FC Amigos", cancha: "Cancha 2", time: "19:00 - 20:00", status: "Pendiente" },
  ];

  const canchas = [
    { id: 1, nombre: "Cancha Sintética 1", estado: "Ocupada", proxima: "20:00" },
    { id: 2, nombre: "Cancha Sintética 2", estado: "Disponible", proxima: "Libre" },
    { id: 3, nombre: "Cancha Fútbol 11", estado: "Mantenimiento", proxima: "Mañana" },
  ];
  //console.log("slug paramas dashboardPage ", slug)
  //  console.log("user slug dashboardPage", user)

  return (
    <div className="flex min-h-screen bg-brand-gray/30">

      
      <main className="flex-1 p-8 bg-gray-100"> 
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-black">Panel de Control</h1>
            <p className="text-gray-500 text-sm">Gestión de alquileres en tiempo real</p>
          </div>
          <button className="flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-black px-4 py-2 rounded-lg font-bold transition-all shadow-md">
            <PlusCircle size={20} />
            Nueva Reserva
          </button>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Ingresos Hoy" value="$450.00" trend="+12%" />
          <StatCard title="Reservas Activas" value="8" trend="En curso" trendType="neutral" />
          <StatCard title="Ocupación" value="85%" trend="+5% vs ayer" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <BookingTable data={bookings} />

          {/* Estado de Canchas (Componente Inline para el ejemplo) */}
          <div className="bg-brand-white rounded-xl shadow-sm border border-brand-gray p-6">
            <h3 className="font-bold text-lg mb-4 text-brand-black">Disponibilidad</h3>
            <div className="space-y-4">
              {canchas.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-brand-gray/20">
                  <div>
                    <p className="font-semibold text-brand-black text-sm">{c.nombre}</p>
                    <p className="text-xs text-gray-500">Próxima: {c.proxima}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                    c.estado === 'Disponible' ? 'bg-success/20 text-success' : 
                    c.estado === 'Ocupada' ? 'bg-danger/20 text-danger' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {c.estado}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}