import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaBookOpen } from 'react-icons/fa';

const CrearPlan: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#2c2c2c] p-8 rounded-lg shadow-lg">
            
            {/* Título */}
            <h1 className="text-4xl font-bold text-[#ececec] mb-4">
                Crear Plan
            </h1>

            {/* Descripción */}
            <p className="text-lg text-[#8b8383] mb-8 text-center">
                Selecciona el tipo de plan que deseas crear.
            </p>

            {/* Botones */}
            <div className="flex gap-8">
                
                <button
                    onClick={() => navigate('/lagout/crear-plan/evaluacion')} 
                    className="group flex flex-col items-center justify-center p-6 bg-[#050a30] rounded-lg shadow-lg hover:bg-[#ececec] transition-all duration-300 transform hover:scale-105"
                    style={{
                        boxShadow: '0 4px 6px rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <FaClipboardList className="text-4xl text-[#ececec] mb-4 group-hover:text-[#050a30]" />
                    <span className="text-xl font-semibold text-[#ececec] group-hover:text-[#050a30]">
                        Plan de Evaluación
                    </span>
                </button>

                
                <button
                    onClick={() => navigate('/lagout/crear-plan/aprendizaje')} 
                    className="group flex flex-col items-center justify-center p-6 bg-[#050a30] rounded-lg shadow-lg hover:bg-[#ececec] transition-all duration-300 transform hover:scale-105"
                    style={{
                        boxShadow: '0 4px 6px rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <FaBookOpen className="text-4xl text-[#ececec] mb-4 group-hover:text-[#050a30]" />
                    <span className="text-xl font-semibold text-[#ececec] group-hover:text-[#050a30]">
                        Plan de Aprendizaje
                    </span>
                </button>
            </div>
        </div>
    );
};

export default CrearPlan;