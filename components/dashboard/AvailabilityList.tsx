// BookingTable.tsx
export function BookingTable2({ data }: { data: any[] }) {
  return (
    <div className="bg-brand-white rounded-xl shadow-sm border border-brand-gray p-6 lg:col-span-2">
      <h3 className="font-bold text-lg mb-4 text-brand-black">Últimos Alquileres</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-brand-gray text-gray-400 text-sm">
              <th className="pb-3 font-medium">Cliente</th>
              <th className="pb-3 font-medium">Cancha</th>
              <th className="pb-3 font-medium">Horario</th>
              <th className="pb-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray/50">
            {data.map((row, i) => (
              <tr key={i}>
                <td className="py-4 text-sm font-semibold text-brand-black">{row.user}</td>
                <td className="py-4 text-sm text-gray-600">{row.cancha}</td>
                <td className="py-4 text-sm text-gray-600">{row.time}</td>
                <td className="py-4">
                  <span className={`text-[10px] px-2 py-1 rounded-md font-bold ${
                    row.status === 'Pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {row.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}