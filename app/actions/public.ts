export function getSaludo(){
    const saludo= 'hola mu nombre es richard ';

    return saludo;
}

export async function getFieldsPublic() {
    const businessId = process.env.NEXT_PUBLIC_ID_NEGOCIO;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fields/public/${businessId}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      // Importante para que Next.js no cachee datos viejos
      cache: 'no-store' 
    });
    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Error al cargar campos" };
    }
    // Retornamos el objeto completo (que ahora incluye el user verificado del backend)
    return { success: true, content: data }; 
  } catch (err) {
    return { success: false, message: "Error de conexión" };
  }
}


