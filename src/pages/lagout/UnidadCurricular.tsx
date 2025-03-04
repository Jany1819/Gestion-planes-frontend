import React, { useState } from 'react';
import { FaPlus, FaList, FaEdit } from 'react-icons/fa';
import CrearUnidadCurricular from '@/pages/lagout/CrearUnidadCurricular';
import ListarUnidadCurricular from '@/pages/lagout/ListarUnidadCurricular';
import ModificarUnidadCurricular from '@/pages/lagout/ModificarUnidadCurricular';

const UnidadCurricular: React.FC = () => {
  const [view, setView] = useState<'crear' | 'listar' | 'modificar'>('crear');

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#2c2c2c] p-8 rounded-lg shadow-lg">
      
      {/* Título */}
      <h1 className="text-4xl font-bold text-[#ececec] mb-4">
        Unidad Curricular
      </h1>

      {/* Descripción */}
      <p className="text-lg text-[#8b8383] mb-8 text-center">
        Selecciona la acción que deseas realizar.
      </p>

      {/* Botones */}
      <div className="flex gap-8">
        
        {/* Crear Unidad Curricular */}
        <button
          onClick={() => setView('crear')}
          className="group flex flex-col items-center justify-center p-6 bg-[#050a30] rounded-lg shadow-lg hover:bg-[#ececec] transition-all duration-300 transform hover:scale-105"
          style={{
            boxShadow: '0 4px 6px rgba(255, 255, 255, 0.1)',
          }}
        >
          <FaPlus className="text-4xl text-[#ececec] mb-4 group-hover:text-[#050a30]" />
          <span className="text-xl font-semibold text-[#ececec] group-hover:text-[#050a30]">
            Crear Unidad Curricular
          </span>
        </button>

        {/* Listar Unidades Curriculares */}
        <button
          onClick={() => setView('listar')}
          className="group flex flex-col items-center justify-center p-6 bg-[#050a30] rounded-lg shadow-lg hover:bg-[#ececec] transition-all duration-300 transform hover:scale-105"
          style={{
            boxShadow: '0 4px 6px rgba(255, 255, 255, 0.1)',
          }}
        >
          <FaList className="text-4xl text-[#ececec] mb-4 group-hover:text-[#050a30]" />
          <span className="text-xl font-semibold text-[#ececec] group-hover:text-[#050a30]">
            Listar Unidades Curriculares
          </span>
        </button>

        {/* Modificar Unidad Curricular */}
        <button
          onClick={() => setView('modificar')}
          className="group flex flex-col items-center justify-center p-6 bg-[#050a30] rounded-lg shadow-lg hover:bg-[#ececec] transition-all duration-300 transform hover:scale-105"
          style={{
            boxShadow: '0 4px 6px rgba(255, 255, 255, 0.1)',
          }}
        >
          <FaEdit className="text-4xl text-[#ececec] mb-4 group-hover:text-[#050a30]" />
          <span className="text-xl font-semibold text-[#ececec] group-hover:text-[#050a30]">
            Modificar Unidad Curricular
          </span>
        </button>
      </div>

      {/* Mostrar la vista correspondiente */}
      <div className="w-full mt-8">
        {view === 'crear' && <CrearUnidadCurricular />}
        {view === 'listar' && <ListarUnidadCurricular />}
        {view === 'modificar' && <ModificarUnidadCurricular />}
      </div>
    </div>
  );
};

export default UnidadCurricular;