'use client'
import { useRouter, useSearchParams } from 'next/navigation';

export function MethodFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMethod = searchParams.get('method') || '';

  const methods = [
    { label: 'Todos', value: '' },
    { label: 'Yape', value: 'YAPE' },
    { label: 'Efectivo', value: 'CASH' },
    { label: 'Tarjeta', value: 'CREDIT_CARD' },
    { label: 'Débito', value: 'DEBIT_CARD' }
  ];


  const handleChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set('method', val);
    else params.delete('method');
    params.set('page', '1'); // Resetear a pag 1 al filtrar
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex bg-brand-gray/30 p-1 rounded-xl">
      {methods.map((m) => (
        <button
          key={m.value}
          onClick={() => handleChange(m.value)}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
            currentMethod === m.value 
            ? 'bg-brand-black text-brand-gold shadow-sm' 
            : 'text-gray-500 hover:text-brand-black'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}