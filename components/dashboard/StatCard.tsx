interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendType?: 'positive' | 'neutral';
}

export function StatCard({ title, value, trend, trendType = 'positive' }: StatCardProps) {
  return (
    <div className="bg-brand-white p-6 rounded-xl border border-brand-gray shadow-sm
     hover:bg-brand-gold transition-all duration-300 pointer-events-auto  ">
   {/*    <button className="bg-brand-gold text-brand-black text-[10px] hover:px-6 hover:text-[12px] 
      transition-all duration-500 px-2 py-1 rounded-sm">ver mas</button> */}
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <div className="flex items-end justify-between mt-2">
        <h2 className="text-2xl font-bold text-brand-black">{value}</h2>
          <span className="text-white text-lg font-medium">Ver mas</span>
        <span className={`text-xs font-bold ${
          trendType === 'positive' ? 'text-success' : 'text-brand-gold'
        }`}>
          {trend}
        </span>
      
      </div>
    </div>
  );
}