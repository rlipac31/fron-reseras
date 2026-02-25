"use client";

import { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { deleteCustomer } from "@/app/actions/customer";

interface DeleteCustomerButtonProps {
    customerId: string;
    customerName: string;
}

export default function DeleteCustomerButton({ customerId, customerName }: DeleteCustomerButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    console.log("customerId =>>", customerId);
    console.log("customerName", customerName);

    // const handleDelete = async () => {
    //     setIsDeleting(true);
    //     const res = await deleteCustomer(customerId);
    //     console.log("res ==>>", res);
    //     if (res.success) {
    //         setShowModal(false);
    //     } else {
    //         // alert(res.error || "No se pudo eliminar el cliente");
    //         console.log("error desde delete customer", res);
    //     }
    //     setIsDeleting(false);
    // };


    // components/usuario/DeleteCustomerButton.tsx

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await deleteCustomer(customerId);
            console.log("Resultado de eliminación:", res);

            if (res.success) {
                setShowModal(false);
                // Opcional: podrías mostrar una notificación de éxito aquí
            } else {
                console.error("Error desde action:", res.error);
                alert(res.error || "Hubo un problema al eliminar el cliente");
            }
        } catch (e) {
            console.error("Error inesperado:", e);
        } finally {
            setIsDeleting(false);
        }
    };


    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="text-gray-400 text-xs font-bold uppercase hover:text-red-700 transition-colors cursor-pointer"
                title='Eliminar cliente'
            >
                <Trash2 size={24} className='hover:text-red-600' />
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-brand-black uppercase italic tracking-tighter">¿Eliminar Cliente?</h3>
                            <p className="text-gray-500 text-sm mt-2">
                                Vas a eliminar a <strong className='text-brand-black font-medium text-base'>{customerName}</strong>.
                                Esta acción es irreversible.
                            </p>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all uppercase text-[10px] tracking-widest"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg uppercase text-[10px] tracking-widest"
                            >
                                {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Sí, Eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
