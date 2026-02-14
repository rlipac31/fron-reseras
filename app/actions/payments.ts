// app/actions/payments.ts
"use server";
import { PaymentDataRequest } from "@/types";
import { cookies } from "next/headers";

export async function createPayment(formData: PaymentDataRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if(!token){
  //const errorData = await res.json();
      throw new Error(  "Eno existe token en la peticion");
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

    return { success: true, content:data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}