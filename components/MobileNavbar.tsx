"use client";
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, CalendarDays, Users, Settings, LogOut, CircleX } from 'lucide-react';
import { GiSoccerField, GiWhiteBook } from "react-icons/gi";
import { logout } from "../app/actions/auth";


// Subcomponente para los items del móvil
 const MobileNavItem = ({ href, icon, label, active, onClick }: any) => (
  <Link href={href} onClick={onClick}>
    <div className={`flex items-center gap-4 p-4 rounded-xl ${active ? 'bg-brand-gold text-brand-black font-bold' : 'text-white/70'}`}>
      {icon}
      <span className="text-lg">{label}</span>
    </div>
  </Link>
); 



export default function MobileNavbar({ business }: { business: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();





  const toggleMenu = () => setIsOpen(!isOpen);
  //const isActive = (path: string) => pathname === path;
  // Función para verificar si el link está activo
  const isActive = (path: string) => pathname === path;
  return (
    <div className="md:hidden">
      {/* Barra superior móvil */}
      <div className="bg-brand-black text-brand-white p-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="bg-brand-gold p-1.5 rounded-lg">
            <LayoutDashboard size={18} className="text-brand-black" />
          </div>
          <span className="font-black italic text-sm tracking-tighter">ARENA {business.toUpperCase()}</span>
        </div>
        
        <button onClick={toggleMenu} className="p-2 text-brand-white z-[60] relative">
         {/*  {isOpen ? <X size={28} color="#FFFFFF"/> : <Menu size={28} />}  */}  
           {isOpen ? <X size={28} color="#FFFFFF" />: <Menu size={28} />} 
        </button>
      </div>

      {/* Menú desplegable (Overlay) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-brand-black flex flex-col p-6 animate-in slide-in-from-top duration-300">
          <div className="flex justify-end mb-8">
            <button onClick={toggleMenu} className="p-2"><X size={32} /></button>
          </div>

          <nav className="space-y-4 flex-1">
            <MobileNavItem 
              href={`/${business}/dashboard`} 
              icon={<LayoutDashboard />} 
              label="Dashboard" 
              active={isActive(`/${business}/dashboard`)} 
              onClick={toggleMenu}
            />
            <MobileNavItem 
              href={`/${business}/dashboard/reservas`} 
              icon={<CalendarDays />} 
              label="Reservas" 
              active={isActive(`/${business}/dashboard/reservas`)} 
              onClick={toggleMenu}
            />
            <MobileNavItem 
              href={`/${business}/dashboard/campos`} 
              icon={<GiSoccerField size={24} />} 
              label="Campos" 
              active={isActive(`/${business}/dashboard/campos`)} 
              onClick={toggleMenu}
            />
             <MobileNavItem 
              href={`/${business}/dashboard/usuarios`} 
              icon={<Users />} 
              label="Usuarios" 
              active={isActive(`/${business}/dashboard/usuarios`)} 
              onClick={toggleMenu}
            />
            <MobileNavItem 
              href={`/${business}/dashboard/customers`} 
              icon={<Users />} 
              label="Clientes" 
              active={isActive(`/${business}/dashboard/customers`)} 
              onClick={toggleMenu}
            />
          </nav>

          <div className="mt-auto border-t border-white/10 pt-4">
             <button
              onClick={async () => { await logout(); }}
              className="flex items-center gap-4 w-full p-4 text-red-500 font-bold uppercase"
            >
              <LogOut /> Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

