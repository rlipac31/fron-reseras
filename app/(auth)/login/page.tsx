"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react'; // Importa Suspense
import { useUser } from '@/context/UserContext';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from 'next/image';
import { ErrorAlert } from '@/components/Alert';
import fondo from '../../../public/assets/soccer-488700_1920.jpg';

const loginSchema = z.object({
  email: z.string().email("Correo inválido").min(1, "El correo es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// --- COMPONENTE INTERNO CON LA LÓGICA ---
function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useUser();
  const [loginError, setLoginError] = useState(false);
  const [errorMgs, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const destination = searchParams.get('from') || '/'; 

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include", 
      }); 

      const dataLogin = await res.json();
      
      if (dataLogin.success) {
        setUser(dataLogin.user);
        const finalPath = destination !== '/' 
          ? destination 
          : `/${dataLogin.user?.slug}/dashboard`;
        router.push(finalPath);
      } else {
        setErrorMsg(dataLogin.message);
        setLoginError(true);
      }
    } catch (error) {
      setErrorMsg(`Hubo un error: ${error}`);
      setLoginError(true);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4">
      {/* Todo tu JSX actual (Imagen de fondo, Tarjeta, Formulario) va aquí igualito */}
      <div className="absolute inset-0 z-0">
        <Image src={fondo} alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-brand-black/70 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-brand-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-brand-black">Bienvenido</h1>
            { loginError && <ErrorAlert message={errorMgs} onClose={()=> setLoginError(false)} /> }
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ... Tus campos de input ... */}
            <button type="submit" disabled={isSubmitting} className="w-full bg-brand-gold ...">
               {isSubmitting ? "Cargando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

// --- EXPORT POR DEFECTO CON SUSPENSE ---
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-gold"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}