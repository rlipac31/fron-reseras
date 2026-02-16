import { Search } from "lucide-react";

interface Props {
  bookingData: any;
  setBookingData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}


export const BookingForm = ({ bookingData, setBookingData, onSubmit, loading }: Props) => {
// Obtener la fecha actual en formato YYYY-MM-DD para el atributo min
//const today = new Date().toISOString().split('T')[0];
// Esto obtiene la fecha local en formato YYYY-MM-DD sin el desfase de UTC
const today = new Date().toLocaleDateString('en-CA'); // 'en-CA' devuelve YYYY-MM-DD
  
return(
    
  <form onSubmit={onSubmit} className="space-y-5 animate-in slide-in-from-left duration-300">
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Cancha Seleccionada</label>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-brand-gold" size={18} />
        <input disabled value={bookingData.fieldName} className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-brand-gray rounded-lg text-sm text-gray-600 font-semibold" />
      </div>
    </div>

    <div className="space-y-1">
      <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Fecha</label>
      <input required type="date" min={today} value={bookingData.date} onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })} className="w-full px-4 py-2 border border-brand-gray rounded-lg text-sm focus:ring-2 focus:ring-brand-gold outline-none" />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Hora Inicio</label>
        <input required type="time" value={bookingData.time}
         onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
         className="w-full px-4 py-2 border border-brand-gray rounded-lg text-sm focus:ring-2 focus:ring-brand-gold outline-none" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Duración</label>
        <select value={bookingData.durationInMinutes} onChange={(e) => setBookingData({ ...bookingData, durationInMinutes: Number(e.target.value) })} className="w-full px-4 py-2 border border-brand-gray rounded-lg text-sm focus:ring-2 focus:ring-brand-gold outline-none bg-white">
          <option value={30}>30 min</option>
          <option value={60}>60 min</option>
          <option value={90}>90 min</option>
          <option value={120}>120 min</option>
        </select>
      </div>
    </div>

    <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-bold uppercase tracking-widest text-sm bg-brand-gold text-brand-black hover:bg-black hover:text-brand-gold transition-all shadow-lg active:scale-95 disabled:opacity-50">
      {loading ? "Reservando..." : "Siguiente: Pagar"}
    </button>
  </form>
)
} 




