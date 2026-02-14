import type { Metadata } from "next";
import NavbarPublico from "@/components/NavbarPublico";

import { getFieldsPublic } from "../actions/public";

const nameSlug = process.env.NEXT_PUBLIC_NAME_NEGOCIO;
const idNegocio =process.env.NEXT_PUBLIC_ID_NEGOCIO; 

export const metadata: Metadata = {
  title: `${nameSlug} `+" Soccer | Reserva tu Cancha",
  description: "El mejor complejo deportivo de la ciudad",
};



export default async function MarketingLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <NavbarPublico /> 
      <main>{children}</main>
      {/* Footer, etc */}
    </>
  );
}
