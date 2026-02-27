

"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createBooking(data: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("No existe token de sesión");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
      // CLAVE: Esto le dice al navegador que envíe las cookies seguras automáticamente
      credentials: "include",
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
//url get bookeg con filtro

//// Ejemplo para obtener los últimos 7 días con límite de 20
//const url = `http://localhost:4000/api/bookings?filter=7days&limit=20&page=1`;

export async function getBookingsConFiltro(filter?: string, date?: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  // Construimos la URL con parámetros dinámicos
  const params = new URLSearchParams();
  if (filter) params.append('filter', filter);
  if (date) params.append('date', date);
  params.append('limit', '12'); // Aumentamos a 12 para el grid de 4 columnas

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings?${params.toString()}`, {
      headers: {
        'x-token': `${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Importante para que los filtros se vean reflejados al instante
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.message);

    return {
      success: true,
      data: result.data,
      meta: result.meta
    };
  } catch (err) {
    return { success: false, message: "Error de conexión", data: [], meta: {} };
  }
}


export async function getBookingsConPagination(filter?: string, date?: string, page = '1', limit = '12') {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    if (date) params.append('date', date);
    params.append('page', page);
    params.append('limit', limit);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings?${params.toString()}`, {
      headers: { 'x-token': `${token}` },
      cache: 'no-store'
    });

    // Caso 1: El servidor respondió pero con un error (404, 500, etc.)
    if (!res.ok) {
      console.error(`Error de API: ${res.status}`);
      return {
        data: [],
        meta: { totalResults: 0, page: 1, limit: 12 },
        error: "No pudimos obtener las reservas en este momento."
      };
    }

    const result = await res.json();

    return {
      data: result.data || [],
      meta: result.meta || { totalResults: 0, page: parseInt(page), limit: parseInt(limit) },
      error: null
    };

  } catch (err) {
    // Caso 2: El servidor está caído o no hay internet (Error de conexión)
    console.error("Fallo crítico de conexión:", err);

    return {
      data: [],
      meta: { totalResults: 0, page: parseInt(page), limit: parseInt(limit) },
      error: "El servicio de reservas no está disponible. Por favor, intenta más tarde."
    };
  }
}



// app/actions/bookings.ts/// reservas con filtro pára cada campo
export async function getFieldIdReservations(fieldId: string, date?: string) {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  //const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/campo/${fieldId}/reservas?${params.toString()}`, {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/campo/${fieldId}/reservas?${params.toString()}`, {
    headers: { 'x-token': `${token}` },
    cache: 'no-store'
  });

  const result = await res.json();
  return {
    status: result.status,
    data: result.data || [],
    meta: result.metadata || { totalResults: result.result }

  };
}


export async function getBookingId(bookingId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!bookingId) return { success: false, message: "ID de campo no proporcionado" };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`, {
      headers: { "x-token": token || "" }
    });

    const data = await res.json(); // Los datos crudos de tu API de Node

    if (!res.ok) {
      return { success: false, message: data.message || "Error al cargar" };
    }

    // Devolvemos 'data' directamente
    return { success: true, message: "Carga exitosa", content: data };
  } catch (err) {
    return { success: false, message: "Error de conexión" };
  }
}





export async function cancelBookingAction(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!id || !token) {
    return { success: false, message: "Faltan datos requeridos" };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}/cancel`, {
      method: "GET", // O POST según tu API
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Error al cancelar" };
    }

    // Esto limpia la caché de Next.js y refresca los datos automáticamente
    revalidatePath("/dashboard/campos"); // Cambia por la ruta donde se muestra el card

    return { success: true, message: "Reserva cancelada correctamente", data };
  } catch (err) {
    console.error("Action Error:", err);
    return { success: false, message: "Error de conexión con el servidor" };
  }
}

//update booking
export async function updateBookingAction(bookingId: string, updateData: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!bookingId) return { success: false, message: "ID de reserva necesario" };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`, {
      method: 'PUT', // O PATCH según tu ruta
      headers: {
        "Content-Type": "application/json",
        "x-token": token || ""
      },
      body: JSON.stringify(updateData)
    });

    const data = await res.json();

    if (!res.ok) {
      // Aquí capturamos el error 403 de las "2 horas de anticipación"
      return {
        success: false,
        message: data.message || data.mensage || "Error al actualizar"
      };
    }

    revalidatePath("/dashboard/reservas"); // Cambia por la ruta donde se muestra el card

    return {
      success: true,
      message: "Reserva actualizada correctamente",
      content: data.documentoActualizado
    };
  } catch (err) {
    return { success: false, message: "Error de conexión con el servidor" };
  }
}