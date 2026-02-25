"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-brand-black transition-colors "
        >
            <ArrowLeft size={18} />
            Regresar
        </button>
    );
}
