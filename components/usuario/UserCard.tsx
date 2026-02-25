import { Mail, Phone, CreditCard, FilePenLine } from 'lucide-react';
import Link from 'next/link';
import DeleteCustomerButton from './DeleteCustomerButton';

interface UserCardProps {
  user: {
    uid: string;
    name: string;
    email: string;
    dni: string;
    phone?: string;
    role: string;
    businessId: { id: string; slug: string; name: string; description: string; };
  };
}

export default function UserCard({ user }: UserCardProps) {
  console.log("user ", user);
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
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <Phone size={16} className="text-brand-gold" />
          <span>{user.phone || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <CreditCard size={16} className="text-brand-gold" />
          <span>DNI: {user.dni}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-brand-gray flex justify-between items-center">
        <Link href={`/${user.businessId.slug}/dashboard/customers/${user.uid}`} >
          <button className="text-gray-400 text-xs font-bold uppercase hover:text-brand-black transition-colors cursor-pointer"
            title='Editar Datos De Cliente'
          >
            <FilePenLine size={24} />
          </button>
        </Link>

        <DeleteCustomerButton
          customerId={user.uid}
          customerName={user.name}
        />
      </div>
    </div>
  );
}