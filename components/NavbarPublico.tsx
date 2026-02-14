"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';


export default function NavbarPublico() {
const slug = process.env.NEXT_PUBLIC_NAME_NEGOCIO;
const businessId =process.env.NEXT_PUBLIC_ID_NEGOCIO; 


   const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false); // 1. Nueva variable de control

  // Efecto para cambiar el fondo al hacer scroll
  useEffect(() => {
       setMounted(true); // 2. Marcamos como montado al entrar al cliente
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Reservas', href: `/reservas` },
    { name: 'Canchas', href: `/campos` },
    { name: 'About', href: '/about' },
  ];

  // 3. Importante: Si no está montado, renderizamos una versión "base" 
  // que coincida exactamente con lo que el servidor envió inicialmente.
  if (!mounted) {
    return (
      <nav className="fixed w-full z-50 transition-all duration-300 bg-transparent py-5">
        {/* Solo el esqueleto o el logo para que no haya salto visual */}
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
             <span className="text-xl font-black italic text-brand-white">
                ARENA <span className="text-brand-gold">SOCCER</span>
             </span>
        </div>
      </nav>
    );
  }
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-brand-black/95 backdrop-blur-md py-3 shadow-lg border-b border-brand-gold/20' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-brand-gold p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Menu size={20} className="text-brand-black" />
          </div>
          <span className="text-xl font-black italic text-brand-white tracking-tighter">
            ARENA <span className="text-brand-gold">SOCCER</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-white hover:text-brand-gold transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/login">
            <button className="bg-brand-gold text-brand-black px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
              Ingresar
            </button>
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          className="md:hidden text-brand-gold p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU (OVERLAY) */}
      <div className={`fixed inset-0 bg-brand-black z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-500 md:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <button 
          className="absolute top-6 right-6 text-brand-gold"
          onClick={() => setIsOpen(false)}
        >
          <X size={32} />
        </button>

        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="text-3xl font-black uppercase italic text-brand-white hover:text-brand-gold transition-colors"
          >
            {link.name}
          </Link>
        ))}
        
        <Link href="/login" onClick={() => setIsOpen(false)}>
          <button className="mt-4 bg-brand-gold text-brand-black px-10 py-4 rounded-full font-black uppercase text-sm tracking-widest">
            Ingresar
          </button>
        </Link>
      </div>
    </nav>
  );
}


//////

