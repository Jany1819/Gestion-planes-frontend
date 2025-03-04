import React, { useEffect, useState } from 'react';



interface UnidadCurricular {
  id: string;
  codigo: string;
  trayecto: number;
  semestre: string;
  unidades_credito: number;
  nombre: string;
}

const ListarUnidadCurricular: React.FC = () => {
  const [unidades, setUnidades] = useState<UnidadCurricular[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener las unidades curriculares del backend
  const fetchUnidades = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_HOST + '/gestion-planes/unidades-curriculares', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las unidades curriculares');
      }

      const data = await response.json();
      setUnidades(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las unidades curriculares');
    } finally {
      setLoading(false);
    }
  };

  // Obtener las unidades curriculares al cargar el componente
  useEffect(() => {
    fetchUnidades();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="w-full p-6 bg-[#2c2c2c] rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-[#ececec] mb-4">Listar Unidades Curriculares</h2>

      {unidades.length === 0 ? (
        <p className="text-[#ececec]">No hay unidades curriculares creadas.</p>
      ) : (
        <table className="w-full text-left text-[#ececec]">
          <thead>
            <tr className="border-b border-[#050A30]">
              <th className="p-2">Código</th>
              <th className="p-2">Trayecto</th>
              <th className="p-2">Semestre</th>
              <th className="p-2">Unidades de Crédito</th>
              <th className="p-2">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {unidades.map((unidad) => (
              <tr key={unidad.id} className="border-b border-[#050A30] hover:bg-[#050A30]">
                <td className="p-2">{unidad.codigo}</td>
                <td className="p-2">{unidad.trayecto}</td>
                <td className="p-2">{unidad.semestre}</td>
                <td className="p-2">{unidad.unidades_credito}</td>
                <td className="p-2">{unidad.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListarUnidadCurricular;