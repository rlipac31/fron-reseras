"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useUser } from '@/context/UserContext';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from 'next/image';
import { ErrorAlert } from '@/components/Alert';
import fondo from '../../../public/assets/soccer-488700_1920.jpg';

// Esquema de validación dinámico
const loginSchema = z.object({
  email: z.string().email("Correo inválido").min(1, "El correo es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  businessId: z.string().optional(), // Opcional porque se llena después del check
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useUser();
  // skeleton
  const [isLoadingCheck, setIsLoadingCheck] = useState(false);
  // ESTADOS PARA LA LÓGICA MULTI-NEGOCIO
  const [step, setStep] = useState(1); // 1: Email, 2: Negocio/Password
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loginError, setLoginError] = useState(false);
  const [errorMgs, setErrorMsg] = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const emailValue = watch("email");
  const businessIdValue = watch("businessId");

  const urlLocal = `${process.env.NEXT_PUBLIC_API_URL}`;
  const url = `/api-backend`;

  // FUNCIÓN 1: Verificar Email y listar negocios
  const handleCheckEmail = async () => {
    if (!emailValue || errors.email) return;


    try {
      const res = await fetch(`${url}/auth/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.hasMultiple) {
          setBusinesses(data.businesses);
          setStep(2);
        } else {
          // Si solo hay uno, lo asignamos y pasamos al password
          setValue("businessId", data.businessId);
          setStep(2);

        }
        setLoginError(false);
      } else {
        setErrorMsg(data.message || "Usuario no encontrado");
        setLoginError(true);
      }
    } catch (error) {
      setErrorMsg("Error al conectar con el servidor");
      setLoginError(true);
    }
  };

  // FUNCIÓN 2: Login Final
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const url = `/api-backend`;
      const res = await fetch(`${url}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const dataLogin = await res.json();

      if (dataLogin.success) {
        setUser(dataLogin.user);
        const destination = searchParams.get('from') || `/${dataLogin.user?.slug}/dashboard`;
        router.push(destination);
      } else {
        setErrorMsg(dataLogin.message);
        setLoginError(true);
      }
    } catch (error) {
      setErrorMsg("Error de conexión");
      setLoginError(true);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <Image src={fondo} alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-brand-black/70 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-brand-white rounded-2xl shadow-2xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-black">Bienvenido</h1>
          <p className="text-gray-500 mt-2">
            {step === 1 ? "Ingresa tu correo para empezar" : "Selecciona tu sede y contraseña"}
          </p>
          {loginError && <ErrorAlert message={errorMgs} onClose={() => setLoginError(false)} />}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* CAMPO EMAIL: Siempre visible pero deshabilitado en paso 2 */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Correo Electrónico</label>
            <input
              {...register("email")}
              type="email"
              disabled={step === 2}
              className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${errors.email ? "border-red-500 ring-1 ring-red-500" : "border-brand-gray focus:ring-2 focus:ring-brand-gold"
                } ${step === 2 ? "bg-gray-100 text-gray-500" : "bg-white text-brand-black"}`}
              placeholder="ejemplo@correo.com"
            />
          </div>

          {/* PASO 2: SELECT DE NEGOCIO Y PASSWORD */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-5">

              {/* SELECT DE NEGOCIOS (Solo si hay varios) */}
              {businesses.length > 1 && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Selecciona tu Complejo</label>
                  <select
                    {...register("businessId")}
                    className="w-full px-4 py-3 rounded-xl border border-brand-gray bg-white text-brand-black font-bold focus:ring-2 focus:ring-brand-gold outline-none"
                  >
                    <option value="">-- Elige una Arena --</option>
                    {businesses.map((b) => (
                      <option key={b.id} value={b.id}>{b.slug}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* CONTRASEÑA */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Contraseña</label>
                <input
                  {...register("password")}
                  type="password"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray focus:ring-2 focus:ring-brand-gold outline-none text-brand-black"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
            </div>
          )}

          {/* BOTONES DINÁMICOS */}
          {step === 1 ? (
            <button
              type="button"
              onClick={handleCheckEmail}
              className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-black font-black py-4 rounded-xl uppercase tracking-tighter shadow-lg transition-all active:scale-95"
            >
              Siguiente
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-brand-gray text-brand-black font-bold py-4 rounded-xl uppercase text-xs"
              >
                Atrás
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (businesses.length > 1 && !businessIdValue)}
                className="w-2/3 bg-brand-black text-brand-gold font-black py-4 rounded-xl uppercase tracking-tighter shadow-lg disabled:opacity-50 transition-all active:scale-95"
              >
                {isSubmitting ? "Entrando..." : "Iniciar Sesión"}
              </button>
            </div>
          )}
        </form>

        <p className="text-center mt-8 text-sm text-gray-400 font-bold uppercase tracking-widest">
          ¿No tienes cuenta? <span className="text-brand-gold cursor-pointer hover:underline">Regístrate</span>
        </p>
      </div>
    </main>
  );
}

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-5">
    {/* Skeleton para el Label */}
    <div className="h-3 w-32 bg-gray-200 rounded-full ml-1"></div>
    {/* Skeleton para el Select */}
    <div className="h-12 w-full bg-gray-200 rounded-xl"></div>

    {/* Skeleton para el Label Password */}
    <div className="h-3 w-24 bg-gray-200 rounded-full ml-1 mt-6"></div>
    {/* Skeleton para el Input Password */}
    <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
  </div>
);


export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-black flex items-center justify-center text-brand-gold">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}