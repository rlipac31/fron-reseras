

  "use client";
import React, { use } from 'react';
import { usePathname } from 'next/navigation'; // Importamos el hook para detectar la ruta
import Link from 'next/link';
import { logout } from "../app/actions/auth";

// Icons
import {
  LogOut,
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  TrendingUp
} from 'lucide-react';
import { GiSoccerField } from "react-icons/gi";
import { useUser } from '@/context/UserContext';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}
 const NavItem = ({ icon, label, active = false }: NavItemProps) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
    active 
      ? 'bg-brand-gold text-brand-black font-bold' 
      : 'hover:bg-brand-gray/10 text-brand-white/70'
    }`}>
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);


export default function Sidebar() {
  const pathname = usePathname(); // Obtenemos la ruta actual (ej: "/dashboard/reservas")
  const { user, setUser }  = useUser();
 // const token = user?.token;
  //const slug = user?.slug;
 // console.log("user desde sidebar:: ", user?.slug)

 /*  const handleLogout = async () => {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      await logout();
      
    }
  }; */

  // En tu botón de Logout en el frontend
const handleLogoutClick = async () => {
  await logout(); // Llama al Server Action
  setUser(null);  // Limpia el estado global del UserContext
};


  // Función para verificar si el link está activo
  const isActive = (path: string) => pathname === path;

  return (
/*     <aside className="w-64 bg-brand-black text-brand-white hidden md:flex flex-col p-6 h-screen sticky top-0">
      <div className="flex items-center gap-2 mb-10">
        <div className="bg-brand-gold p-2 rounded-lg">
          <LayoutDashboard size={20} className="text-brand-black" />
        </div>
        <span className="text-xl font-bold italic">ARENA {business.toUpperCase()}</span>
      </div>
 */


   <aside className="w-64 bg-brand-black text-brand-white hidden md:flex flex-col p-6 h-screen sticky top-0 border-r border-white/5">
      <div className="flex items-center gap-2 mb-10">
        <div className="bg-brand-accent p-2 rounded-lg shadow-lg shadow-brand-accent/20">
          <LayoutDashboard size={20} className="text-brand-black" />
        </div>
        <span className="text-xl font-black italic tracking-tighter">ARENA {user?.slug.toUpperCase()}</span>
      </div>

      <nav className="space-y-2 flex-1 flex flex-col gap-1">
        <Link href={`/${user?.slug}/dashboard`}>
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={isActive(`/${user?.slug}/dashboard`)} 
          />
        </Link>

        <Link href={`/${user?.slug}/dashboard/reservas`}>
          <NavItem 
            icon={<CalendarDays size={20} />} 
            label="Reservas" 
            active={isActive(`/${user?.slug}/dashboard/reservas`)} 
          />
        </Link>

         {/* Dentro de tu Sidebar actual, cambia estos links: */}
        <Link href={`/${user?.slug}/dashboard/campos`}>
          <NavItem 
            icon={<GiSoccerField size={24} />} 
            label="Campos" 
            active={isActive(`/${user?.slug}/dashboard/campos`)} 
          />
        </Link>

        <Link href={`/${user?.slug}/dashboard/usuarios`}>
          <NavItem 
            icon={<Users size={20} />} 
            label="Usuarios" 
            active={isActive(`/${user?.slug}/dashboard/usuarios`)} 
          />
        </Link>
       <Link href={`/${user?.slug}/dashboard/customers`}>
          <NavItem 
            icon={<Users size={20} />} 
            label="Clientes" 
            active={isActive(`/${user?.slug}/dashboard/customers`)} 
          />
        </Link>
      </nav>

      <div className="mt-auto pt-6 border-t border-brand-gray/10">
        <Link href="#">
          <NavItem 
            icon={<Settings size={20} />} 
            label="Configuración" 
            active={isActive('/dashboard/configuracion')} 
          />
        </Link>
      </div>



      <div className="mt-4 pt-6 border-t border-brand-gray/10">
        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-3 w-full p-3 text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer group"
        >
          <LogOut size={20} />
          <span className="text-sm font-bold uppercase">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}



