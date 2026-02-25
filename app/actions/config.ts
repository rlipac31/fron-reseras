"use server"
import { cookies } from "next/headers";
import { revalidatePath } from 'next/cache';

export async function updateBusinessConfig(formData: any) {
     const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
  try {
    const res = await fetch(`http://localhost:4000/api/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
         'x-token': `${token}` // Agrega el token si es necesario
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.msg || "Error al actualizar");

    revalidatePath('/dashboard/configuracion');
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}