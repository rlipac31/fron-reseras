 // app/actions/assCustomer.ts
"use server";
import { bookingRequest, userRequest } from "@/types";
import { cookies } from "next/headers";

export async function createCustomer(formData: userRequest) {
  const cookieStore = await cookies();
 const token = cookieStore.get("token")?.value;
   if(!token){
  //const errorData = await res.json();
      throw new Error(  "Eno existe token en la peticion");
  } 
  try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_UR}/users/add-customer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // CLAVE: Esto le dice al navegador que envíe las cookies seguras automáticamente
          credentials: "include", 
          body: JSON.stringify(formData),
      });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al procesar el pago");
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

//lsita customers

export async function getCustomers() {
 const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  

   try {
   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/customers`, {
    headers: {
      'x-token': `${token}`, // O el nombre que use tu header
      'Content-Type': 'application/json'

    },
              // CLAVE: Esto le dice al navegador que envíe las cookies seguras automáticamente
    credentials: "include", 
    //next: { revalidate: 60 } // Opcional: revalida datos cada minuto
  });

    const result = await res.json();

    if (!res.ok) {
      return { success: false, message: result.message || "Error al cargar la lsita de Bookings" };
    }

// Cambia por la ruta donde se muestra el card
    
    return { success: true, message: "campos cargo correctamente", content:result };
  } catch (err) {
    console.error("Action Error:", err);
    return { success: false, message: "Error de conexión con el servidor" };
  }
}

