// components/bookings/BookingForm.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import { Percent, UserCheck, UserPlus, Lock, CheckCircle2, ArrowRight, Share2, Phone } from 'lucide-react'

import { useRouter, useSearchParams } from "next/navigation";
//import { BookingInput, BookingButton } from "./BookingInput";
import { CustomerAutocomplete } from '@/components/pagos/modulos/CustomerAutocomplete'
import { BookingFormInput } from "@/types/booking";
import { SoccerField } from "@/types/field";
import { useUser } from "@/context/UserContext";

import { ErrorAlert } from "../Alert";

import dayjs from "dayjs";



interface Props {
    initialData: { fieldId: string; fieldName: string; date: string; time: string, campo: SoccerField };
}


//export default function BookingForm({ fieldId, campo }: { fieldId: string; campo: SoccerField; }) {
export default function ReservationForm({ initialData }: Props) {
    // Dentro de tu componente de formulario de reserva
    // recibios la hora y la  fecha desde boton de la hora de  campos
    const searchParams = useSearchParams();
    const preselectedTime = searchParams.get('time'); // "09:00"
    const preselectedDate = searchParams.get('date'); // "2026-02-11"


    // Combinamos fecha y hora para el valor que irá al backend
    const fullStartTime = `${initialData.date}T${initialData.time}`;
    /* frin  */

    const { user } = useUser();
    const router = useRouter()

    //  console.log("desde formulario booking: ", user)

    // cliente

    const [customers, setCustomers] = useState<any[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(true);
    //para efecto confetti
    const [isSuccess, setIsSuccess] = useState(false);
    // Nuevo estado para el toggle: false por defecto
    const [isRegistered, setIsRegistered] = useState(false);
    const [error, setError] = useState('');
    //para habilotar boton descuento
    const [showDiscount, setShowDiscount] = useState(false)
    //fin 
    const [loading, setLoading] = useState(false);
    const [errorPayment, setErrorPayment] = useState(false);
    const [formData, setFormData] = useState<Partial<BookingFormInput>>({
        fieldId: initialData.fieldId,
        //  startTime:`${preselectedDate}T${preselectedTime}`,
        startTime: `${fullStartTime}`,
        durationInMinutes: 60,
        paymentMethod: "", // Forzamos a que el usuario elija
        amount: initialData.campo?.pricePerHour,
        descuento: 0,
        total: 0,
        idUser: user?.uid,
        idCustomer: user?.role === 'CUSTOMER' ? user?.uid : undefined,
        dniCustomer: '',
        nameCustomer: user?.role === 'CUSTOMER' ? (user?.nameUser || '') : 'CONSUMIDOR FINAL',
        phonePayment: ''

    });

    //console.log("data pago de reserva campo ",formData)

    // console.log(" campo desde formulario ", campo)
    console.log(" data formulario ", formData)

    // 1. Cargamos los clientes UNA sola vez al montar el componente
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                //const url = `/api-backend/users/customers`;
                const urlLocal = `${process.env.NEXT_PUBLIC_API_URL}/users/customers`;//local
                //.log("urlLocal desde booking form ", urlLocal, "url ", url)
                const res = await fetch(urlLocal, {
                    headers: { "Content-Type": "application/json" },
                    // ESTO ES VITAL: Permite que el navegador reciba y guarde la cookie HttpOnly
                    credentials: "include",
                });
                const data = await res.json();
                setCustomers(data || [{ nameCustomer: "Consumidor final" }]);
            } catch (error) {
                console.error("Error al cargar clientes");
            } finally {
                setLoadingCustomers(false);
            }
        };
        fetchCustomers();
    }, [user?.role]);

    //  console.log(" lista declientes desde formulario ", customers)

    const handleSuccess = () => {
        setIsSuccess(true);

        // Disparar confeti estilo "Cañón"
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 20, spread: 360, ticks: 80, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // Confeti desde los dos lados
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // VALIDACIÓN PREVIA
        if (!formData.paymentMethod) {
            setError("Por favor, seleccione un método de pago para continuar.");
            setErrorPayment(true);
            return;
        }

        if (formData.paymentMethod === 'PAGO_MOVIL' && (!formData.phonePayment || formData.phonePayment.length < 8)) {
            setError("Para 'Pago Móvil' es obligatorio ingresar el número de celular del depósito de almenos 8 digitos o los que se necesite en su pais).");
            setErrorPayment(true);
            return;
        }

        setLoading(true);
        try {
/
            const url = `/api-backend/bookings`;
            const urlLocal = `${process.env.NEXT_PUBLIC_API_URL}/bookings`;//local
            const response = await fetch(`${url}`, { // Tu endpoint de Node.js
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            // console.log("respuesta response ", response)

            if (response.ok) {
                console.log("Respuesta exitosa del servidor:", data);
                // Usamos encadenamiento opcional (?.) para evitar que la app crashee si un dato falta
                const queryParams = {
                    business: String(data.booking?.businessId?.slug || user?.slug),
                    campo: String(initialData.campo?.name || 'Cancha'),
                    cliente: String(data.payment?.nameCustomer || 'Cliente'), // Corregido: payment
                    precio: String(data.payment?.amount || 0),
                    descuento: String(data.payment?.descuento || 0),
                    total: String(data.payment?.total || 0),
                    fechaJuego: String(data.booking?.startTime || ''), // Corregido: startTime
                    inicio: String(data.booking?.startTimeLocal || ''), // Corregido: startTime
                    fin: String(data.booking?.endTimeLocal || ''),
                    duracion: String(data.booking?.durationInMinutes || 0),
                    metodoPago: String(data.payment?.paymentMethod || ''),
                    phonePayment: String(data.payment?.phonePayment || ''),
                    estado: String(data.payment?.status || ''),
                    fechaPago: String(data.payment?.createdAt || new Date().toISOString()),
                    ref: String(data.payment?._id || '')
                };

                const queryString = new URLSearchParams(queryParams).toString();
                const finalUrl = `/${user?.slug}/dashboard/checkout/success?${queryString}`;

                //  console.log("Redirigiendo a:", finalUrl);

                router.push(finalUrl);

                handleSuccess()


            } else {
                // AGREGAR ESTO:
                const errorMsg = data.message || "Error al procesar la reserva";
                setErrorPayment(true)
                setError(errorMsg);
                console.error("Error del servidor:", errorMsg);
            }
        } catch (error: any) {
            console.log("error ", error.message)
            setError(error.message)
        } finally {
            setLoading(false);
        }
    };
    ///fin


    // UseMemo para evitar recalcular en cada micro-render
    const finalPrice = useMemo(() => {
        const total = initialData.campo?.pricePerHour || formData?.amount || 0;
        return total * (1 - ((formData?.descuento || 0) / 100));
    }, [initialData.campo?.pricePerHour, formData?.amount, formData?.descuento]);

    //const finalPrice = (campo?.pricePerHour || 0) * (1 - (Number(formData?.descuento || 0) / 100));

    const today = new Date().toLocaleDateString('en-CA'); // 'en-CA' devuelve YYYY-MM-DD


    // Función que se ejecuta cuando el buscador encuentra un cliente
    // 2. Manejador de selección
    const handleCustomerSelect = (customer: any) => {
        setFormData(prev => ({
            ...prev,
            nameCustomer: customer.name,
            dniCustomer: customer.dni,
            idCustomer: customer.uid
        }));
    };

    // para bluqer  el input hora cuanod lleguen los datos desde campos
    const isPreselected = Boolean(formData.startTime);

    return (

        <>
            <form
                onSubmit={onSubmit}
                className="bg-brand-gray/5 p-8 rounded-2xl border border-brand-gray/10 shadow-2xl max-w-md  mx-auto space-y-6"
            >
                <h2 className="text-brand-gold text-2xl font-bold mb-4">Confirmar Reserva</h2>

                <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-row gap-4 justify-between items-end">
                        {/* Campo de Hora Inicio */}
                        <div className="space-y-1 flex-1">
                            <label className="text-[10px] font-black text-brand-gold uppercase ml-1 flex items-center gap-1">
                                {isPreselected && <Lock size={10} />} Hora Inicio
                            </label>
                            <input
                                required
                                type="datetime-local"
                                min={today}
                                value={formData.startTime}
                                onChange={(e) => !isPreselected && setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                // Usamos disabled si ya viene pre-seleccionado para bloquear el picker
                                disabled={isPreselected}
                                className={`w-full px-4 py-2 border font-medium rounded-lg text-sm outline-none transition-all
                          ${isPreselected
                                        ? "bg-brand-black/40 border-brand-gold/20 text-gray-400 cursor-not-allowed italic"
                                        : "bg-brand-black/80 border-brand-gray/10 text-brand-white focus:ring-2 focus:ring-brand-gold/20"
                                    }
                                [&::-webkit-calendar-picker-indicator]:invert
                        `}
                            />
                        </div>

                        {/* Campo de Duración */}
                        <div className="space-y-1 w-2/5">
                            <label className="text-[10px] font-black text-gray-500 uppercase ml-1 flex items-center gap-1">
                                {isPreselected && <Lock size={10} />} Duración
                            </label>
                            <select
                                value={formData.durationInMinutes}
                                onChange={(e) => setFormData(prev => ({ ...prev, durationInMinutes: parseInt(e.target.value) }))}
                                // Bloqueamos si es una reserva dirigida desde el horario disponible
                                disabled={isPreselected}
                                className={`w-full px-4 py-2 border rounded-lg text-sm outline-none transition-all
                         ${isPreselected
                                        ? "bg-brand-black/40 border-brand-gold/20 text-gray-400 cursor-not-allowed"
                                        : "bg-brand-black border-brand-gray/10 text-brand-white focus:ring-2 focus:ring-brand-black/10"
                                    }
                      `}
                            >
                                <option value={60}>60 min</option>
                                <option value={90}>90 min</option>
                                <option value={120}>120 min</option>
                            </select>
                        </div>
                    </div>

                    {user && user.role !== 'CUSTOMER' && (
                        <div className="space-y-6 animate-in fade-in duration-500">

                            {/* SECCIÓN DEL TOGGLE */}
                            <div className="flex items-center justify-between p-4 bg-brand-black rounded-2xl border border-brand-gray/10 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isRegistered ? 'bg-brand-gold/20 text-brand-gold' : 'bg-gray-500 text-brand-black'}`}>
                                        {isRegistered ? <UserCheck size={20} /> : <UserPlus size={20} />}
                                    </div>
                                    <div className="">
                                        <p className="text-sm font-bold text-brand-gray">¿Cliente registrado?</p>
                                        <p className="text-[10px] text-gray-50 uppercase font-medium">Activa para buscar en la base de datos</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        const next = !isRegistered;
                                        setIsRegistered(next);
                                        // Si regresamos a modo manual, reseteamos a CONSUMIDOR FINAL
                                        if (!next) {
                                            setFormData(prev => ({
                                                ...prev,
                                                nameCustomer: 'CONSUMIDOR FINAL',
                                                dniCustomer: '',
                                                idCustomer: undefined
                                            }));
                                        }
                                    }}
                                    className={`relative border-2  inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                                     ring-offset-2 focus:ring-2 focus:ring-brand-black ${isRegistered ? 'bg-brand-black/10' : 'bg-brand-black'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-brand-gold transition-transform ${isRegistered ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* RENDERIZADO CONDICIONAL DEL BUSCADOR */}
                            {isRegistered ? (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <CustomerAutocomplete
                                        customers={customers}
                                        loading={loadingCustomers}
                                        onSelect={handleCustomerSelect}
                                    />
                                </div>
                            ) : (
                                <div className="p-3 bg-brand-gold/10 border border-brand-gold/20 rounded-xl animate-in zoom-in duration-300">
                                    <p className="text-[12px] text-brand-gold font-bold text-center italic">
                                        Modo: Registro Manual
                                    </p>
                                </div>
                            )}
                        </div>
                    )}




                    <div className="grid grid-cols-1 gap-3 p-3 bg-brand-black rounded-lg border border-dashed border-brand-gold/40">
                        <p className="text-[9px] font-black text-brand-gold uppercase tracking-widest">Datos para el comprobante</p>

                        <div className="space-y-2">
                            {user && user?.role === 'CUSTOMER' ? (
                                <>

                                    <input
                                        hidden
                                        type="text"
                                        placeholder="Nombre Usuario Cliente"
                                        readOnly
                                        value={formData.nameCustomer || user?.nameUser}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nameCustomer: user?.nameUser || '' }))}
                                        className="w-full px-4 py-2 border bg-brand-black  border-red-700 text-brand-white rounded-lg text-sm 
                                         focus:ring-2 focus:ring-brand-black/10 outline-none" />

                                    <input
                                        hidden
                                        type="text"
                                        placeholder="DNI / Documento Customer"
                                        readOnly
                                        value={formData.dniCustomer}
                                        onChange={(e) => setFormData(prev => ({ ...prev, dniCustomer: e.target.value }))}
                                        className="w-full px-4 py-2 border border-brand-balck/10 rounded-lg text-sm bg-brand-black text-brand-white"
                                    />

                                </>
                            ) :
                                <>
                                    <input
                                        type="text"
                                        placeholder="Nombre Cliente"
                                        value={formData.nameCustomer}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nameCustomer: e.target.value }))}
                                        className="w-full px-4 py-2 border bg-brand-black border-brand-gray/10 text-brand-white rounded-lg text-sm 
                            focus:ring-2 focus:ring-brand-black/10 outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="DNI / Documento"
                                        value={formData.dniCustomer}
                                        // onChange={(e) => setFormData({ ...formData, dniCustomer: e.target.value })}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            // Solo permite números y máximo 8 caracteres
                                            if (/^\d*$/.test(val) && val.length <= 8) {
                                                setFormData(prev => ({ ...prev, dniCustomer: val }));
                                            }
                                        }}
                                        maxLength={8} // Evita que se escriba más de 8
                                        className="w-full px-4 py-2 border bg-brand-black border-brand-gray/10 text-brand-white rounded-lg text-sm 
                            focus:ring-2 focus:ring-brand-black/10 outline-none" />

                                </>
                            }



                            {/* Sección de Cliente Vinculado */}

                            {
                                // Si es ADMIN/STAFF, mostramos el ID del cliente que seleccionaron en el buscador
                                formData.idCustomer && (
                                    <p className="text-[9px] text-success font-bold">✓ Cliente vinculado: {formData.idCustomer}</p>

                                )}

                        </div>

                    </div>

                    {/* toogle descuento   */}
                    {user && user.role !== 'CUSTOMER' && (
                        <div className="flex items-center justify-between p-3 bg-brand-black rounded-lg border border-brand-gray/10">
                            <span className="text-[11px] font-bold text-gray-600 uppercase">¿Aplicar Descuento?</span>
                            <button
                                type="button"
                                onClick={() => {
                                    const nextState = !showDiscount;
                                    setShowDiscount(nextState);

                                    // SI SE DESACTIVA (!nextState), RESERTEAMOS EL VALOR A 0
                                    if (!nextState) {
                                        setFormData(prev => ({ ...prev, descuento: 0 }));
                                    }
                                }}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showDiscount ? 'bg-brand-gold' : 'bg-gray-300'
                                    }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showDiscount ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                            </button>
                        </div>
                    )}

                    {showDiscount && (
                        <div className="space-y-1 animate-in zoom-in duration-200">
                            <div className="flex flex-row gap-1 items-center">
                                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">
                                    Elija el porcentaje de descuento
                                </label>
                                <Percent className="text-brand-gold" size={12} />
                            </div>

                            <select
                                value={formData.descuento ?? 0}
                                onChange={(e) => setFormData(prev => ({ ...prev, descuento: Number(e.target.value) }))}

                                className="w-full px-4 py-2 border border-brand-gray rounded-lg text-sm focus:ring-2 focus:ring-brand-gold outline-none
                                 bg-white font-bold"
                            >
                                <option value={0} disabled>Seleccione un %</option>
                                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(val => (
                                    <option key={val} value={val}>{val} %</option>
                                ))}
                            </select>

                            {/* Feedback visual del ahorro */}
                            <p className="text-[10px] text-success font-medium italic ml-1">
                                Ahorro: {user?.currency?.symbol || "$"} {((initialData.campo?.pricePerHour || 0) * ((formData?.descuento || 0) / 100)).toFixed(2)}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-4 gap-2">
                        {(user?.role === 'CUSTOMER'
                            ? ['CASH', 'PAGO_MOVIL']
                            : ['CASH', 'PAGO_MOVIL', 'CREDIT_CARD', 'DEBIT_CARD']
                        ).map((m) => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: m }))}
                                className={`py-3 rounded-lg border text-[9px] font-black transition-all ${formData.paymentMethod === m ? 'bg-brand-black text-brand-gold shadow-lg scale-105' : 'text-gray-400 border-brand-gray'}`}
                            >
                                {m.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    {formData.paymentMethod === 'PAGO_MOVIL' && (
                        <div className="space-y-1 animate-in zoom-in duration-200">
                            <label className="text-[10px] font-black text-brand-gold uppercase ml-1 flex items-center gap-2">
                                <Phone size={12} /> Número de Celular del Pago
                            </label>
                            <input
                                required
                                type="text"
                                name="paymentPhone"
                                value={formData.phonePayment || ''}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 10) {
                                        setFormData(prev => ({ ...prev, phonePayment: val }));
                                    }
                                }}
                                placeholder="Ej: 987654321"
                                className="w-full px-4 py-2 border bg-brand-black border-brand-gray/10 text-brand-white rounded-lg text-sm 
                                focus:ring-2 focus:ring-brand-gold/20 outline-none placeholder:text-gray-600"
                            />
                            <p className="text-[9px] text-gray-500 italic ml-1">* El número con el que realizaste el depósito</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !formData.paymentMethod}
                        className={`w-full py-4 rounded-xl font-black transition-all shadow-xl
                            ${!formData.paymentMethod
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-brand-gray/20'
                                : 'bg-brand-gold text-brand-black hover:bg-black hover:text-brand-gold'
                            }`}
                    >
                        {loading ? "Procesando..." :
                            !formData.paymentMethod ? "Seleccione Método de Pago" :
                                `Confirmar Pago ${user?.currency?.symbol || "$"} ${finalPrice.toFixed(2)}`}
                    </button>

                </div>
                {errorPayment && (
                    <ErrorAlert
                        message={error}
                        onClose={() => setErrorPayment(false)}
                    />
                )}
            </form>

        </>
    );
}