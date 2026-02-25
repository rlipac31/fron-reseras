

"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getUserId(userId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!userId) return { success: false, message: "ID de campo no proporcionado" };

  try {
    const res = await fetch(`http://localhost:4000/api/users/${userId}`, {
      headers: { "x-token": token || "" }
    });

    const data = await res.json(); // Los datos crudos de tu API de Node

    if (!res.ok) {
      return { success: false, error: data || "Error al cargar" };
    }

    // Devolvemos 'data' directamente
    return { success: true, content: data.content };
  } catch (err) {
    return { success: false, error: `error tipo ${err}` };
  }
}

export async function updateUser(userId: string, formData: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!userId) return { success: false, error: "ID de usuario no proporcionado" };

  try {
    const res = await fetch(`http://localhost:4000/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-token": token || ""
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message || "Error al actualizar el usuario" };
    }

    revalidatePath("/customers");
    revalidatePath("/usuarios");
    return { success: true, content: data.user };
  } catch (err) {
    return { success: false, error: `Error de conexión: ${err}` };
  }
}



export async function deleteCustomer(customerId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    const res = await fetch(`http://localhost:4000/api/users/cusomer/${customerId}`, {
      method: "DELETE",
      headers: { "x-token": token || "" }
    });

    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message || "Error al eliminar" };

    // Esto actualiza la lista en el navegador sin recargar la página
    revalidatePath("/customers");
    return { success: true };
  } catch (err) {
    return { success: false, error: `error tipo: ${err}` };
  }
}

