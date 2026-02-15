// app/dashboard/canchas/page.tsx


import { CalendarDays, Filter, Plus, FolderDot } from 'lucide-react';
import Link from 'next/link';
import { getFields, getFieldsSuper } from '@/app/actions/fields';
import { getServerUser} from '@/app/actions/userServer'
import FieldCard from '@/components/campos/FieldCard';  
import BtnRetry from '@/components/BtnRetry';
//import  { DatePicker } from '@/components/reserva/DatePicker'// este componenete se carga dentro de cada campo    



export default async function CamposPage() {
  // Desestructuramos y esperamos las promesas

const user = await getServerUser();
console.log("user desde page campos.... ", user)

 console.log("🔍 Página Campos - User recuperado:", user?.role);

     if (!user) {
    // Si el layout lo ve pero la página no, es un problema de caché de cookies
    return <div>Cargando sesión o sesión no encontrada...</div>;
  }   
 

  // 1. Llamamos al action

  const {success, content, error}= await getFields() 
  const fields= content;

  //console.log('Canchas obtenidas  ole ==> :', fields);
  return (
     <div className="space-y-8">
         <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
          {/*   <CalendarDays className="text-brand-gold" size={24} /> */}
            <h1 className="text-2xl font-bold text-brand-black uppercase tracking-tight">
              Gestión de Campos  
            </h1>
          </div>
          <p className="text-gray-500 text-sm">Mostrando registros totales.</p>

         {/*   <DatePicker /> */}
        </div>
    {  user?.role && user?.role =='ADMIN' &&(
        <Link href={`/${user?.slug}/dashboard/campos/admin`}>
            <button className="flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-black font-bold py-2.5 px-6 rounded-lg transition-all shadow-sm active:scale-95">
              <FolderDot size={20} />
              Administar Campos
            </button>
          </Link> 
    )}
       
      </header> 
    
       {/* 1. MOSTRAR ERROR AMIGABLE SI EXISTE */}
           {error && (
           <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4">
             <p className="text-red-500 text-xs">{error}</p>
             <BtnRetry /> {/* El componente de cliente sí permite el onClick */}
           </div>
         )}

      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
      {!error && fields && fields.length > 0 ? (
          fields.map((field: any) => (
            <FieldCard key={field?._id} field={field} />
          ))
        ) : (
          <p className="text-gray-500 italic">No se encontraron canchas registradas.</p>
        )}
      </div>

    </div>
  );
}
