'use server'
// lib/userServer.ts
import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';

 export async function getServerUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) return null;

  try {
    // Decodificamos el payload que mostraste en TOKEN_CLAM.png
    const payload: any = decodeJwt(token);
    
    return {
      uid: payload.uid,
      nameUser: payload.nameUser,
      role: payload.role,
      slug: payload.businessId?.slug,
      businessId: payload.businessId?._id,
      currency: payload.configBusiness.currency || null, // Si tu backend envía esta info, la capturamos
      zonaHoraria: payload.configBusiness.zonaHoraria || null, 
      configId: payload.configBusiness._id || null,
    };
  } catch (error) {
    return null;
  }
}

/* 
export async function getServerUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) return null;

  try {
    // 1. Decodificamos el token para obtener el ID del negocio
    const payload: any = decodeJwt(token);
    const businessId = payload.businessId?._id || payload.businessId;

    if (!businessId) return null;

    // 2. Llamamos a tu API de Node.js para obtener la config real/actualizada
    // Nota: Usamos el token original para pasar las validaciones (validarJWT)
    const response = await fetch(`http://localhost:4000/api/config/business/${businessId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-token': token, // O el nombre del header que espere tu middleware 'validarJWT'
      },
      next: { revalidate: 3600 } // Opcional: cachea el resultado por una hora
    });

    if (!response.ok) {
      console.error("Error al obtener config del backend");
      // Si falla la API, podrías devolver lo que hay en el token como fallback
    }

    const data = await response.json();
    const configRemote = data.content;

    // 3. Retornamos el objeto unificado
    return {
      uid: payload.uid,
      nameUser: payload.nameUser,
      role: payload.role,
      slug: payload.businessId?.slug,
      businessId: businessId,
      // Priorizamos los datos que vienen frescos de la base de datos
      currency: configRemote?.currency || payload.configBusiness?.currency,
      zonaHoraria: configRemote?.zonaHoraria || payload.configBusiness?.zonaHoraria,
      configId: configRemote?._id || payload.configBusiness?._id,
    };

  } catch (error) {
    console.error('Error en getServerUser:', error);
    return null;
  }
} */