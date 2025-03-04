import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaList, FaEdit, FaSignOutAlt , FaBook } from 'react-icons/fa';

// Obtener los datos del docente autenticado
const obtenerDatosDocente = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const response = await fetch(import.meta.env.VITE_API_HOST + '/autenticacion-docente/info', { 
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Error al obtener los datos del docente');
    const data = await response.json();
    return data; // Devuelve los datos del docente
  } catch (err) {
    console.error(err);
    return null;
  }
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [docente, setDocente] = useState<{ nombre: string; cedula: string } | null>(null);

  // Obtener los datos del docente al cargar el componente
  useEffect(() => {
    const fetchDocente = async () => {
      const datos = await obtenerDatosDocente();
      if (datos) setDocente(datos);
    };
    fetchDocente();
  }, []);

  // Manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_HOST + 'autenticacion-docente/logout', { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Error al cerrar sesión');
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token'); 
      navigate('/login'); 
    }
  };

  return (
    <div className="w-64 bg-[#050A30] text-white p-6 min-h-screen">
      <div className="mb-8">
        <img src="/src/assets/Logo-unexca.png" alt="Logo" className="w-10 h-10" />
      </div>

      {/* Mostrar los datos del docente */}
      {docente && (
        <div className="mb-6">
          <p className="text-sm">Bienvenido, {docente.nombre}</p>
          <p className="text-xs text-gray-400">{docente.cedula}</p>
        </div>
      )}

      {/* Menú de Navegación */}
      <nav>
        <ul className="space-y-4">

          {/* Listar Planes */}
          <li>
            <Link
              to="/lagout/listar-planes"
              className="flex items-center p-2 rounded-md hover:bg-[#2c2c2c] transition-colors"
            >
              <FaList className="mr-2" />
              <span>Listar Planes</span>
            </Link>
          </li>

          {/* Crear Plan */}
          <li>
            <Link
              to="/lagout/crear-plan"
              className="flex items-center p-2 rounded-md hover:bg-[#2c2c2c] transition-colors"
            >
              <FaPlus className="mr-2" />
              <span>Crear Plan</span>
            </Link>
          </li>

          {/* Modificar Plan */}
          <li>
            <Link
              to="/lagout/modificar-plan"
              className="flex items-center p-2 rounded-md hover:bg-[#2c2c2c] transition-colors" >
              <FaEdit className="mr-2" />
              <span>Modificar Plan</span>
            </Link>
          </li>
          
          {/* Unidad Curricular */}
          <li>
             <Link
                to="/lagout/unidad-curricular"
                className="flex items-center p-2 rounded-md hover:bg-[#2c2c2c] transition-colors" >
                <FaBook className="mr-2" />
                <span>Unidad Curricular</span>
              </Link>
           </li>

          {/* Cerrar sesión */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center p-2 rounded-md hover:bg-[#2c2c2c] transition-colors w-full"
            >
              <FaSignOutAlt className="mr-2" />
              <span>Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;