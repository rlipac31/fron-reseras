'use server'
// lib/userServer.ts
import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';

export async function getServerUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  //const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2OTkwZDA4OWUyMjdjZGExNTNhZWQ0NDQiLCJuYW1lVXNlciI6IlJpY2FyZG8gTGlwYSBOYXZhcyIsInJvbGUiOiJBRE1JTiIsImJ1c2luZXNzSWQiOnsiX2lkIjoiNjk5MGNmMjRlMjI3Y2RhMTUzYWVkNDJhIiwic2x1ZyI6ImludGltb3MiLCJpZCI6IjY5OTBjZjI0ZTIyN2NkYTE1M2FlZDQyYSJ9LCJpYXQiOjE3NzExMDczNzYsImV4cCI6MTc3MTE5Mzc3Nn0.nyOxHWnbYSOGu7KwCc2nUH78KzQla-n8LUkxMBpveSM';

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