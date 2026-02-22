import { getServerUser } from '@/app/actions/userServer';
import { Mail, Phone, CreditCard, FilePenLine, Trash2 } from 'lucide-react'; // Opcional: npm install lucide-react
import Link from 'next/link';

interface UserCardProps {
  user: {
    uid:string;
    name: string;
    email: string;
    dni: string;
    role: string;
    businessId: {id:string; slug:string; name:string;description:string;};
  };
}

export default async function UserCard({ user }: UserCardProps) {
 console.log("user desde user card: ", user);
  return (
    <div className="bg-brand-white border border-brand-gray rounded-xl p-4 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {/* Avatar Circular */}
        <div className="w-8 h-8 shrink-0 rounded-full bg-brand-black flex items-center justify-center
         text-brand-gold font-bold text-xl">
          {user.name.charAt(0)}
        </div>
        
        <div>
          <h3 className="font-bold text-brand-black text-[14px] leading-tight">{user.name}</h3>
          <span className="bg-brand-gold text-[9px] font-bold px-2 py-0.5 rounded text-brand-black uppercase">
            {user.role}
          </span>
        </div>
      </div>

      <div className="space-y-2 mt-2">
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <Mail size={16} className="text-brand-gold" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <Phone size={16} className="text-brand-gold" />
          <span>0979102105</span> {/* Hardcoded como en tu imagen o agrégalo al backend */}
        </div>
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <CreditCard size={16} className="text-brand-gold" />
          <span>DNI: {user.dni}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-brand-gray flex justify-between">
    <Link href={`/${user.businessId.slug}/dashboard/customers/${user.uid}`} >
        <button className="text-gray-400 text-xs font-bold uppercase hover:text-brand-black transition-colors cursor-pointer"
        title='Editar Datos De Cliente'
        >
          
          <FilePenLine size={24} />
          </button>
    </Link>
      
        <button className="text-gray-400 text-xs font-bold uppercase hover:text-red-700 transition-colors cursor-pointer"
         title='Eliminar cliente'
        >
          <Trash2 size={24} className='hover:text-red-600' />
        </button>
      </div>
    </div>
  );
}