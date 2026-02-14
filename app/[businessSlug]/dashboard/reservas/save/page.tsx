// app/reservar/page.tsx
import { getfieldId } from "@/app/actions/fields";
import BookingForm from "@/components/reserva/BookingForm"
import { Suspense } from "react";





/* interface PageProps {
  searchParams: Promise<{ fieldId?: string; name?:string; date?:string; time?:string }>;
} */

//export default async function BookingPage({ searchParams}:PageProps) {

export default async function SaveReservationPage({
  searchParams,
}: {
  searchParams: Promise<{ fieldId?: string; name?: string; date?: string; time?: string }>;
}) { 
  const { fieldId, name, date, time } = await searchParams;
  // En un escenario real, aquí podrías hacer un fetch al backend 
  // para obtener los detalles de la cancha (nombre, precio, foto)
/*  const params = await searchParams;
 const fieldId = params.fieldId; */
 
  
  const field = await getfieldId(fieldId);
  const campo = field.data.field;
  console.log(" camapo id ", fieldId, "campo data ", campo)
/* 
      const searchParams = useSearchParams();
    const fieldId = searchParams.get("fieldId");
 */
  return (
    <main className="min-h-screen bg-brand-black py-12 px-4 rounded-xl ">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Detalles de la Reserva */}
        <div className="lg:col-span-1 space-y-6 w-full lg:w-100 ">
          <section className="bg-brand-gray/5 border border-brand-gray/10 p-6 rounded-2xl">
            <h1 className="text-brand-gold text-3xl font-black uppercase tracking-tighter mb-2">
              Reserva tu Cancha
            </h1>
            <p className="text-brand-gray text-sm leading-relaxed">
              Estás a un paso de asegurar tu partido. Completa los datos y elige tu método de pago preferido.
            </p>
            
            <hr className="my-6 border-brand-gray/10" />

            {/* Resumen Informativo */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2 items-start">
                 <span className="text-brand-white/60 text-[16px]">Sede: {campo.name}</span>
                <span className="text-brand-white/60 text-[16px]">Sede: {campo.location}</span>
                <span className="text-brand-white font-medium text-[12px]">Descripcion: {campo.description}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-white/60">Precio por hora:</span>
                <span className="text-brand-gold font-bold">S/ 120.00</span>
              </div>
            </div>
          </section>

          {/* Tips de Seguridad/Info */}
          <div className="p-4 rounded-xl border border-brand-gold/20 bg-brand-gold/5">
            <p className="text-brand-gold text-xs italic text-center">
              ⚡ Los pagos vía YAPE se confirman automáticamente al adjuntar la captura en el siguiente paso.
            </p>
          </div>
        </div>

        {/* Columna Derecha: El Formulario */}
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="text-brand-white">Cargando formulario...</div>}>
        {/*     <BookingForm fieldId={fieldId} campo={campo} /> */}
            <BookingForm 
              initialData={{
                fieldId: fieldId || '',
                fieldName: name || '',
                date: date || '',
                time: time || '',
                campo:campo
              }} 
            />    
          </Suspense>
        </div>
        
      </div>
    </main>
  );
}