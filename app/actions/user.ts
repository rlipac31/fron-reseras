

"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getUserId(userId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!userId) return { success: false, message: "ID de campo no proporcionado" };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
      headers: { "x-token": token || "" }
    });
    
    const data = await res.json(); // Los datos crudos de tu API de Node
    
    if (!res.ok) {
      return { success: false, message: data.message || "Error al cargar" };
    }

    // Devolvemos 'data' directamente
    return { success: true,  content:data }; 
  } catch (err) {
    return { success: false, error: `error tipo ${err}` };
  }
}
