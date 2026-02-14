import { CheckCircle2 } from "lucide-react";

export const SuccessState = () => (
  <div className="text-center py-10 animate-in zoom-in duration-300">
    <CheckCircle2 size={80} className="text-brand-gold mx-auto mb-4" />
    <h2 className="text-2xl font-bold text-brand-black italic">¡TODO LISTO!</h2>
    <p className="text-gray-500 text-sm">Tu reserva y pago han sido procesados correctamente.</p>
  </div>
);