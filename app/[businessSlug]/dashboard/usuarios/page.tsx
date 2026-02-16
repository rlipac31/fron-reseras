import { cookies } from 'next/headers';
import ClientCard from '@/components/cliente/ClientCard';
import { Users, UserPlus, Lock, AlertCircle } from 'lucide-react';
import { UserType } from '@/types/user';
import Link from 'next/link';
import { getServerUser } from '@/app/actions/userServer';
import { redirect } from 'next/navigation';

// 1. FUNCIÓN DE OBTENCIÓN DE DATOS (Servidor)
async function getUsers(): Promise<{ users: UserType[], errorMessage: string | null }> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;


const user = await getServerUser();
// 2. Validación de seguridad
  if (user?.role !== 'ADMIN' && user?.role !== 'USER') {
    
    // REDIRECCIÓN DE SERVIDOR
    // Nota: redirect() lanza un error interno de Next.js que detiene 
    // la ejecución del componente y manda al usuario a la nueva ruta.
      redirect(`/${user?.slug}/unauthorized`);
   
  }


  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      headers: {
        'Content-Type': 'application/json',
        'x-token': `${token}`
      },
     // credentials: "include",
      next: { revalidate: 30 }
    });

    if (res.status === 401 || res.status === 403) {
      return { users: [], errorMessage: 'Acceso denegado. No tienes permisos para gestionar usuarios.' };
    }

    if (!res.ok) {
      return { users: [], errorMessage: 'Hubo un problema al conectar con el servidor.' };
    }
    console.log(" res usuarios ", res)

    const data = await res.json();
    return { users: data, errorMessage: null };

  } catch (error) {
    console.error("Error crítico:", error);
    return { users: [], errorMessage: 'El servidor está fuera de línea. Intenta de nuevo más tarde.' };
  }
}

// 2. PÁGINA PRINCIPAL
export default async function UseresPage() {
  // ¡IMPORTANTE! Agregamos el await aquí
  const { users, errorMessage } = await getUsers();
  
  const cookieStore = await cookies();
  const slug = cookieStore.get('slug')?.value;
  const businessId = cookieStore.get('businessId')?.value;
  // Obtenemos el businessId del primer usuario si existe, o del contexto si lo tuvieras
 // const businessId = users.length > 0 ? users[0]?.businessId : '';

  // --- VISTA DE ERROR AMIGABLE ---
  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="bg-danger/10 p-5 rounded-full mb-4">
          {errorMessage.includes('permisos') ? (
            <Lock size={48} className="text-danger" />
          ) : (
            <AlertCircle size={48} className="text-danger" />
          )}
        </div>
        <h2 className="text-2xl font-black text-brand-black uppercase italic tracking-tighter">
          {errorMessage.includes('permisos') ? 'Sin Autorización' : 'Algo salió mal'}
        </h2>
        <p className="text-gray-500 text-sm max-w-xs mt-2 mb-6">
          {errorMessage}
        </p>
        <Link 
          href={`/${slug}/dashboard`}
          className="bg-brand-black text-brand-white px-8 py-3 rounded-xl font-bold uppercase text-xs hover:scale-105 transition-all"
        >
          Volver al Panel
        </Link>
      </div>
    );
  }

  // --- VISTA NORMAL DE ÉXITO ---
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="text-brand-primary" size={24} />
            <h1 className="text-2xl font-black text-brand-black uppercase tracking-tight">
              Directorio de Usuarios
            </h1>
          </div>
          <p className="text-gray-500 text-sm">Gestiona la base de datos de usuarios de tu complejo.</p>
        </div>

        <Link href={`/${slug}/add-user?businessId=${businessId}`}> 
          <button className="flex items-center gap-2 bg-brand-gold text-brand-black hover:bg-brand-black hover:text-brand-gold px-4 py-3 
          rounded-xl font-black text-xs transition-all shadow-lg shadow-brand-accent/20 uppercase transition duration-400 ease-in-out">
            <UserPlus size={18} />
            Registrar Usuario Cliente
          </button>
        </Link>   
      </header>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.length > 0 ? (
          users.map((user) => (
            <ClientCard key={user.uid} user={user} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-brand-light rounded-2xl border-2 border-dashed border-brand-gray">
            <Users className="mx-auto text-brand-gray mb-3" size={40} />
            <p className="text-gray-400 font-bold italic text-sm">No se encontraron clientes vinculados a este negocio.</p>
          </div>
        )}
      </div>
    </div>
  );
}