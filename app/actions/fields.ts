"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { useUser } from "@/context/UserContext";
import { strict } from "assert";




export async function createField(data: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) throw new Error("No existe token de sesión");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fields`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Error al crear la reserva");
    }

    revalidatePath("/dashboard/campos"); // Para actualizar la lista de reservas
    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


  // app/actions/fields.ts

// con token invisible httpOnly
export async function getFields() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    const url =`${process.env.NEXT_PUBLIC_API_URL}/fields/lista`;
    const res = await fetch(`${url}`, {
      headers: {
        // Seguimos enviando el token al backend de Node.js
        'x-token': `${token}`, 
        'Content-Type': 'application/json'
      },
      // Importante para que Next.js no cachee datos viejos
      cache: 'no-store' 
    });
    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: `error url:  ${url}` };
    }
    // Retornamos el objeto completo (que ahora incluye el user verificado del backend)
    return { success: true, content: data.fields}
  } catch (err) {
    return { success: false, contetn:[], error: `${err}` };
  }
}

//lista completa acirvos - incactivos
export async function getFieldsCompleta() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    const url =`${process.env.NEXT_PUBLIC_API_URL}/fields/lista-completa`;
    const res = await fetch(`${url}`, {
      headers: {
        // Seguimos enviando el token al backend de Node.js
        'x-token': `${token}`, 
        'Content-Type': 'application/json'
      },
      // Importante para que Next.js no cachee datos viejos
      cache: 'no-store' 
    });
    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: `error url:  ${url}` };
    }
    // Retornamos el objeto completo (que ahora incluye el user verificado del backend)
    return { success: true, content: data.fields}
  } catch (err) {
    return { success: false, contetn:[], error: `Error de conexión ` };
  }
}
//

// LISTA TODOS LOS CMAPOS COMO USPER ADMIN
export async function getFieldsSuper() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fields/listar`, {
      headers: {
        // Seguimos enviando el token al backend de Node.js
        'x-token': `${token}`, 
        'Content-Type': 'application/json'
      },
      // Importante para que Next.js no cachee datos viejos
      cache: 'no-store' 
    });
    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Error al cargar campos" };
    }
    // Retornamos el objeto completo (que ahora incluye el user verificado del backend)
    return { success: true, content: data }; 
  } catch (err) {
    return { success: false, message: "Error de conexión" };
  }
}

export async function getfieldId(fieldId:string) {
 const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  

   try {
   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fields/${fieldId}`, {
    headers: {
      'x-token': `${token}`, // O el nombre que use tu header
      'Content-Type': 'application/json'

    },
    //next: { revalidate: 60 } // Opcional: revalida datos cada minuto
  });

    const  data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Error al cargar la lista de fileds" };
    }

// Cambia por la ruta donde se muestra el card
    
    return { success: true, message: "campos cargo correctamente", data };
  } catch (err) {
    console.error("Action Error:", err);
    return { success: false, message: "Error de conexión con el servidor" };
  }
}

export async function getUpdatefield(fieldId:string, data:any) {
 const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
   try {
   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fields/${fieldId}`, {
    method: "PUT",
    headers: {
      'x-token': `${token}`, // O el nombre que use tu header
      'Content-Type': 'application/json'

    },
     body: JSON.stringify(data),
    //next: { revalidate: 60 } // Opcional: revalida datos cada minuto
  });

    const  resUpdate = await res.json();

    if (!res.ok) {
      return { success: false, message: resUpdate.message || "Error al cargar la lsita de fileds" };
    }

// Cambia por la ruta donde se muestra el card
    
    return { success: true, message: "campos cargo correctamente", resUpdate };
  } catch (err) {
    console.error("Action Error:", err);
    return { success: false, message: "Error de conexión con el servidor" };
  }
}

// activar o desactivar estado


export async function updateStateField(fieldId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fields/${fieldId}`, {
      method: 'PATCH',
      headers: {
        'x-token': `${token}`, // Verifica que tu backend use 'token' y no 'Authorization'
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    if (!res.ok) {
      // Si el backend devuelve status 404, 400 o 500, entrará aquí
      return { success: false, message: data.message || "No se pudo eliminar el campo" };
    }

    // Importante: Revalida la ruta para que los cambios se vean sin refrescar manualmente
    revalidatePath('/[slug]/dashboard/campos/admin', 'page');

    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, message: "Error de conexión con el servidor" };
  }
}

// Asegúrate de importar revalidatePath para limpiar la caché de Next.js


export async function deleteField(fieldId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fields/${fieldId}`, {
      method: 'DELETE',
      headers: {
        'x-token': `${token}`, // Verifica que tu backend use 'token' y no 'Authorization'
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    if (!res.ok) {
      // Si el backend devuelve status 404, 400 o 500, entrará aquí
      return { success: false, message: data.message || "No se pudo eliminar el campo" };
    }

    // Importante: Revalida la ruta para que los cambios se vean sin refrescar manualmente
    revalidatePath('/[slug]/dashboard/campos/admin', 'page');

    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, message: "Error de conexión con el servidor" };
  }
}