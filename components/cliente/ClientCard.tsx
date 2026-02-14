import { UserType } from '../../types';

import { Mail, Phone, IdCard, ShieldCheck, User } from 'lucide-react';


export default function ClientCard({ user }: { user: UserType }) {
  return (
    <div className="bg-brand-white rounded-xl border border-brand-gray shadow-sm p-5 hover:border-brand-gold transition-all group w-60">
     
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-brand-black flex items-center justify-center text-brand-gold font-bold text-lg border-2 border-brand-gold/20">
          {user.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-brand-black group-hover:text-brand-gold transition-colors">
            {user.name}
          </h3>
{/*           <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
            user.role === 'ADMIN' ? 'bg-brand-gold text-brand-black'  : 'bg-brand-gray text-gray-600'
          }`}>
            {user.role}
          </span> */}
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                user.role === 'ADMIN' 
                  ? 'bg-brand-gold text-brand-black py-1 px-1'  // Si es ADMIN (Usando tu nuevo verde acento)
                  : user.role === 'USER' 
                    ? 'bg-brand-gold text-brand-white px-1 py-1'     // Si no es Admin, preguntamos si es USER
                    : 'bg-brand-gray text-gray-500'     // Si no es ninguno de los anteriores (CUSTOMER)
              }`}>
                {user.role}
          </span>
        </div>
      </div>

      <div className="space-y-3 border-t border-brand-gray/50 pt-4">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Mail size={16} className="text-brand-gold" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Phone size={16} className="text-brand-gold" />
          <span>{user.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <IdCard size={16} className="text-brand-gold" />
          <span>DNI: {user.dni}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button className="text-[10px] font-bold text-gray-400 hover:text-brand-black uppercase tracking-widest">
          Ver Historial
        </button>
      </div>
    </div>
  );
}