'use client'
import { useState } from 'react';
import {
    CheckCircle, Clock, XCircle, Smartphone, Banknote, CreditCard,
    Loader2, AlertTriangle, Trash2, X, Info, TicketSlash, TicketX,
    Currency
} from 'lucide-react';
import { confirmPaymentAction, cancelPaymentAction } from '@/app/actions/payments';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';



const statusStyles: any = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    COMPLETED: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const methodStyles: any = {
    PAGO_MOVIL: "bg-purple-100 text-purple-700 border-purple-200",
    CASH: "bg-emerald-100 text-emerald-700 border-emerald-200",
    CREDIT_CARD: "bg-blue-100 text-blue-700 border-blue-200",
    DEBIT_CARD: "bg-sky-100 text-sky-700 border-sky-200",
};

export function PagosTable({ datos }: { datos: any[] }) {

    const { user } = useUser();
    // console.log("user desde pagosTable ", user);

    const [loading, setLoading] = useState(false);
    const [pagoSeleccionado, setPagoSeleccionado] = useState<any | null>(null);
    const [tipoAccion, setTipoAccion] = useState<'CONFIRMAR' | 'CANCELAR' | null>(null);

    const handleProcessAction = async () => {
        if (!pagoSeleccionado || !tipoAccion) return;

        setLoading(true);
        const res = tipoAccion === 'CONFIRMAR'
            ? await confirmPaymentAction(pagoSeleccionado._id)
            : await cancelPaymentAction(pagoSeleccionado._id);

        if (res.success) {
            cerrarModal();
        } else {
            alert(res.message);
        }
        setLoading(false);
    };

    const cerrarModal = () => {
        setPagoSeleccionado(null);
        setTipoAccion(null);
    };

    return (
        <div className="relative">
            {/* --- MODAL ÚNICO DINÁMICO --- */}
            {pagoSeleccionado && (
                <div className="fixed inset-0 bg-brand-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                        {/* Header condicional según la acción */}
                        <div className={`p-6 text-center ${tipoAccion === 'CONFIRMAR' ? 'bg-brand-black' : 'bg-red-600'}`}>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${tipoAccion === 'CONFIRMAR' ? 'bg-brand-gold' : 'bg-white'}`}>
                                {tipoAccion === 'CONFIRMAR' ? <CheckCircle size={32} className="text-brand-black" /> : <Trash2 size={32} className="text-red-600" />}
                            </div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                                {tipoAccion === 'CONFIRMAR' ? 'Confirmar Pago' : 'Cancelar Pago'}
                            </h3>
                        </div>

                        <div className="p-8 text-center">
                            <p className="text-gray-500 text-sm leading-relaxed">
                                ¿Estás seguro de que deseas marcar como
                                <strong className={tipoAccion === 'CONFIRMAR' ? 'text-green-600' : 'text-red-600'}> {tipoAccion === 'CONFIRMAR' ? 'COMPLETADO' : 'CANCELADO'} </strong>
                                el pago de:
                                <span className="block font-black text-brand-black text-lg mt-1">{pagoSeleccionado.nameCustomer}</span>
                                por <strong className="text-brand-black">{user?.currency?.symbol || 'S/'} {pagoSeleccionado.total.toFixed(2)}</strong>.
                            </p>

                            <div className="grid grid-cols-2 gap-3 mt-8">
                                <button
                                    onClick={cerrarModal}
                                    className="px-4 py-3 border-2 border-brand-gray rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all"
                                >
                                    Volver
                                </button>
                                <button
                                    onClick={handleProcessAction}
                                    disabled={loading}
                                    className={`px-4 py-3 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg ${tipoAccion === 'CONFIRMAR' ? 'bg-brand-black hover:bg-brand-black/90' : 'bg-red-600 hover:bg-red-700'}`}
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : 'Confirmar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TABLA --- */}
            <div className="overflow-x-auto bg-white rounded-2xl border border-brand-gray/50 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-brand-black text-brand-gold text-[11px] font-black uppercase tracking-widest">
                            <th className="px-4 py-4">Cliente / Fecha</th>
                            <th className="px-4 py-4 text-center">User Creador</th>
                            {/*   <th className="px-4 py-4 text-center">Info Reserva</th> */}

                            <th className="px-4 py-4 text-center">Monto</th>
                            <th className="px-4 py-4 text-center">Metodo De Pago</th>
                            <th className="px-4 py-4 text-center">Total</th>
                            <th className="px-4 py-4">Estado</th>
                            <th className="px-4 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-gray/50 ">
                        {datos.map((row) => (
                            <tr key={row._id} className="hover:bg-brand-gray/40 transition-colors">
                                <td className="px-4 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-brand-black text-sm">{row.nameCustomer}</span>
                                        <span className="text-[10px] text-gray-400">{dayjs(row.paymentDate).format('DD/MM/YY hh:mm A')}</span>
                                    </div>
                                </td>

                                <td className="px-4 py-4 items-center text-center">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-brand-black text-xs uppercase">{row.userId?.name}</span>
                                        <span className="text-[11px] text-gray-400">{row.userId?.email}</span>
                                    </div>
                                </td>

                                <td className="px-4 py-4 items-center text-center font-black text-sm">
                                    <span className="flex items-center gap-1  font-medium justify-center">Precio: {user?.currency?.symbol || 'S/'}{row.amount}</span>
                                    <div className='text-[10px] font-medium text-gray-500 uppercase'>Descuento: -%{row.descuento}</div>
                                </td>
                                <td className="px-4 py-4 items-center text-center">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase ${methodStyles[row.paymentMethod]}`}>
                                        {row.paymentMethod === 'PAGO_MOVIL' && <Smartphone size={12} />}
                                        {row.paymentMethod === 'CASH' && <Banknote size={12} />}
                                        {(row.paymentMethod.includes('CARD')) && <CreditCard size={12} />}
                                        {row.paymentMethod.replace('_', ' ')}
                                    </div>
                                    <div className='text-gray-700 text-[14px] uppercase font-bold mt-2'>{row.phonePayment}</div>
                                </td>

                                <td className="px-1 py-4 items-center text-center font-black text-sm">{user?.currency?.symbol || 'S/'} {row.total.toFixed(2)}</td>
                                <td className="px-4 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${statusStyles[row.status]}`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <div className="flex justify-end gap-2 items-center">
                                        <Link
                                            href={`/${user?.slug}/dashboard/pagos/${row._id}`}
                                            className="p-2 text-gray-400 hover:text-brand-gold hover:bg-brand-black/5 rounded-xl transition-all"
                                            title="Ver Detalle"
                                        >
                                            <Info size={24} />
                                        </Link>

                                        {row.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => { setPagoSeleccionado(row); setTipoAccion('CANCELAR'); }}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Cancelar Pago"
                                                >
                                                    <Trash2 size={24} />
                                                </button>
                                                <button
                                                    onClick={() => { setPagoSeleccionado(row); setTipoAccion('CONFIRMAR'); }}
                                                    className="bg-brand-gold text-brand-black text-[10px] font-black px-4 py-2 rounded-xl hover:bg-brand-black hover:text-brand-gold transition-all shadow-sm"
                                                >
                                                    CONFIRMAR
                                                </button>
                                            </>
                                        )}
                                        {row.status !== 'PENDING' && (
                                            <span className="text-[10px] font-bold text-gray-300 uppercase italic">Ya Procesado</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}