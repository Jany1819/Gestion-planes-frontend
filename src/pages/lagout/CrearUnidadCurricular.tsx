import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Asegúrate de que la ruta sea correcta

const CrearUnidadCurricular: React.FC = () => {
  const [formData, setFormData] = useState({
    codigo: '',
    trayecto: '',
    semestre: '',
    unidadesCredito: '',
    nombre: '',
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showError, setShowError] = useState(false);

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

  // Validar si todos los campos están llenos
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

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setShowError(true);
      return;
    }

    // Preparar los datos para enviar al backend
    const data = {
      codigo: formData.codigo,
      trayecto: parseInt(formData.trayecto, 10), 
      semestre: formData.semestre === 'NA' ? 'NA' : formData.semestre, 
      unidades_credito: parseInt(formData.unidadesCredito, 10), 
      nombre: formData.nombre,
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_HOST + '/gestion-planes/unidades-curriculares', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al crear la unidad curricular');
      }

      // Limpiar el formulario después de enviar
      setFormData({
        codigo: '',
        trayecto: '',
        semestre: '',
        unidadesCredito: '',
        nombre: '',
      });
      setErrors({});
      setShowError(false);
      alert('Unidad curricular creada exitosamente');
    } catch (err) {
      console.error(err);
      alert('Error al crear la unidad curricular. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-[#ececec] mb-4">Crear Unidad Curricular</h2>
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
            className={`w-full p-2 rounded-md bg-[#050A30] ${
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
            className={`w-full p-2 rounded-md bg-[#050A30] ${
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
            className={`w-full p-2 rounded-md bg-[#050A30] ${
              errors.nombre ? 'border border-red-500' : ''
            }`}
          />
          {errors.nombre && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio</p>}
        </div>

        {/* Mensaje de error general */}
        {showError && (
          <p className="text-red-500 text-sm mt-2">Verifica los campos marcados en rojo</p>
        )}

        {/* Botón */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#2c2c2c] text-[#ececec] hover:bg-[#ececec] hover:text-[#050a30] w-40">
            Crear Unidad Curricular
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CrearUnidadCurricular;