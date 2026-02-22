import { getUserId } from "@/app/actions/user"

export default async function EditCustomerPage({ params }: { params: { id: string } }) {

     const userId = params.id;

    const { success, content, error } = await getUserId(userId) // Reemplaza con el ID del usuario que deseas obtener
  
  const customer = content;
  console.log("customer desde edit page: ", customer);
  if (!success) {
    return <div>Error: {error}</div>
  }

  return (<h2>Editar Cliente</h2>)


}