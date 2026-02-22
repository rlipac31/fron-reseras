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
      businessId: payload.businessId?._id
    };
  } catch (error) {
    return null;
  }
}