// app/actions/payments.ts
"use server"
import { revalidatePath } from 'next/cache';
import { PaymentDataRequest } from "@/types/booking";
import { cookies } from "next/headers";

export async function createPayment(formData: PaymentDataRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    //si no hay token
    throw new Error("Eno existe token en la peticion");
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-token": token || "", // Tu header de token
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al procesar el pago");
    }
    const data = res.json();

    return { success: true, content: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// listando pagos con filtro, dia semana mes y todo con dataPicker
export async function getPagosConFiltro(
  filter?: string,
  date?: string,
  method?: string, // Nuevo parámetro opcional
  page = '1',
  limit = '12'
) {
  try {
    const cookieStore = await cookies();
    const token = (await cookieStore).get('token')?.value;
    if (!token) {
      //si no hay token
      throw new Error("Eno existe token en la peticion");
    }

    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    if (date) params.append('date', date);
    if (method) params.append('method', method); // Enviamos el método a la API
    params.append('page', page);
    params.append('limit', limit);
    const urlLocal = `http://localhost:4000/api/payments/con-filtro?${params.toString()}`;
    //const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/con-filtro?${params.toString()}`, {  
    const res = await fetch(urlLocal, {
      headers: {
        'x-token': `${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error(`Error de API: ${res.status}`);
      return {
        success: false,
        data: [],
        pagination: { totalResults: 0, totalPages: 0, currentPage: parseInt(page), limit: parseInt(limit) },
        resumen: { totalGlobal: 0, porYape: 0, porEfectivo: 0, porTarjeta: 0 },
        error: "No pudimos obtener los pagos en este momento."
      };
    }

    const result = await res.json();

    // Mapeamos exactamente lo que viene de tu API de Node.js
    return {
      success: result.success,
      pagination: result.pagination, // Trae totalResults, totalPages, etc.
      resumen: result.resumenFinanciero || {
        totalGlobal: 0,
        porYape: 0,
        porEfectivo: 0,
        porTarjeta: 0
      },
      data: result.data || []
    };

  } catch (err) {
    console.error("Fallo crítico de conexión:", err);
    return {
      success: false,
      pagination: { totalResults: 0, totalPages: 0, currentPage: parseInt(page), limit: parseInt(limit) },
      data: [],
      resumen: { totalGlobal: 0, porYape: 0, porEfectivo: 0, porTarjeta: 0 },
      error: "El servicio de pagos no está disponible. Por favor, intenta más tarde."
    };
  }
}



// camniar status de pendiente a completado, es decir confirmar que el pago ya se realizo, esto se hace desde la tabla de
//  pagos, con un boton de confirmar pago, que ejecuta esta funcion, y luego revalida la pagina de pagos para mostrar
//  el cambio de estado
export async function confirmPaymentAction(paymentId: string) {
  const cookieStore = await cookies();
  const token = (await cookieStore).get('token')?.value;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}/completed`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-token': `${token}`
      },
      // Aquí deberías pasar el token si tu API lo requiere
    });

    if (!res.ok) throw new Error("Error al actualizar el pago");

    revalidatePath('/dashboard/pagos'); // Ajusta a tu ruta real
    return { success: true };
  } catch (error) {
    return { success: false, message: "No se pudo confirmar el pago" };
  }
}


//buscar doc pago por bookingId
export async function searchPaymentByBookingId(bookingId: string) {
  const cookieStore = await cookies();
  const token = (await cookieStore).get('token')?.value;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/vistaDetalle/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-token': `${token}`
      },
    });

    if (!res.ok) throw new Error("Error al buscar el pago");

    const result = await res.json();
    return { success: true, data: result.data || result.content }; // Suponiendo que viene en .data o .content
  } catch (error: any) {
    return { success: false, message: error.message || "No se pudo encontrar el pago" };
  }
}

export async function cancelPaymentAction(paymentId: string) {
  const cookieStore = await cookies();
  const token = (await cookieStore).get('token')?.value;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}/cancelled`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-token': `${token}`
      },
    });

    if (!res.ok) throw new Error("Error al cancelar el pago");

    revalidatePath('/dashboard/pagos');
    return { success: true };
  } catch (error) {
    return { success: false, message: "No se pudo cancelar el pago" };
  }
}

/**
 * Obtiene el detalle de un pago específico por su ID.
 * Utilizado para la página de detalle de pago.
 */
export async function getPaymentById(paymentId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { success: false, error: "Sesión no válida" };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/detalle/${paymentId}`, {
      headers: {
        'x-token': token,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      // Manejo específico si el backend devuelve 404
      if (res.status === 404) {
        return { success: false, error: "El pago no existe o ha sido eliminado" };
      }
      return { success: false, error: "Error al obtener el detalle del pago" };
    }

    const result = await res.json();
    return {
      success: true,
      data: result.content // Tu backend devuelve { success: true, content: payment }
    };

  } catch (error) {
    console.error("Error en getPaymentById:", error);
    return { success: false, error: "Error de conexión con el servidor" };
  }
}