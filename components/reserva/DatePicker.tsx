"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export function DatePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Obtenemos la fecha actual de la URL para que el input no se limpie al cargar
  const currentDate = searchParams.get('date') || "";

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (selectedDate) {
      params.set('date', selectedDate);
      params.delete('filter'); // Borramos el filtro rápido para que no haya conflicto
    } else {
      params.delete('date');
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Buscar por día</label>
      <input 
        type="date"
        value={currentDate}
        onChange={handleDateChange}
        className="border-2 border-brand-gray/50 rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:border-brand-gold bg-white transition-all shadow-sm"
      />
    </div>
  );
}