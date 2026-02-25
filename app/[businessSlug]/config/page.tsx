// app/dashboard/configuracion/page.tsx
import { cookies } from "next/headers";
import { getServerUser } from '@/app/actions/userServer';
import { redirect } from 'next/navigation';
import ConfigPageClient from '@/components/configuracion/ConfigForm'; // Importamos el formulario

// Esta función obtiene los datos de tu API de Express
async function getConfig() {
    const user = await getServerUser();
   // console.log("user desde getConfig: ", user?.configId);
     if(user?.role !== 'ADMIN'){
         redirect(`/${user?.slug}/unauthorized`);
     }


  try {
     const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
    const res = await fetch(`http://localhost:4000/api/config/${user?.configId}`, {
       headers: {
      'x-token': `${token}`, // O el nombre que use tu header
      'Content-Type': 'application/json'

    },
      cache: 'no-store', // Esto evita que los datos se queden antiguos (siempre frescos)
      // Si usas tokens, aquí deberías mandarlo en los headers
    });

    if (!res.ok) return null;
    //console.log("Respuesta de config: ", res);
    return res.json();
  } catch (error) {
    console.error("Error al obtener config:", error);
    return null;
  }
}

export default async function Page() {
  // 1. Obtenemos los datos en el servidor
  const configData = await getConfig();
 // console.log("configData desde page configuracion: ", configData);

  // 2. Se los pasamos al componente cliente (el formulario)
  return (
    <main className="min-h-screen bg-brand-gray/20">
      <ConfigPageClient initialData={configData.content} />
    </main>
  );
}