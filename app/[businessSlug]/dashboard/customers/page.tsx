import { getServerUser } from "@/app/actions/userServer";
import UserCard from "@/components/usuario/UserCard";
import {Users}from 'lucide-react';
import { cookies } from 'next/headers';
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserType } from "@/types/user";



// Define una interfaz para el objeto que viene de la API
interface CustomerType {
  uid: string;
  name: string;
  email: string;
  dni: string;
  phone: string;
  state:boolean;
  role: string;
  businessId: {
    id: string;
    slug: string;
    name: string;
    description: string;
  };
}



// Simulando la respuesta de tu backend
const getCustomers = async () => {


const user = await getServerUser();
console.log("user desde page customers: ", user);

 
if(user?.role !== 'ADMIN' && user?.role !== 'USER'){
   redirect(`/${user?.slug}/unauthorized`);
} 

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    // Si no hay token, no intentes el fetch, retorna vacío
if (!token) {
  console.error("Token no encontrado en cookies");
  return [];
}


   

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/customers`, {
      headers: {
        'x-token': `${token}`,
        'Content-Type': 'application/json'
      },

    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("LOG SERVIDOR - Error detectado:", error);
    return [];
  }
};



export default async function CustomersPage() {
const user = await getServerUser();

  const customers = await getCustomers();
//  console.log("lista de clientes ", customers);

  return (
    <main className="p-8 bg-[#f8f9fa] min-h-screen">
      {/* Header de la sección */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users /> 
             <span className="text-2xl font-bold text-brand-black">DIRECTORIO DE CLIENTES</span>
          </div>
          <p className="text-gray-500 text-sm">
            Gestiona la base de datos de usuarios de tu complejo.holaaa
          </p>
        </div>
        <Link href={`/${user?.slug}/dashboard/customers/save`} className="self-start">
          <button className="bg-brand-gold hover:bg-yellow-500 text-brand-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-md text-sm uppercase">
            <span className="text-xl">+</span> Registrar Cliente
          </button>
        </Link>
      </header>
{customers.length==0 ? (<p className="text-gray-500">No hay usuarios registrados.</p>):

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
       {customers.map((customer: CustomerType) => (
          <UserCard key={customer.uid} user={customer} />
        ))}
      </div>}
      {/* Grid de Usuarios */}
    
    </main>
  );
}