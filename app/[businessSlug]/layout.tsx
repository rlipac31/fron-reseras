import { UserProvider } from '@/context/UserContext';
import { cookies } from 'next/headers';
import { Toaster } from 'sonner';
import Sidebar from '../../components/Sidebar';
import MobileNavbar from "@/components/MobileNavbar";
import { redirect } from 'next/navigation';

import { getServerUser } from '@/app/actions/userServer'; // La función que creamos antes

  // 1. Define la interfaz de params como una Promesa
interface LayoutParams {
  businessSlug: string;
}
export default async function SlugLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode;
  params: Promise<LayoutParams>; // Definimos que params es una Promesa
}) {
  // 2. Esperamos a la promesa de params
  const resolvedParams = await params;
  const { businessSlug } = resolvedParams;
  console.log(" busnessSlug desde layout businesSlug ", businessSlug)
  
  // 1. Obtenemos los datos decodificando el token en el servidor (Sin fetch extra)
  const userData = await getServerUser();
  //console.log("data::: desde slugLayout ", userData)

  // 2. VALIDACIÓN DE SEGURIDAD: 

 
  if (userData && userData.slug !== businessSlug) {
     console.log("Acceso no autorizado para este slug");
     redirect(`/${userData.slug}/unauthorized`); // Opcional
  }


  return (
    // Pasamos el userData recuperado (ya no incluimos el campo token)
    <UserProvider initialUser={userData}>

      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar
          key={userData?.uid || 'guest'}
          slug={userData?.slug || 'intimos'}
        /> 

        <MobileNavbar
          business={userData?.slug || ''}
        />  

        <main className="flex-1 flex flex-col overflow-hidden px-0">
          <header className="h-16 bg-brand-white border-b border-brand-gray/20 flex items-center justify-between px-8">
            <h1 className="text-brand-black font-semibold uppercase tracking-tight">Panel de Control</h1>
            <div className="flex items-center gap-3">
              {userData && (
                <>
                  <span className="text-sm text-brand-black/60 italic">Hola, {userData.nameUser}</span>
                    <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-brand-black font-bold">
                    {userData.nameUser[0]} 
                  </div>
                </>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto bg-gray-100 mx-auto">
            {children}
            <Toaster
              toastOptions={{
                style: { background: '#000814', color: '#ffffff', border: '1px solid #FFC300' },
              }}
              position="top-right" richColors closeButton 
            />
          </div>
        </main>
      </div>
    </UserProvider>
  );
}