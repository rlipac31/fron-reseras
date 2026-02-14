"use client";
import { useRouter, useSearchParams } from 'next/navigation';

export function FilterTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('filter') || 'today';

  const filters = [
    { label: 'Hoy', value: 'today' },
    { label: '7 Días', value: '7days' },
    { label: 'Este Mes', value: 'month' },
    { label: 'Todos', value: '' },
  ];

  const handleFilter = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set('filter', val);
    else params.delete('filter');
    params.delete('date'); // Limpiar fecha si se elige un filtro rápido
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex bg-brand-gray/20 p-1 rounded-xl w-fit">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => handleFilter(f.value)}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            currentFilter === f.value 
            ? 'bg-brand-black text-brand-gold shadow-sm' 
            : 'text-gray-500 hover:text-brand-black'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}