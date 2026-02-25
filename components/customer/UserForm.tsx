"use client";
import { useState } from 'react';
import {
    CheckCircle2,
    Loader2,
    User,
    Mail,
    Lock,
    Fingerprint,
    Phone,
    UserPlus,
    X,
    AlertCircle
} from 'lucide-react';
import { createCustomer } from '@/app/actions/customer';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function UserForm({ businessId }: { businessId: string }) {
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const router = useRouter();
    const { user } = useUser();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        dni: '',
        phone: ''
    });

    // --- VALIDACIONES EN TIEMPO REAL ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // 1. Solo números para DNI (máx 8)
        if (name === 'dni') {
            const onlyNums = value.replace(/[^0-9]/g, '');
            if (onlyNums.length <= 8) {
                setFormData(prev => ({ ...prev, [name]: onlyNums }));
            }
            return;
        }

        // 2. Solo números para Teléfono (máx 10)
        if (name === 'phone') {
            const onlyNums = value.replace(/[^0-9]/g, '');
            if (onlyNums.length <= 10) {
                setFormData(prev => ({ ...prev, [name]: onlyNums }));
            }
            return;
        }

        // 3. Solo letras para el Nombre (evitar números en nombres)
        if (name === 'name') {
            const onlyLetters = value.replace(/[0-9]/g, '');
            setFormData(prev => ({ ...prev, [name]: onlyLetters }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        // --- VALIDACIONES ANTES DE ENVIAR ---
        if (formData.dni.length > 0 && formData.dni.length !== 8) {
            setErrorMsg("El DNI debe tener exactamente 8 números");
            return;
        }

        if (formData.phone.length < 9) {
            setErrorMsg("El número de WhatsApp debe tener entre 9 y 10 dígitos");
            return;
        }

        if (formData.password.length < 6) {
            setErrorMsg("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);
        const result = await createCustomer({ ...formData, businessId });

        if (result.success) {
            setLoading(false);
            setShowSuccess(true);
            setTimeout(() => {
                router.push(`/${user?.slug}/dashboard/customers`);
                router.refresh();
            }, 1500);
        } else {
            setLoading(false);
            setErrorMsg(result.error || "Ocurrió un error inesperado");
        }
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            {/* MODAL DE ÉXITO */}
            {showSuccess && (
                <div className="fixed inset-0 bg-brand-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-brand-gold text-brand-black rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-brand-black uppercase italic">¡Deportista registrado!</h3>
                        <p className="text-gray-500 mt-2 font-medium">Ya puede realizar sus reservas.</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-brand-gray overflow-hidden shadow-2xl">
                {/* HEADER */}
                <div className="bg-brand-black p-6 flex items-center justify-between border-b-4 border-brand-gold">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                            <UserPlus size={24} className="text-brand-gold" /> Ficha de Cliente
                        </h2>
                    </div>
                    <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

                    {/* MENSAJE DE ERROR */}
                    {errorMsg && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 animate-shake">
                            <AlertCircle className="text-red-500 shrink-0" size={20} />
                            <p className="text-red-800 text-xs font-bold uppercase">{errorMsg}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* NOMBRE */}
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[11px] font-black text-brand-black uppercase ml-1 flex items-center gap-1.5">
                                <User size={14} className="text-brand-gold" /> Nombre y Apellidos <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type='text'
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-brand-gray rounded-xl text-sm focus:border-brand-black focus:ring-4 focus:ring-brand-gold/20 outline-none transition-all font-semibold"
                                placeholder='Nombre del jugador'
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-brand-black uppercase ml-1 flex items-center gap-1.5">
                                <Mail size={14} className="text-brand-gold" /> Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type='email'
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-brand-gray rounded-xl text-sm focus:border-brand-black focus:ring-4 focus:ring-brand-gold/20 outline-none transition-all font-semibold"
                                placeholder='ejemplo@gmail.com'
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-brand-black uppercase ml-1 flex items-center gap-1.5">
                                <Lock size={14} className="text-brand-gold" /> Contraseña <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type='password'
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-brand-gray rounded-xl text-sm focus:border-brand-black focus:ring-4 focus:ring-brand-gold/20 outline-none transition-all font-semibold"
                                placeholder='Mín. 6 caracteres'
                            />
                        </div>

                        {/* DNI */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-brand-black uppercase ml-1 flex items-center gap-1.5">
                                <Fingerprint size={14} className="text-brand-gold" /> DNI <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type='text'
                                name="dni"
                                value={formData.dni}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-brand-gray rounded-xl text-sm focus:border-brand-black focus:ring-4 focus:ring-brand-gold/20 outline-none transition-all font-semibold"
                                placeholder='8 números'
                            />
                        </div>

                        {/* WHATSAPP */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-brand-black uppercase ml-1 flex items-center gap-1.5">
                                <Phone size={14} className="text-brand-gold" /> WhatsApp <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type='text'
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                minLength={7}
                                maxLength={10}
                                className="w-full px-4 py-3 bg-gray-50 border border-brand-gray rounded-xl text-sm focus:border-brand-black focus:ring-4 focus:ring-brand-gold/20 outline-none transition-all font-semibold"
                                placeholder='9999999990'
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-brand-gold text-brand-black font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-brand-gold/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.98]"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            "Registrar Cliente Ahora"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}