import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-[#050A30] text-white p-6">
      {/* Logo */}
      <div className="mb-8">
        <img
          src="/src/assets/Logo-unexca.png"
          alt="Logo"
          className="w-10 h-10"
        />
      </div>

      {/* Menú de Navegación */}
      <nav>
        <ul className="space-y-4">
          {/* Enlace a Home */}
          <li>
            <Link
              to="/dashboard/home" // Cambiado de inicio a home
              className="flex items-center p-2 rounded-md hover:bg-[#2c2c2c] transition-colors"
            >
              <span>Home</span> {/* Cambiado de Inicio a Home */}
            </Link>
          </li>

          {/* Enlace a Crear Plan */}
          <li>
            <Link
              to="/dashboard/crear-plan"
              className="flex items-center p-2 rounded-md hover:bg-[#2c2c2c] transition-colors"
            >
              <span>Crear Plan</span>
            </Link>
          </li>

          {/* Enlace a Listar Planes */}
          <li>
            <Link
              to="/dashboard/listar-planes"
              className="flex items-center p-2 rounded-md hover:bg-[#2c2c2c] transition-colors"
            >
              <span>Listar Planes</span>
            </Link>
          </li>

          {/* Enlace a Modificar Plan */}
          <li>
            <Link
              to="/dashboard/modificar-plan"
              className="flex items-center p-2 rounded-md hover:bg-[#2c2c2c] transition-colors"
            >
              <span>Modificar Plan</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;