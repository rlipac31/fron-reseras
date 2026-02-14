interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendType?: 'positive' | 'neutral';
}

export function StatCard({ title, value, trend, trendType = 'positive' }: StatCardProps) {
  return (
    <div className="bg-brand-white p-6 rounded-xl border border-brand-gray shadow-sm">
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <div className="flex items-end justify-between mt-2">
        <h2 className="text-2xl font-bold text-brand-black">{value}</h2>
        <span className={`text-xs font-bold ${
          trendType === 'positive' ? 'text-success' : 'text-brand-gold'
        }`}>
          {trend}
        </span>
      </div>
    </div>
  );
}