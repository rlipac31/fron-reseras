import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { getServerUser } from "./actions/userServer";
export default async function NotFound() {

  
  const user =  await getServerUser()


  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center p-6 text-center">
      {/* Elemento Decorativo: El "404" con estilo de marcador */}
      <h1 className="text-9xl font-black text-brand-gold opacity-20 absolute select-none">
        404
      </h1>
      
      <div className="relative z-10">
        <h2 className="text-4xl font-bold text-brand-white mb-4 italic uppercase">
          ¡Fuera de Juego!
        </h2>
        <p className="text-brand-gray max-w-sm mb-8">
          La página que buscas no existe o no tienes los permisos necesarios para entrar a la cancha.
        </p>
        
        <Link 
          href={`/${user?.slug}/dashboard`}
          className="inline-block bg-brand-gold text-brand-black px-8 py-3 rounded-lg font-bold uppercase hover:bg-white transition-colors duration-300 shadow-lg shadow-brand-gold/20"
        >
          Volver al Dashboard
        </Link>
      </div>

      {/* Footer decorativo */}
      <div className="mt-12 text-brand-gray/30 text-sm font-mono">
        ARENA {user?.slug.toUpperCase()} • SISTEMA DE GESTIÓN
      </div>
    </div>
  );
}