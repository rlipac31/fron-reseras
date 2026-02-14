
'use client';

import React, { useState, useEffect } from "react";
import { Receipt, User, Wallet, CreditCard, UserCheck, UserPlus, CircleDollarSign, Banknote, Percent } from "lucide-react"; // Iconos para el toggle
import Link from "next/link";
//import { CustomerSelector } from "./CustomerSelector";
import { CustomerAutocomplete } from './CustomerAutocomplete'
import { BookingCardInfo } from '@/components/reserva/CardReservaInfo'
import { useUser } from "@/context/UserContext";



interface Props {
    fieldData:any;
    paymentData: any;
    setPaymentData: (data: any) => void;
    bookingResponse: any;
    showDiscount: boolean;
    setShowDiscount: (val: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    user: any; // Este es el admin/operador logueado
}


export const PaymentForm = ({
    fieldData,
    paymentData,
    setPaymentData,
    bookingResponse,
    showDiscount,
    setShowDiscount,
    onSubmit,
    loading,
    user
}: Props) => {

    const [customers, setCustomers] = useState<any[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(true);
    // Nuevo estado para el toggle: false por defecto
    const [isRegistered, setIsRegistered] = useState(false);
    const [error, setError] = useState('');
    //console.log(" campo desde form pay : ", fieldData.name)

    // 1. Cargamos los clientes UNA sola vez al montar el componente
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/users/customers`, {
                        headers: { "Content-Type": "application/json" },
                        // ESTO ES VITAL: Permite que el navegador reciba y guarde la cookie HttpOnly
                        credentials: "include", 
                });
                const data = await res.json();
                setCustomers(data || [{nameCustomer:"Consumidor final"}]);
            } catch (error) {
                console.error("Error al cargar clientes");
            } finally {
                setLoadingCustomers(false);
            }
        };
        fetchCustomers();
    }, [user?.token]);

    const finalPrice = (bookingResponse?.totalPrice || 0) * (1 - (Number(paymentData.descuento || 0) / 100));



    // Función que se ejecuta cuando el buscador encuentra un cliente
    // 2. Manejador de selección
    const handleCustomerSelect = (customer: any) => {

        setPaymentData({
            ...paymentData,
            nameCustomer: customer.name,
            dniCustomer: customer.dni,
            idCustomer: customer.uid // O el campo que use tu BD
        });
    };
    // formaterar fecha
 const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };


    return (
        <form onSubmit={onSubmit} className="space-y-5 animate-in slide-in-from-right duration-300">
            {/* Resumen de Monto (Se mantiene igual) */}
            <div className="bg-brand-black/5 p-4 rounded-xl border-l-4 border-brand-gold mb-4">
                <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-gray-500 font-bold uppercase tracking-wider">Detalle</span>
                    <span className="bg-brand-gold/20 text-brand-black px-2 py-0.5 rounded font-mono">#{bookingResponse?._id.slice(-6)}</span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Total a Pagar</p>
                        <p className="text-2xl font-black text-brand-black">S/ {bookingResponse?.totalPrice}</p>
                    </div>
                    {/*  <Receipt className="text-brand-gold" size={28}  />*/}
                    {/*                     <CircleDollarSign className="text-brand-black" size={28} /> */}
                    <Banknote className="text-brand-black" size={38} />
                </div>
            </div>
            <div className="">
               
                <BookingCardInfo data={bookingResponse} nameField={fieldData?.name} userToken={user?.token}/>
            </div>
            {/* Validamos que exista el usuario Y que su rol sea distinto a 'CUSTOMER'.
    Esto asegura que solo ADMIN o STAFF vean el buscador de clientes.
*/}
            {user && user.role !== 'CUSTOMER' && (
                <div className="space-y-6 animate-in fade-in duration-500">

                    {/* SECCIÓN DEL TOGGLE */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isRegistered ? 'bg-brand-gold/20 text-brand-gold' : 'bg-gray-200 text-gray-500'}`}>
                                {isRegistered ? <UserCheck size={20} /> : <UserPlus size={20} />}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">¿Cliente registrado?</p>
                                <p className="text-[10px] text-gray-500 uppercase font-medium">Activa para buscar en la base de datos</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsRegistered(!isRegistered)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-offset-2 focus:ring-2 focus:ring-brand-gold ${isRegistered ? 'bg-brand-gold' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isRegistered ? 'translate-x-6' : 'translate-x-1'
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

            {/* Datos Cliente (Se auto-completan al usar el buscador arriba) */}
            
           
            <div className="grid grid-cols-1 gap-3 p-3 bg-gray-50 rounded-lg border border-dashed border-brand-gray">
                <p className="text-[9px] font-black text-brand-gold uppercase tracking-widest">Datos para el comprobante</p>
             
                <div className="space-y-2">
                { user && user?.role === 'CUSTOMER' ? (  
                  <>
                  
                    <input
                        type="text"
                        placeholder="Nombre Cliente"
                        readOnly
                        value={paymentData.nameCustomer = user?.maneUser}
                        onChange={(e) => setPaymentData({ ...paymentData, nameCustomer: user?.nameUser})}
                        className="w-full px-4 py-2 border border-brand-gray rounded-lg text-sm bg-white"
                    />
                    <input
                        type="text"
                        placeholder="DNI / Documento"
                        readOnly
                        value={paymentData.dniCustomer}
                        onChange={(e) => setPaymentData({ ...paymentData, dniCustomer: e.target.value })}
                        className="w-full px-4 py-2 border border-brand-gray rounded-lg text-sm bg-white"
                    />

                 </>                       
                ): 
                <>
                <input
                        type="text"
                        placeholder="Nombre Cliente"
                        value={paymentData.nameCustomer}
                        onChange={(e) => setPaymentData({ ...paymentData, nameCustomer: e.target.value})}
                        className="w-full px-4 py-2 border border-brand-gray rounded-lg text-sm bg-white"
                    />
                  <input
                        type="text"
                        placeholder="DNI / Documento"
                        value={paymentData.dniCustomer}
                       // onChange={(e) => setPaymentData({ ...paymentData, dniCustomer: e.target.value })}
                        onChange={(e) => {
                            const val = e.target.value;
                            // Solo permite números y máximo 8 caracteres
                            if (/^\d*$/.test(val) && val.length <= 8) {
                            setPaymentData({ ...paymentData, dniCustomer: val });
                            }
                        }}
                        maxLength={8} // Evita que se escriba más de 8
                        className="w-full px-4 py-2 border border-brand-gray rounded-lg text-sm bg-white"
                    />
                </>    
            }
                    
 

                        {/* Sección de Cliente Vinculado */}
                   
                       {
                            // Si es ADMIN/STAFF, mostramos el ID del cliente que seleccionaron en el buscador
                            paymentData.idCustomer && (
                                 <p className="text-[9px] text-success font-bold">✓ Cliente vinculado: {paymentData.idCustomer}</p>
                            
                        )}
                    
                </div>
         
            </div>

            {/* Toggle Descuento y Métodos de pago se mantienen igual... */}
            {/* ... (Resto del código del formulario) */}

            {/* Toggle de Descuento */}
       {user && user.role !== 'CUSTOMER' && (      
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-brand-gray">
                <span className="text-[11px] font-bold text-gray-600 uppercase">¿Aplicar Descuento?</span>
                <button
                    type="button"
                    onClick={() => {
                        const nextState = !showDiscount;
                        setShowDiscount(nextState);

                        // SI SE DESACTIVA (!nextState), RESERTEAMOS EL VALOR A 0
                        if (!nextState) {
                            setPaymentData({ ...paymentData, descuento: 0 });
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
                        value={paymentData.descuento || ""}
                        onChange={(e) => setPaymentData({ ...paymentData, descuento: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-brand-gray rounded-lg text-sm focus:ring-2 focus:ring-brand-gold outline-none bg-white font-bold"
                    >
                        <option value={0} disabled>Seleccione un %</option>
                        {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(val => (
                            <option key={val} value={val}>{val} %</option>
                        ))}
                    </select>

                    {/* Feedback visual del ahorro */}
                    <p className="text-[10px] text-success font-medium italic ml-1">
                        Ahorro: S/ {((bookingResponse?.totalPrice || 0) * (paymentData.descuento / 100)).toFixed(2)}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-4 gap-2">
                {['CASH', 'YAPE', 'CREDIT_CARD', 'DEBIT_CARD'].map((m) => (
                    <button key={m} type="button" onClick={() => setPaymentData({ ...paymentData, paymentMethod: m })} className={`py-3 rounded-lg border text-[9px] font-black transition-all ${paymentData.paymentMethod === m ? 'bg-brand-black text-brand-gold shadow-lg scale-105' : 'text-gray-400 border-brand-gray'}`}>
                        {m.replace('_', ' ')}
                    </button>
                ))}
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-black bg-brand-gold text-brand-black hover:bg-black hover:text-brand-gold transition-all shadow-xl">
                {loading ? "Procesando..." : `Confirmar Pago S/ ${finalPrice.toFixed(2)}`}
            </button>

            <Link href={`/${user?.slug}/dashboard/reservas`} className="block w-full text-center py-4 rounded-xl font-black bg-gray-200 text-sm mt-2">
                DEJAR PENDIENTE
            </Link>
        </form>
    );
};




