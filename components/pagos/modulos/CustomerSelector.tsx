"use client";
import { useState, useEffect } from "react";
import { User, Search } from "lucide-react";

interface Customer {
  uid: string;
  name: string;
  dni: string;
}

interface Props {
  token: string;
  onSelect: (customer: Customer) => void;
}

export const CustomerSelector = ({ token, onSelect }: Props) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/users/customers`, {
          headers: { "token": token }
        });
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        }
      } catch (error) {
        console.error("Error cargando clientes", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchCustomers();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);

    // Si el valor coincide exactamente con un nombre de la lista, seleccionamos ese ID
    const found = customers.find(c => c.name === val);
    if (found) {
      onSelect(found);
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">
        Buscar Cliente Registrado
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-brand-gold/50" size={18} />
        <input
          list="customers-list"
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={loading ? "Cargando clientes..." : "Escribe nombre o selecciona..."}
          className="w-full pl-10 pr-4 py-2 border border-brand-gray rounded-lg text-sm focus:ring-2 focus:ring-brand-gold outline-none"
        />
        <datalist id="customers-list">
          {customers.map((c) => (
            <option key={c.uid} value={c.name}>
              DNI: {c.dni}
            </option>
          ))}
        </datalist>
      </div>
    </div>
  );
};