// app/actions/dashboard.ts
"use server"
import { cookies } from "next/headers";
import { DashboardResponse } from "@/types/dashboard";

export async function getDashboardData() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return { success: false, error: "Sesión no válida" };
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
            headers: {
                'x-token': token,
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`Error de Dashboard API: ${res.status}`);
            return { success: false, error: "Error al obtener datos del dashboard" };
        }

        const result = await res.json();

        // result.data o result directamente, según lo que devuelva tu API de Node.js
        // En este caso, asumimos que devuelve el objeto con kpis, timeline, etc.
        return {
            success: true,
            data: result as DashboardResponse
        };

    } catch (error) {
        console.error("Error en getDashboardData:", error);
        return { success: false, error: "Error de conexión con el servidor" };
    }
}
