"use server";

import { UserData, useUser } from "@/context/UserContext";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export type LoginResponse =
  | { success: true; user: UserData }
  | { success: false; message: string };
//import { useRouter } from "next/router";
/* 
export async function logout() {
  const cookieStore = await cookies();

  // Eliminamos todas las cookies relacionadas con la sesión
     cookieStore.delete("token");
     cookieStore.delete("user_role");
     cookieStore.delete("user_name");
     cookieStore.delete("business_name");
     cookieStore.delete("id_user"); 


  redirect("/login");
} */
export async function logout() {
  const cookieStore = await cookies();

  // 1. Borramos las cookies de sesión
  cookieStore.delete("token");
  cookieStore.delete("user_name");
  cookieStore.delete("user_role");
  cookieStore.delete("user_slug");

  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
    });
  } catch (error) {
    console.error("Error al notificar al backend logout");
  }

  // 2. Redirigir SIEMPRE fuera del try/catch
  redirect("/login");
}

export async function checkEmailAction(email: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error checkEmailAction", error);
    return { success: false, message: "Error al conectar con el servidor" };
  }
}





// export async function loginAction(formData: any): Promise<LoginResponse> {
//   // const cookieStore = await cookies();

//   try {
//     const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

//     const res = await fetch(apiUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//       credentials: 'include', // REQUERIDO para que el navegador guarde la cookie
//     });


//     const data = await res.json();

//     if (data.success) {
//       // Intentamos capturar el token de donde venga (token o accessToken)

//       //redirect(`/${data?.user?.slug}/dashboard`)
//       // Devolvemos el usuario mapeando id -> uid para que tu UserData esté feliz
//       return {
//         success: true,
//         user: {
//           ...data.user,
//           uid: data.user.id || data.user.uid // Mapeo simple para evitar el error de tipos
//         }
//       };
//     }

//     return { success: false, message: data.message || "Credenciales inválidas" };
//   } catch (error: any) {
//     return { success: false, message: "Error de conexión" };
//   }
// }





// export async function verifySession() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('token')?.value;

//   if (!token) return { success: false };
//   console.error("token desde verifySession", token);

//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
//       method: "GET",
//       headers: {
//         'Content-Type': 'application/json',
//         'x-token': token,
//       },
//       credentials: 'include', // REQUERIDO para que el navegador guarde la cookie
//       // Important: if your backend expects cookies, credentials should be handled carefully in Server Actions
//     });



//     if (res.ok) {
//       const data = await res.json();
//       // También normalizamos aquí si fuera necesario
//       const normalizedUser = {
//         ...data.user,
//         slug: data.user.configBusiness?.slug || data.user.slug,
//         role: data.user.businessId === 'ADMIN' ? 'ADMIN' : data.user.role
//       };
//       return { success: true, user: normalizedUser };
//     }
//     return { success: false };
//   } catch (error) {
//     console.error("Error verifying session", error);
//     return { success: false };
//   }
// }

export interface LoginRequest {
  email: string;
  password: string;
  businessId?: string;
}

export async function loginAction(data: LoginRequest) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    // Esto es vital para que el servidor de Next.js reciba la cookie del backend
    credentials: 'include',
  });

  const result = await response.json();

  if (response.ok && result.success) {
    // 1. Extraer la cookie 'token' que mandó el backend
    const setCookieHeader = response.headers.get('set-cookie');

    if (setCookieHeader) {
      // Usamos la librería de Next.js para escribirla en el navegador del usuario
      // Tienes que parsear el valor del token de la cadena setCookieHeader 
      // o simplemente extraer el valor si sabes el nombre
      const token = setCookieHeader.split(';')[0].split('=')[1];

      (await cookies()).set('token', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        secure: true,
        sameSite: 'none',
        path: '/',
      });
    }

    return { success: true, user: result.user };
  }

  return { success: false, message: result.message };
}
export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return { success: false };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        // ENVIAMOS EL TOKEN MANUALMENTE AL BACKEND
        'x-token': `${token}`,
        // Si tu backend usa Bearer token, usa esta línea:
        // 'Authorization': `Bearer ${token}` 
      },
      // cache: 'no-store' // Recomendado para verificar sesiones
    });


    if (res.ok) {
      const data = await res.json();

      const normalizedUser = {
        ...data.user,
        slug: data.user.configBusiness?.slug || data.user.slug,
        role: data.user.businessId === 'ADMIN' ? 'ADMIN' : data.user.role
      };
      return { success: true, user: normalizedUser };
    }

    return { success: false };
  } catch (error) {
    console.log("token desde verifySessiion", cookieStore);

    console.error("Error verifying session", error);
    return { success: false };
  }
}