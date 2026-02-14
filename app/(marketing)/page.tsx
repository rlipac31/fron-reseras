
import React from 'react';
import Image from 'next/image';
import { MapPin, Phone, Instagram, Calendar, Clock, ArrowRight } from 'lucide-react';


import { getFieldsPublic } from '../actions/public';


import header from '../../public/assets/header.jpg'
import cancha_1 from '../../public/assets/campo-arena-futbol-diseno-vector-luces-estadio-brillante_116849-1393.jpg'
//import cancha_2 from '../../public/assets/tarhmadzucbnqb8wzhsg.avif'
import cancha_3 from '../../public/assets/concepto-hacer-deporte_23-2151937746(1).jpg'



const slug = process.env.NEXT_PUBLIC_NAME_NEGOCIO;

/* interface CanchasType{
  canchas:string[];
} */
/* export default async function HomePage({canchas}:CanchasType) {
 */

export default async function HomePage() {

 /*  const businessId = process.env.NEXT_PUBLIC_ID_NEGOCIO;
  if(businessId){
        const res =await fetch(`http://127.0.0.1:4000/api/fields/public/${businessId}`, {
    //  next: { revalidate: 0 } // No cacheamos para ver reservas en tiempo real
    });
    const { fields } = await res.json();
    canchas = fields;
  }

console.log(" cnachas ", canchas) */

  const canchas = [
    { id: 1, name: "Cancha Profesional", desc: "Gras natural, 11 vs 11 con iluminación LED.", img: cancha_1 },
   //{ id: 2, name: "La Losa Futsal", desc: "Superficie de alto impacto, ideal para técnica rápida.", img: cancha_2 },
    { id: 3, name: "Gras Pro Semi-7", desc: "Sintético Premium, perfecto para torneos relámpago.", img: cancha_3 },
  ];

  return (
    <div className="min-h-screen bg-brand-white">

      {/* --- HERO SECTION --- */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        <Image
          src={header}
          alt="Arena Soccer Header"
          fill
          className="object-cover brightness-40"
          priority
        />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span className="text-brand-gold font-black tracking-[0.3em] uppercase mb-4 block animate-fade-in">
            Vive la pasión del fútbol
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-brand-white italic uppercase tracking-tighter mb-6 leading-none">
            ARENA <span className="text-brand-gold underline decoration-brand-gold/30">{slug?.toLocaleUpperCase()}</span>
          </h1>
          <p className="text-brand-gray text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
            Reserva las mejores canchas de la ciudad en menos de 1 minuto. Iluminación profesional y gras de alta calidad.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-brand-gold text-brand-black px-10 py-4 rounded-full font-black uppercase text-sm hover:scale-105 transition-all flex items-center justify-center gap-2">
              Reservar ahora <Calendar size={18} />
            </button>
            <button className="border-2 border-brand-white text-brand-white px-10 py-4 rounded-full font-black uppercase text-sm hover:bg-brand-white hover:text-brand-black transition-all">
              Ver Instalaciones
            </button>
          </div>
        </div>
      </section>

      {/* --- NUESTROS CAMPOS (Grid con Cards Transparentes) --- */}
      <section className="py-24 bg-brand-black text-brand-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Nuestros Campos</h2>
              <div className="h-1.5 w-24 bg-brand-gold mt-2"></div>
            </div>
            <p className="text-gray-400 max-w-sm text-sm italic">
              Contamos con tecnología de amortiguación para evitar lesiones y potenciar tu juego.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {canchas && canchas.map((campo ) => (
              <div key={campo.id} className="group relative h-[450px] rounded-2xl overflow-hidden border border-brand-gold/20">
                <Image
                  src={cancha_1}
                  alt={campo.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay Degradado Gradual */}
                <div className="absolute inset-0 bg-linear-to-t from-brand-black via-brand-black/40 to-transparent" />

                {/* Content Card Transparente */}
                <div className="absolute bottom-0 p-6 w-full backdrop-blur-[2px]">
                  <h3 className="text-2xl font-black text-brand-gold uppercase italic">{campo.name}</h3>
                  <p className="text-brand-white/80 text-sm mt-2 font-medium leading-relaxed">
                    {campo.desc}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-gold">
                      <Clock size={14} /> 6:00 AM - 11:00 PM
                    </div>
                    <button className="bg-brand-white/10 hover:bg-brand-gold hover:text-brand-black p-2 rounded-full transition-colors">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- UBICACIÓN Y CONTACTO --- */}
      <footer className="bg-brand-gray py-20 px-6 border-t-8 border-brand-gold">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">

          <div className="space-y-6">
            <h4 className="text-3xl font-black text-brand-black italic tracking-tighter uppercase">ARENA SOCCER</h4>
            <p className="text-gray-600 text-sm font-medium">
              Más que un complejo deportivo, somos el lugar donde nace la competencia y se forja la amistad. ¡Ven y juega como un profesional!
            </p>
            <div className="flex gap-4">
              <Instagram className="text-brand-black hover:text-brand-gold cursor-pointer" />
              <div className="w-6 h-6 bg-brand-black rounded-sm flex items-center justify-center text-brand-white text-xs font-bold">f</div>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="font-black text-brand-black uppercase text-sm tracking-widest">Contáctanos</h5>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 text-sm text-gray-700 font-semibold">
                <MapPin className="text-brand-gold shrink-0" size={20} />
                <span>Av. de la Victoria 123, Villa María, <br /> Lima - Perú</span>
              </li>
              <li className="flex items-center gap-4 text-sm text-gray-700 font-semibold">
                <Phone className="text-brand-gold shrink-0" size={20} />
                <span>+51 987 654 321</span>
              </li>
            </ul>
          </div>

          <div className="bg-brand-black p-8 rounded-2xl shadow-2xl">
            <h5 className="text-brand-gold font-black uppercase text-lg mb-4">¿Dudas?</h5>
            <p className="text-brand-white/70 text-xs mb-6 font-medium">Déjanos tu correo y un gestor te llamará para organizar tu torneo.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tu email"
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-brand-white w-full outline-none focus:border-brand-gold"
              />
              <button className="bg-brand-gold text-brand-black px-4 py-2 rounded-lg font-bold text-xs uppercase hover:brightness-110">
                Enviar
              </button>
            </div>
          </div>

        </div>
        <div className="mt-20 pt-8 border-t border-gray-300 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            © 2026 Arena Soccer Complex - Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}