export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { UserProvider } from '@/context/UserContext';
import './globals.css';
import { getServerUser } from './actions/userServer';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialUser = await getServerUser();
  //  console.log("desde  Root Loyout initial user ", initialUser)
  return (
    <html lang="es">
      <body>
        {/* El Provider envuelve TODA la app, así el Contexto nunca falta */}
        <UserProvider initialUser={initialUser}>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}