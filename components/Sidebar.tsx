"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { logout } from "../app/actions/auth";

// Icons
import {
  LogOut,
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  CreditCard // Icono sugerido para pagos
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
      ? 'bg-brand-gold text-brand-black font-bold shadow-lg shadow-brand-gold/10' 
      : 'hover:bg-white/5 text-brand-white/70 hover:text-white'
    }`}>
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default function Sidebar({ slug }: { slug: string }) {
  const pathname = usePathname();
  const { user, setUser } = useUser();

  const handleLogoutClick = async () => {
    await logout();
    setUser(null);
  };

  const isActive = (path: string) => pathname === path;

  // 1. Definición de rutas permitidas
  const menuItems = [
    {
      href: `/${slug}/dashboard`,
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      roles: ['ADMIN', 'USER'] // Solo admin y user ven esto
    },
    {
      href: `/${slug}/dashboard/reservas`,
      label: "Reservas",
      icon: <CalendarDays size={20} />,
      roles: ['ADMIN', 'USER']
    },
    {
      href: `/${slug}/dashboard/campos`,
      label: "Campos",
      icon: <GiSoccerField size={24} />,
      roles: ['ADMIN', 'USER', 'CUSTOMER'] // TODOS ven los campos
    },
    {
      href: `/${slug}/dashboard/usuarios`,
      label: "Usuarios",
      icon: <Users size={20} />,
      roles: ['ADMIN'] // Solo el Admin ve gestión de empleados
    },
    {
      href: `/${slug}/dashboard/customers`,
      label: "Clientes",
      icon: <Users size={20} />,
      roles: ['ADMIN', 'USER']
    }
  ];

  return (
    <aside className="w-64 bg-brand-black text-brand-white hidden md:flex flex-col p-6 h-screen sticky top-0 border-r border-white/5">
      {/* LOGO */}
      <div className="flex items-center gap-2 mb-10">
        <div className="bg-brand-gold p-2 rounded-lg">
          <GiSoccerField size={20} className="text-brand-black" />
        </div>
        <span className="text-xl font-black italic tracking-tighter">ARENA {slug.toUpperCase()}</span>
      </div>

      {/* NAV FILTRADO POR ROL */}
      <nav className="space-y-1 flex-1 flex flex-col">
        {menuItems
          .filter(item => item.roles.includes(user?.role || '')) // Filtro mágico
          .map((item) => (
            <Link key={item.href} href={item.href}>
              <NavItem 
                icon={item.icon} 
                label={item.label} 
                active={isActive(item.href)} 
              />
            </Link>
          ))
        }
      </nav>

      {/* CONFIGURACIÓN (Solo para Staff) */}
      {(user?.role === 'ADMIN' || user?.role === 'USER') && (
        <div className="mt-auto pt-6 border-t border-white/5">
          <Link href={`/${slug}/dashboard/configuracion`}>
            <NavItem 
              icon={<Settings size={20} />} 
              label="Configuración" 
              active={isActive(`/${slug}/dashboard/configuracion`)} 
            />
          </Link>
        </div>
      )}

      {/* CERRAR SESIÓN */}
      <div className="mt-4 pt-6 border-t border-white/5">
        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer group"
        >
          <LogOut size={20} />
          <span className="text-sm font-bold uppercase tracking-tight">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}