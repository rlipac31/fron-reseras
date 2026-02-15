'use client'

import { useUser } from "@/context/UserContext";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


const WelcomePage = () => {

    const router = useRouter();


    const { user } = useUser();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push(`/${user?.slug}/dashboard`); // Redirección automática
        }, 1000);

        return () => clearTimeout(timer);
    }, [router]);
    /*  const token = user?.token;
       const business = user?.slug; */
    console.log("user desde page HomePage ", user)
  
    return (
        <div className="  min-w-[65vw] min-h-screen bg-brand-black flex flex-col items-center justify-center rounded-4xl">
            {/* Contenedor del Spinner Principal */}
            <div className="relative flex items-center justify-center">
                {/* Círculo con borde dorado */}
                <div className="w-16 h-16 border-4 border-brand-gray/10 border-t-brand-gold rounded-full animate-spin"></div>

                {/* Iniciales en el centro con pulso */}
                <div className="absolute animate-pulse">
                    <span className="text-brand-gold font-black text-xs tracking-tighter">ARENA</span>
                </div>
            </div>

            {/* Texto con estilo deportivo */}
            <div className="mt-8 text-center">
                <h2 className="text-brand-white font-bold tracking-widest uppercase italic text-sm">
                    Cargando Arena Prometeo
                </h2>

                {/* La barra de progreso que configuramos en el CSS */}
                <div className="mt-3 w-40 h-[2px] bg-brand-white/10 overflow-hidden rounded-full mx-auto">
                    <div className="h-full bg-brand-gold w-1/4 animate-loading-slide"></div>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
