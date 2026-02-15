"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
  uid: string;
  nameUser: string;
  role: string;
  slug?: string;
  businessId?: string;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, initialUser }: { children: ReactNode, initialUser: UserData | null }) {
  // Inicializamos el estado directamente con lo que el servidor ya leyó del JWT
  const [user, setUser] = useState<UserData | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser); // Si no hay initialUser, activamos carga
  //console.log(" desde contes desde arriba.... user ", user)
 
  useEffect(() => {
    // Solo ejecutamos verifySession si el servidor NO nos pasó datos (ej. navegación directa)
    if (!initialUser) {
      const verifySession = async () => {
        try {
       // console.log("ejecutando getMe....debtreo del try")

          const res = await fetch(`https://wrong-mame-rlipac-497028fb.koyeb.app/api/auth/me`, {
            method: "GET",
            credentials: "include", 
            
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
              // console.log(" user desde context ", user);
         
          } else {
            setUser(null);
          }
        } catch (error) {
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      verifySession();
    }
  }, [initialUser]); 


  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
} 

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    return { user: null, setUser: () => {}, loading: false }; 
  }
  return context;
}