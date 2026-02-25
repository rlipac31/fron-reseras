import { getUserId } from "@/app/actions/user"
import EditCustomerForm from "@/components/customer/EditCustomerForm";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string; businessSlug: string }>;
}

export default async function EditCustomerPage({ params }: PageProps) {
  const { id, businessSlug } = await params;

  const { success, content, error } = await getUserId(id);
  console.log("customer desde page edit: ", id, " succes ", success, " content ", content);

  if (!success || !content) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center">
          <p className="text-red-600 font-bold">Error al cargar el cliente</p>
          <p className="text-red-400 text-sm">{error || "Cliente no encontrado"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-gray-50/50">
      <EditCustomerForm customer={content} businessSlug={businessSlug} />
    </div>
  );
}