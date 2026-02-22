
import { UserProvider } from '@/context/UserContext';
import { cookies } from 'next/headers';
//coponents
import Sidebar from '@/components/Sidebar';
import MobileNavbar from "@/components/MobileNavbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {


  return (
 <>
     {/*  <div className="flex min-h-screen bg-brand-gray"> */}
      <div className="flex flex-col md:flex-row min-h-screen">


        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Contenido Dinámico */}
          <div className="flex-1 overflow-y-auto px-0 md:px-8 md:w-[80.2vw] bg-gray-50">
            {children}
          </div>
        </main>
      </div>
</>
  );
}