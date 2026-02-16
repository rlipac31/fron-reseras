"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
//coockies
import Cookies from 'js-cookie';
import { Suspense } from 'react';

//imagen
import fondo from '../../../public/assets/soccer-488700_1920.jpg';
import Image from 'next/image';
import {ErrorAlert} from '@/components/Alert'




// 1. Definimos el esquema de validación
const loginSchema = z.object({
  email: z.string().email("Correo inválido").min(1, "El correo es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Inferimos el tipo de datos del esquema
type LoginFormValues = z.infer<typeof loginSchema>;


/// 
 function  LoginForm () {
   const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useUser();
  const [userLogueado, setUserLogueado ] = useState<any>(null);
   const [loginError, setLoginError ] = useState(false);
     const [errorMgs, setErrorMsg ] = useState('');

  // 2. Configuramos el hook del formulario
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

    // Capturamos a dónde quería ir el usuario originalmente
  const destination = searchParams.get('from') || '/'; 

   // 3. Función para enviar a la API de Node.js
  const onSubmit = async (data: LoginFormValues) => {

   // console.log("intento de loguearse....")

  try {
        const url =`/api-backend/auth`;
        const urlLocal=`${process.env.NEXT_PUBLIC_API_URL}/auth`;//local
       const res = await fetch(`${url}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          // ESTO ES VITAL: Permite que el navegador reciba y guarde la cookie HttpOnly
          credentials: "include", 
        }); 

        const dataLogin = await res.json();
      
       console.log("data login ", dataLogin?.message)
         if (dataLogin.success) {
            setUser(dataLogin.user);
          //  console.log("user desde login", dataLogin.user)
            // Elige un solo camino para el path
            const finalPath = destination !== '/' 
                ? destination 
                : `/${dataLogin.user?.slug}/dashboard`;
            
            router.push(finalPath);
          
        } else{
          setErrorMsg(dataLogin.message)
          setLoginError(true)
        }
  
      

    } catch (error) {
    setErrorMsg(`Hubo un error typo:  ${error}`)
    setLoginError(true)
  }
};    
 


  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4">
      {/* Fondo con imagen y overlay */}
    <div className="absolute inset-0 z-0"
      style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
    >
        <Image
          src={fondo} // Ruta relativa a la carpeta public
          alt="Background"
          fill
          className="object-cover"
          priority // Carga la imagen con prioridad por ser el fondo
        />
        {/* Capa de superposición (Overlay) para opacidad */}
        <div className="absolute inset-0 bg-brand-black/70 backdrop-blur-sm"></div>
      </div>

      {/* Tarjeta de Login */}
      <div className="relative z-10 w-full max-w-md bg-brand-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-brand-black">Bienvenido</h1>
            <p className="text-gray-500 mt-2">Ingresa a tu cuenta para continuar</p>
            
            { loginError &&  (
              <ErrorAlert 
              message={errorMgs}
              onClose={()=> setLoginError(false)}
               

            />
            ) 
             }
          </div>

          <form onSubmit={(e) => {
              e.preventDefault(); // EVITA QUE LA PÁGINA SE RECARGUE
              handleSubmit(onSubmit)(e);
            }}
          
          className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">
                
              </label>
              <input 
               {...register("email")}
                type="email" 
                className={`w-full px-4 py-3 rounded-lg border border-brand-gray focus:ring-2 focus:ring-brand-gold 
                focus:border-transparent outline-none transition-all
                ${
                errors.email ? "border-red-500 ring-1 ring-red-500" : "border-brand-gray focus:ring-2 focus:ring-brand-gold"
              }`}
                placeholder="ejemplo@correo.com"
              />
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-black mb-1">
                Contraseña
              </label>
              <input 
               {...register("password")}
                type="password" 
                className={`w-full px-4 py-3 rounded-lg border border-brand-gray focus:ring-2 focus:ring-brand-gold 
                :border-transparent outline-none transition-all
                 ${
                errors.password ? "border-red-500 ring-1 ring-red-500" : "border-brand-gray focus:ring-2 focus:ring-brand-gold"
              }`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            
              
            </div>
{/* 
            <div className="flex items-center justify-end">
              <a href="#" className="text-sm text-brand-gold hover:underline font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div> */}

            <button 
              type="submit"
              disabled={isSubmitting}                                        
              className="w-full bg-brand-gold hover:bg-[#e08e00] text-brand-black font-bold py-3 
              rounded-lg transition-colors shadow-lg active:scale-[0.98]"
            >
               {isSubmitting ? "Cargando..." : "Ingresar"}
             {/*  Iniciar Sesión */}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <a href="#" className="text-brand-gold font-bold hover:underline">
              Regístrate
            </a>
          </p>
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

/////


