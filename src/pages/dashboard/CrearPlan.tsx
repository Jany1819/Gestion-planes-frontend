import React from 'react';

const CrearPlan: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#050A30] mb-4">Crear Plan</h1>
      <div className="flex space-x-4">
        <button className="bg-[#050A30] text-white px-6 py-3 rounded-md hover:bg-[#2c2c2c] transition-colors">
          Plan de Evaluación
        </button>
        <button className="bg-[#050A30] text-white px-6 py-3 rounded-md hover:bg-[#2c2c2c] transition-colors">
          Plan de Aprendizaje
        </button>
      </div>
    </div>
  );
};

export default CrearPlan;