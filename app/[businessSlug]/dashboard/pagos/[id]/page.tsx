import { getPaymentById } from "@/app/actions/payments";
import { getServerUser } from "@/app/actions/userServer";
import BackButton from "@/components/pagos/BackButton";
import { Calendar, CreditCard, User, Landmark, Clock, Hash, CheckCircle, XCircle, AlertCircle, SmartphoneNfc } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";
//
dayjs.locale("es");

export default async function PaymentDetailPage({
    params,
}: {
    params: Promise<{ id: string; businessSlug: string }>;
}) {
    const { id } = await params;
    const user = await getServerUser();

    const { success, data: payment, error } = await getPaymentById(id);

    if (!success || !payment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <AlertCircle size={48} className="text-red-500" />
                <h2 className="text-xl font-bold text-brand-black uppercase italic">Pago No Encontrado</h2>
                <p className="text-gray-500 text-sm font-medium">{error || "El registro puede haber sido movido o eliminado."}</p>
                <BackButton />
            </div>
        );
    }

    // Cálculos para más detalles
    const startTime = dayjs(payment.bookingId?.startTime);
    const endTime = dayjs(payment.bookingId?.endTime);
    const durationHours = endTime.diff(startTime, 'hour', true);
    const pricePerHour = durationHours > 0 ? (payment.amount / durationHours).toFixed(2) : "N/A";

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return {
                    icon: <CheckCircle className="text-green-500" size={18} />,
                    text: "Confirmado",
                    bg: "bg-green-50 text-green-700 border-green-200"
                };
            case "CANCELLED":
                return {
                    icon: <XCircle className="text-red-500" size={18} />,
                    text: "Cancelado",
                    bg: "bg-red-50 text-red-700 border-red-200"
                };
            default:
                return {
                    icon: <Clock className="text-amber-500" size={18} />,
                    text: "Pendiente",
                    bg: "bg-amber-50 text-amber-700 border-amber-200"
                };
        }
    };

    const statusObj = getStatusConfig(payment.status);

    return (
        <div className="max-w-6xl mx-auto p-0 md:p-4 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ">
            {/* TOP BAR */}
            <div className="flex flex-row sm:flex-row items-center justify-between gap-2 md:gap-4 border-b border-brand-gray/30 pb-2 md:pb-6">
                <div className="w-full md:w-2/3 flex flex-row  justify-between  md:gap-8 items-center  ml-[-20px] md:ml-[0px]  ">
                    <BackButton />
                    <div className="h-8 w-[1px] bg-brand-gray/30 hidden sm:block"></div>
                    <div className="text-center sm:text-left">
                        <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em]">{payment.businessId?.slug}</span>
                        <h1 className="text-[13px] md:text-xl lg:text-2xl font-black text-brand-black uppercase italic tracking-tighter leading-none">Detalle de Operación</h1>
                    </div>
                </div>
                <div className={`px-2 md:px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm flex items-center gap-2 ${statusObj.bg}`}>
                    {statusObj.icon}
                    {statusObj.text}
                </div>
            </div>

            <div className="w-[95vw] md:w-[60vw] lg:w-auto grid grid-cols-1 lg:grid-cols-3 gap-8 ">

                {/* COLUMNA IZQUIERDA: RESUMEN FINANCIERO (TICKET STYLE) */}
                <div className="space-y-6">
                    <section className="bg-white rounded-3xl border-t-[10px] border-brand-black shadow-2xl overflow-hidden relative">
                        {/* Círculos decorativos de ticket */}
                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-brand-gray/5 rounded-full border border-brand-gray/20"></div>
                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-brand-gray/5 rounded-full border border-brand-gray/20"></div>

                        <div className="p-8 space-y-8">
                            <div className="text-center border-b border-dashed border-brand-gray/50 pb-6">
                                <Landmark className="mx-auto mb-3 text-brand-gold" size={32} />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monto Total</p>
                                <p className="text-5xl font-black text-brand-black tracking-tighter italic">
                                    <span className="text-sm align-top mr-1">{user?.currency?.symbol || "S/"}</span>
                                    {payment.total?.toLocaleString()}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs font-bold uppercase">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-brand-black">{user?.currency?.symbol || "S/"} {payment.amount}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold uppercase">
                                    <span className="text-gray-400">Descuento</span>
                                    <span className="text-green-600">-%{payment.descuento}</span>
                                </div>
                                <div className="pt-4 border-t border-dashed border-brand-gray/50 flex justify-between items-center font-black uppercase">
                                    <span className="text-brand-black text-xs">Total Realizado</span>
                                    <span className="text-brand-black text-xl italic">{user?.currency?.symbol || "S/"} {payment.total}</span>
                                </div>
                            </div>

                            <div className="bg-brand-gray/10 rounded-2xl p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <CreditCard size={18} className="text-brand-black" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-gray-400 uppercase">Método</span>
                                        <span className="text-xs font-bold text-brand-black uppercase">{payment.paymentMethod?.replace('_', ' ')}</span>

                                    </div>
                                </div>
                                {payment.phonePayment && (
                                    <div className="flex items-center gap-3">
                                        <SmartphoneNfc size={18} className="text-brand-black" />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-brand-black uppercase">{payment.phonePayment?.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <Clock size={18} className="text-brand-black" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-gray-400 uppercase">Fecha y Hora</span>
                                        <span className="text-xs font-bold text-brand-black uppercase">{dayjs(payment.paymentDate).format("DD/MM/YY - hh:mm A")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* COLUMNA DERECHA: CLIENTE Y RESERVA */}
                <div className="lg:col-span-2 space-y-6">

                    {/* TARJETA DINÁMICA DE RESERVA */}
                    {payment.bookingId && (
                        <div className="bg-brand-black rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl group">


                            <div className="relative z-10 space-y-6">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6 ">
                                    <div>
                                        <span className="bg-brand-gold text-brand-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">Espacio Reservado</span>
                                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">{payment.bookingId.fieldId?.name || "Cancha"}</h2>
                                        <p className="text-brand-white/50 text-xs font-medium uppercase tracking-wide flex items-center gap-2">
                                            <Landmark size={14} className="text-brand-gold" />
                                            {payment.bookingId.fieldId?.location || payment.businessId?.slug}
                                        </p>
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                        <div className="flex flex-col text-right">
                                            <span className="text-[9px] font-black text-brand-gold uppercase tracking-widest">Precio Especial</span>
                                            <span className="text-2xl font-black italic">
                                                {user?.currency?.symbol || "S/"} {pricePerHour} <span className="text-[10px] opacity-50 not-italic">/ HORA</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full">
                                    <div className="space-y-1">
                                        {/* <p className="text-[9px] font-black text-brand-gold uppercase tracking-wides ">id reserva: <span className="text-brand-white"> {payment.bookingId._id}</span></p> */}
                                        <p className="text-[9px] font-black text-brand-gold uppercase tracking-widest">Fecha Evento</p>
                                        <p className="text-[12px] font-bold uppercase">{dayjs(payment.bookingId.startTime).format("dddd D MMMM [del] YYYY")}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-brand-gold uppercase tracking-widest">Bloque Horario</p>
                                        <p className="text-sm font-bold uppercase">
                                            {dayjs(payment.bookingId.startTime).format("HH:mm A")} - {dayjs(payment.bookingId.endTime).format("HH:mm A")}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-brand-gold uppercase tracking-widest">Duración Total</p>
                                        <p className="text-sm font-bold uppercase">{durationHours} Horas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TARJETA DE CLIENTE Y METADATA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section className="bg-white rounded-3xl p-6 border border-brand-gray/50 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 border-b border-brand-gray/20 pb-4">
                                <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-brand-black font-black italic">
                                    {payment.nameCustomer?.charAt(0) || "C"}
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Cliente Solicitante</h3>
                                    <p className="text-sm font-black text-brand-black uppercase leading-none">{payment.nameCustomer}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <DetailItem label="Id Cliente" value={payment.idCustomer || "N/A"} />
                                <DetailItem label="DNI/Cedula" value={payment.dniCustomer || "N/A"} />
                                <DetailItem label="Referencia Operación" value={payment._id.slice(-12).toUpperCase()} />
                            </div>
                        </section>

                        <section className="bg-white rounded-3xl p-6 border border-brand-gray/50 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 border-b border-brand-gray/20 pb-4">
                                <div className="w-10 h-10 rounded-full bg-brand-black flex items-center justify-center text-brand-gold">
                                    <User size={18} />
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Registrado por</h3>
                                    <p className="text-sm font-black text-brand-black uppercase leading-none">{payment.userId?.name || "Administrador"}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <DetailItem label="Email Usuario" value={payment.userId?.email || "N/A"} />
                                <DetailItem label="Estado Registro" value="Verificado" />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center group">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-brand-gold transition-colors">{label}</span>
            <span className="text-xs font-bold text-brand-black uppercase">{value}</span>
        </div>
    );
}   
