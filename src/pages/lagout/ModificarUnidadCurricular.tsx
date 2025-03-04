import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ModificarUnidadCurricular: React.FC = () => {
  const { codigo } = useParams<{ codigo: string }>(); // Obtener el código de la URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigo: '',
    trayecto: '',
    semestre: '',
    unidadesCredito: '',
    nombre: '',
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showError, setShowError] = useState(false);

  // Obtener los datos de la unidad curricular al cargar el componente
  useEffect(() => {
    const fetchUnidadCurricular = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_HOST + `gestion-planes/unidades-curriculares/${codigo}/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener la unidad curricular');
        }

        const data = await response.json();
        setFormData({
          codigo: data.codigo,
          trayecto: data.trayecto.toString(),
          semestre: data.semestre,
          unidadesCredito: data.unidades_credito.toString(),
          nombre: data.nombre,
        });
      } catch (err) {
        console.error(err);
        alert('Error al cargar la unidad curricular');
      }
    };

    fetchUnidadCurricular();
  }, [codigo]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  // Manejar cambios en los campos de tipo Select
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  // Validar todos los campos esten llenos
  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    if (!formData.codigo) {
      newErrors.codigo = true;
      isValid = false;
    }
    if (!formData.trayecto) {
      newErrors.trayecto = true;
      isValid = false;
    }
    if (!formData.semestre) {
      newErrors.semestre = true;
      isValid = false;
    }
    if (!formData.unidadesCredito) {
      newErrors.unidadesCredito = true;
      isValid = false;
    }
    if (!formData.nombre) {
      newErrors.nombre = true;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Envío del formulario (actualización)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setShowError(true);
      return;
    }

    const data = {
      codigo: formData.codigo,
      trayecto: parseInt(formData.trayecto, 10),
      semestre: formData.semestre === 'NA' ? 'NA' : formData.semestre,
      unidades_credito: parseInt(formData.unidadesCredito, 10),
      nombre: formData.nombre,
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_HOST + `gestion-planes/unidades-curriculares/${codigo}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la unidad curricular');
      }

      alert('Unidad curricular actualizada exitosamente');
      navigate('/lagout/listar-unidades-curriculares'); // Redirigir a la vista de listar unidades curriculares
    } catch (err) {
      console.error(err);
      alert('Error al actualizar la unidad curricular. Inténtalo de nuevo.');
    }
  };

  // Eliminación de la unidad curricular
  const handleEliminar = async () => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta unidad curricular?');
    if (!confirmacion) return;

    try {
      const response = await fetch(import.meta.env.VITE_API_HOST + `gestion-planes/unidades-curriculares/${codigo}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la unidad curricular');
      }

      alert('Unidad curricular eliminada exitosamente');
      navigate('/lagout/listar-unidades-curriculares'); // Redirigir a la vista de listar unidades curriculare
    } catch (err) {
      console.error(err);
      alert('Error al eliminar la unidad curricular. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-[#ececec] mb-4">Modificar Unidad Curricular</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 bg-[#050a30] rounded-lg shadow-lg"
        style={{
          boxShadow: '0 4px 6px rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Código */}
        <div>
          <label className="block text-[#ececec] mb-2">Código</label>
          <Input
            type="text"
            name="codigo"
            placeholder="Código"
            value={formData.codigo}
            onChange={handleChange}
            className={`w-full p-2 rounded-md bg-[#050A30] text-[#ececec] ${
              errors.codigo ? 'border border-red-500' : ''
            }`}
          />
          {errors.codigo && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio</p>}
        </div>

        {/* Trayecto */}
        <div>
          <label className="block text-[#ececec] mb-2">Trayecto</label>
          <Select
            value={formData.trayecto}
            onValueChange={(value) => handleSelectChange('trayecto', value)}
          >
            <SelectTrigger
              className={`w-full p-2 rounded-md bg-[#2c2c2c] text-[#ececec] ${
                errors.trayecto ? 'border border-red-500' : ''
              }`}
            >
              <SelectValue placeholder="Selecciona un trayecto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Inicial</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
          {errors.trayecto && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio</p>}
        </div>

        {/* Semestre */}
        <div>
          <label className="block text-[#ececec] mb-2">Semestre</label>
          <Select
            value={formData.semestre}
            onValueChange={(value) => handleSelectChange('semestre', value)}
          >
            <SelectTrigger
              className={`w-full p-2 rounded-md bg-[#2c2c2c] text-[#ececec] ${
                errors.semestre ? 'border border-red-500' : ''
              }`}
            >
              <SelectValue placeholder="Selecciona un semestre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NA">No Aplica</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
            </SelectContent>
          </Select>
          {errors.semestre && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio</p>}
        </div>

        {/* Unidades de Crédito */}
        <div>
          <label className="block text-[#ececec] mb-2">Unidades Crédito</label>
          <Input
            type="number"
            name="unidadesCredito"
            placeholder="Unidades de Crédito"
            value={formData.unidadesCredito}
            onChange={handleChange}
            className={`w-full p-2 rounded-md bg-[#050A30] text-[#ececec] ${
              errors.unidadesCredito ? 'border border-red-500' : ''
            }`}
            min={1}
            max={10}
          />
          {errors.unidadesCredito && (
            <p className="text-red-500 text-sm mt-1">Este campo es obligatorio</p>
          )}
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-[#ececec] mb-2">Nombre</label>
          <Input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`w-full p-2 rounded-md bg-[#050A30] text-[#ececec] ${
              errors.nombre ? 'border border-red-500' : ''
            }`}
          />
          {errors.nombre && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio</p>}
        </div>

        {/* Mensaje de error general */}
        {showError && (
          <p className="text-red-500 text-sm mt-2">Verifica los campos marcados en rojo</p>
        )}

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={handleEliminar}
            className="bg-[#2c2c2c] text-[#ececec] hover:bg-[#ff0000]">

            Eliminar unidad curricular
          </Button>

          <Button
            type="submit"
            className="bg-[#2c2c2c] text-[#ececec] hover:bg-[#ececec] hover:text-[#050a30]">

            Modificar unidad curricular
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ModificarUnidadCurricular;