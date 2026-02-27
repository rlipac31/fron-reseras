// app/actions/assCustomer.ts
"use server";
import { bookingRequest } from "@/types/booking";
import { userRequest } from "@/types/user";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createCustomer(formData: userRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    //const errorData = await res.json();
    throw new Error("Eno existe token en la peticion");
  }
  try {
    const urlLocal = `${process.env.NEXT_PUBLIC_API_URL}/users/add-customer`;
    console.log("url desde action customer: ", urlLocal);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/add-customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-token": token || "", // Tu header de token
      },
      // CLAVE: Esto le dice al navegador que envíe las cookies seguras automáticamente
      // credentials: "include", 
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.log("error desde action customer: ", errorData);
      // throw new Error(errorData.message ||`error tipo: ${res}`);
      return { success: false, error: errorData.message || `Error al crear el cliente. Status: ${res.status}` };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// lista customers

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

    return { success: true, message: "campos cargo correctamente", content: result };
  } catch (err) {
    console.error("Action Error:", err);
    return { success: false, message: "Error de conexión con el servidor" };
  }
}

export async function deleteCustomer(customerId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!customerId) return { success: false, error: "ID de cliente no proporcionado" };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/customer/${customerId}`, {
      method: "DELETE",
      headers: {
        "x-token": token || ""
      }
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message || "Error al eliminar el cliente" };
    }

    revalidatePath("/customers");
    return { success: true };
  } catch (err) {
    return { success: false, error: `Error de conexión: ${err}` };
  }
}

