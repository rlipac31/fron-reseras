
import { UserProvider } from '@/context/UserContext';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {/* El Provider envuelve TODA la app, así el Contexto nunca falta */}
        <UserProvider initialUser={null}>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}