"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Filter, FilePenLine, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { deleteField, getFieldsCompleta, updateStateField } from '@/app/actions/fields';
import { useUser } from '@/context/UserContext';
import { SoccerField } from '@/types/field';

const AdminCampos = () => {
  const { user } = useUser();
  console.log("user desde campos admin ", user)
  
  // 1. Tipado de estados
  const [campos, setCampos] = useState<SoccerField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [fieldToDelete, setFieldToDelete] = useState<SoccerField | null>(null);
  const [updateState, setUpdateState] = useState<SoccerField | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActivo, setIsActivo] = useState(false);

  // 2. Validación de Seguridad Correcta
  // Nota: useEffect se encarga de la lógica, pero el renderizado se bloquea aquí
  if (user && user.role !== 'ADMIN') {
    notFound(); 
    return null;
  }

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const { success, content } = await getFieldsCompleta();
        if (success) {
            setCampos(content);
        } else {
            setError("No se pudieron cargar los campos");
        }
      } catch (err) {
        console.error("Error cargando campos:", err);
        setError("Error de conexión al servidor");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDatos();
  }, []); // Quitamos 'error' de las dependencias para evitar bucles infinitos

  const handleDelete = async () => {
    if (!fieldToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteField(fieldToDelete._id);
      if (res.success) {
        setCampos(prev => prev.filter(c => c._id !== fieldToDelete._id));
        setFieldToDelete(null);
      } else {
        alert(res.message || "No se pudo eliminar el campo");
      }
    } catch (err) {
      console.error("Error al eliminar", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateState = async () => {
    if (!updateState?._id) return;
    setIsActivo(true);

    try {
      const res = await updateStateField(updateState._id);
      if (res?.success) {
        setCampos((prevCampos) => 
          prevCampos.map((c) => 
            c._id === updateState._id ? { ...c, state: !c.state } : c
          )
        );
        setUpdateState(null);
      } else {
        alert(res.message || "Error al cambiar el estado");
      }
    } catch (err) {
      console.error("Error en handleUpdateState:", err);
    } finally {
      setIsActivo(false);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3">
      <Loader2 className="animate-spin text-brand-gold" size={40} />
      <p className="text-sm font-bold text-gray-500 uppercase">Cargando campos...</p>
    </div>
  );

/*   return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      
      {campos.map((campo) => (
          <tr key={campo._id.toString()}> 
             <td>{campo.name}</td>
          </tr>
      ))}
    </div>
  );
  
}; */
            


{/* ... Tu JSX se mantiene igual, ahora VS Code reconocerá campo.name, campo._id, etc. ... */}
      {/* Ejemplo de uso seguro en el map: */}




  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Administración de Campos</h1>
          <p className="text-gray-500 text-sm">Gestiona la disponibilidad, precios y detalles de tus canchas.</p>
        </div>

        <Link href={`/${user?.slug}/dashboard/campos/admin/save`}>
          <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-black font-bold py-2.5 px-6 rounded-lg transition-all shadow-sm active:scale-95">
            <Plus size={20} />
            Crear Nuevo Campo
          </button>
        </Link>
      </div>

      {/* FILTROS */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar campo por nombre o ubicación..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-brand-gray rounded-lg focus:ring-2 focus:ring-brand-gold focus:outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-gray rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter size={18} />
          Filtros
        </button>
      </div>

      {/* TABLA RESPONSIVA */}
      <div className="w-full max-w-7xl mx-auto overflow-hidden bg-white rounded-xl border border-brand-gray shadow-sm">
        <div className="block w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-brand-black text-white">
                <th className="px-6 py-4 text-xs font-bold uppercase">Campo</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Ubicación</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-center">Descripcion</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-center">Precio</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-center">Estado</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-right">Acciones</th>
              </tr>
            </thead>
            {error ? (
              <div className='bg-red-200 text-red-800 p-2 rounded-[6px] m-4'><span>{error}</span></div>
            ) : (

              <tbody className="divide-y divide-brand-gray">
                   {/* Si _id es objeto usa campo._id.$oid // si tiene que parsear a un id.toString() */}
                {campos && campos?.map((campo) => (
                  <tr key={campo._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand-black">{campo.name}</div>
                      <div className="text-[11px] text-gray-400 font-mono">ID: {campo._id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{campo.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{campo.description}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-brand-black">S/ {campo.pricePerHour}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        onClick={() => setUpdateState(campo)} // Activamos el modal
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${campo.state ? 'bg-brand-gold text-brand-black hover:bg-amber-500 hover:text-gray-500 cursor-pointer transition duration-300' : 'bg-brand-black text-brand-gold'
                          }`}>
                        {campo.state ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/${user?.slug}/dashboard/campos/admin/${campo._id}`}>
                          <button title="Editar" className="p-2 text-brand-gold hover:bg-yellow-50 rounded-lg transition-colors cursor-pointer">
                            <FilePenLine size={22} />
                          </button>
                        </Link>
                        <button
                          onClick={() => setFieldToDelete(campo)} // Activamos el modal
                          title="Eliminar"
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={22} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>
            )}

          </table>
        </div>
      </div>

      {/* --- MODAL DE CONFIRMACIÓN (Se renderiza solo si hay algo que borrar) --- */}
      {fieldToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-brand-black">¿Estás seguro?</h3>
              <p className="text-gray-500 text-sm mt-2">
                Vas a eliminar <strong className='text-brand-black font-medium text-base'>{fieldToDelete.name}</strong>. Esta acción no se puede deshacer y podrias eliminar las reservas vinculadas a este campo.
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setFieldToDelete(null)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}



      {/* --- MODAL DE CONFIRMACIÓN UPDATE STATE (Se renderiza solo si se va acambniar el estado) --- */}
      {updateState && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-black text-brand-gold rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-brand-black">¿Estás seguro?</h3>
              <p className="text-gray-500 text-sm mt-2">
                Vas a cambiar de estado de este campo <strong className='text-brand-black font-medium text-base'>{updateState.name}</strong>.
                Esta acción no se puede deshacer y podrias eliminar las reservas vinculadas a este campo.
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setUpdateState(null)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateState}
                disabled={isActivo}
                className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                 ${updateState?.state
                    ? 'bg-red-600 hover:bg-red-700 text-white' // Si está activo, el botón es para desactivar (rojo)
                    : 'bg-brand-gold hover:bg-amber-500 text-brand-black' // Si está inactivo, es para activar (dorado)
                  }`}
              >
                {isActivo ? (
                  <Loader2 className="animate-spin border-2" size={18} />
                ) : (
                  <>
                    {updateState?.state ? 'Sí, desactivar' : 'Sí, activar'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default AdminCampos;