import { getUserId } from "@/app/actions/user";
import { getServerUser } from "@/app/actions/userServer";
import EditUserForm from "@/components/usuario/EditUserForm";
import { notFound, redirect } from "next/navigation";

export default async function EditUserPage({
    params
}: {
    params: Promise<{ id: string, businessSlug: string }>
}) {
    // En Next.js 15+, params es una promesa
    const { id, businessSlug } = await params;

    const userLoggedIn = await getServerUser();

    // Validación de seguridad: Solo admin puede editar usuarios del staff
    if (userLoggedIn?.role !== 'ADMIN') {
        redirect(`/${businessSlug}/unauthorized`);
    }

    const { success, content, error } = await getUserId(id);

    if (!success || !content) {
        console.error("Error cargando usuario:", error);
        return notFound();
    }

    // Mapeamos los datos para el componente
    const userData = {
        uid: content.uid || id,
        name: content.name || '',
        email: content.email || '',
        dni: content.dni || '',
        phone: content.phone || '',
        role: content.role || 'USER'
    };

    return (
        <div className="min-h-screen bg-brand-gray/10 py-12">
            <EditUserForm
                userData={userData}
                businessSlug={businessSlug}
            />
        </div>
    );
}
