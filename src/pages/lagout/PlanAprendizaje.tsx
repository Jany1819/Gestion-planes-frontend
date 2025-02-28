import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';

// Tipo para un objetivo
type Objetivo = {
    titulo: string;
    estrategiasDidacticas: string;
    contenido: string;
    criterioLogro: string;
    duracionHoras: number;
};

const PlanAprendizaje: React.FC = () => {
    const navigate = useNavigate();

    // Campos principales
    const [grupo, setGrupo] = useState('');
    const [nucleo, setNucleo] = useState('');
    const [turno, setTurno] = useState('');
    const [pnf, setPnf] = useState('');
    const [fechaCreacion, setFechaCreacion] = useState('');

    // Campos dinámicos (objetivos)
    const [objetivos, setObjetivos] = useState<Objetivo[]>([]);

    
    const [errorCampos, setErrorCampos] = useState('');

    
    const baseURL = 'http://localhost:8000/api';

    // Agregar un nuevo objetivo
    const agregarObjetivo = () => {
        setObjetivos([
            ...objetivos,
            { titulo: '', estrategiasDidacticas: '', contenido: '', criterioLogro: '', duracionHoras: 0 },
        ]);
    };

    // Eliminar un objetivo
    const eliminarObjetivo = (index: number) => {
        const nuevosObjetivos = objetivos.filter((_, i) => i !== index);
        setObjetivos(nuevosObjetivos);
    };

    // Validar los campos
    const validarCampos = () => {
        const camposPrincipalesValidos =
            grupo && nucleo && turno && pnf && fechaCreacion;

        const objetivosValidos = objetivos.every(
            (objetivo) =>
                objetivo.titulo &&
                objetivo.estrategiasDidacticas &&
                objetivo.contenido &&
                objetivo.criterioLogro &&
                objetivo.duracionHoras >= 10 &&
                objetivo.duracionHoras <= 200
        );

        return camposPrincipalesValidos && objetivosValidos;
    };

    // Guardar el plan de aprendizaje y sus objetivos
    const guardarPlanAprendizaje = async () => {
        try {
            // Guardar el plan de aprendizaje
            const responsePlan = await axios.post(`${baseURL}/planes-aprendizaje/`, {
                grupo,
                nucleo,
                turno,
                pnf,
                fecha_creacion: fechaCreacion,
            });

            const planId = responsePlan.data.id;

            // Guardar los objetivos asociados al plan
            await Promise.all(
                objetivos.map((objetivo) =>
                    axios.post(`${baseURL}/planes-aprendizaje/${planId}/objetivos/`, objetivo)
                )
            );

            
            navigate('/dashboard/crear-plan');
        } catch (error) {
            console.error('Error al guardar el plan de aprendizaje:', error);
            setErrorCampos('Hubo un error al guardar el plan. Inténtalo de nuevo.');
        }
    };

    // Envío del formulario
    const handleSubmit = () => {
        setErrorCampos('');

        const camposValidos = validarCampos();

        if (!camposValidos) {
            setErrorCampos('Verifica los campos marcados en rojo.');
        } else {
            guardarPlanAprendizaje();
        }
    };

    
    const campoVacio = (valor: string) => {
        return valor.trim() === '';
    };

    return (
        <div className="bg-[#2c2c2c] p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-[#ececec] mb-6">Plan de Aprendizaje</h1>

            {/* Campos principales */}
            <div className="space-y-4">
                <Input
                    type="text"
                    value={grupo}
                    onChange={(e) => setGrupo(e.target.value)}
                    placeholder="Grupo"
                    required
                    className={campoVacio(grupo) && errorCampos ? 'border-red-500' : ''}
                />

                {/* Núcleo */}
                <div>
                    <label className="block text-sm font-medium text-[#ececec] mb-1">
                        Núcleo
                    </label>
                    <select
                        value={nucleo}
                        onChange={(e) => setNucleo(e.target.value)}
                        className={`w-full p-2 rounded-md bg-[#3c3c3c] text-[#ececec] focus:outline-none focus:ring-2 focus:ring-[#050a30] ${
                            campoVacio(nucleo) && errorCampos ? 'border-red-500' : ''
                        }`}
                        required
                    >
                        <option value="">Seleccione un núcleo</option>
                        <option value="La Floresta">La Floresta</option>
                        <option value="La Urbina">La Urbina</option>
                        <option value="Altagracia">Altagracia</option>
                        <option value="Carayaca">Carayaca</option>
                    </select>
                </div>

                {/* Turno */}
                <div>
                    <label className="block text-sm font-medium text-[#ececec] mb-1">
                        Turno
                    </label>
                    <select
                        value={turno}
                        onChange={(e) => setTurno(e.target.value)}
                        className={`w-full p-2 rounded-md bg-[#3c3c3c] text-[#ececec] focus:outline-none focus:ring-2 focus:ring-[#050a30] ${
                            campoVacio(turno) && errorCampos ? 'border-red-500' : ''
                        }`}
                        required
                    >
                        <option value="">Seleccione un turno</option>
                        <option value="Mañana">Mañana</option>
                        <option value="Vespertino">Vespertino</option>
                        <option value="Nocturno">Nocturno</option>
                    </select>
                </div>
                <Input
                    type="text"
                    value={pnf}
                    onChange={(e) => setPnf(e.target.value)}
                    placeholder="PNF"
                    required
                    className={campoVacio(pnf) && errorCampos ? 'border-red-500' : ''}
                />

                {/* Fecha de Creación */}
                <div>
                    <label className="block text-sm font-medium text-[#ececec] mb-1">
                        Fecha de Creación
                    </label>
                    <Input
                        type="date"
                        value={fechaCreacion}
                        onChange={(e) => setFechaCreacion(e.target.value)}
                        required
                        className={campoVacio(fechaCreacion) && errorCampos ? 'border-red-500' : ''}
                    />
                </div>
            </div>

            {/* Campos dinámicos (objetivos) */}
            <div className="mt-6">
                {objetivos.map((objetivo, index) => (
                    <div key={index} className="bg-[#050a30] p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-[#ececec]">
                                Objetivo {index + 1}
                            </h2>
                            {objetivos.length > 1 && (
                                <button
                                    onClick={() => eliminarObjetivo(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">
                            <Input
                                type="text"
                                value={objetivo.titulo}
                                onChange={(e) => {
                                    const nuevosObjetivos = [...objetivos];
                                    nuevosObjetivos[index].titulo = e.target.value;
                                    setObjetivos(nuevosObjetivos);
                                }}
                                placeholder="Título del Objetivo"
                                required
                                className={campoVacio(objetivo.titulo) && errorCampos ? 'border-red-500' : ''}
                            />
                            {/* Estrategias Didácticas */}
                            <div>
                                <label className="block text-sm font-medium text-[#ececec] mb-1">
                                    Estrategias Didácticas
                                </label>
                                <select
                                    value={objetivo.estrategiasDidacticas}
                                    onChange={(e) => {
                                        const nuevosObjetivos = [...objetivos];
                                        nuevosObjetivos[index].estrategiasDidacticas = e.target.value;
                                        setObjetivos(nuevosObjetivos);
                                    }}
                                    className={`w-full p-2 rounded-md bg-[#3c3c3c] text-[#ececec] focus:outline-none focus:ring-2 focus:ring-[#050a30] ${
                                        campoVacio(objetivo.estrategiasDidacticas) && errorCampos ? 'border-red-500' : ''
                                    }`}
                                    required
                                >
                                    <option value="">Seleccione una estrategia</option>
                                    <option value="Clase magistral">Clase magistral</option>
                                    <option value="Trabajo en grupo">Trabajo en grupo</option>
                                    <option value="Debate">Debate</option>
                                    <option value="Estudio de caso">Estudio de caso</option>
                                    <option value="Aprendizaje basado en problemas">Aprendizaje basado en problemas</option>
                                    <option value="Proyecto">Proyecto</option>
                                    <option value="Taller">Taller</option>
                                    <option value="Laboratorio">Laboratorio</option>
                                    <option value="Exposición">Exposición</option>
                                    <option value="Seminario">Seminario</option>
                                    <option value="Tutoría individual">Tutoría individual</option>
                                    <option value="Tutoría colectiva">Tutoría colectiva</option>
                                    <option value="Visita guiada">Visita guiada</option>
                                    <option value="Práctica de campo">Práctica de campo</option>
                                    <option value="Evaluación">Evaluación</option>
                                    <option value="Otras">Otras</option>
                                </select>
                            </div>

                            {/* Contenido */}
                            <div>
                                <label className="block text-sm font-medium text-[#ececec] mb-1">
                                    Contenido
                                </label>
                                <textarea
                                    value={objetivo.contenido}
                                    onChange={(e) => {
                                        const nuevosObjetivos = [...objetivos];
                                        nuevosObjetivos[index].contenido = e.target.value;
                                        setObjetivos(nuevosObjetivos);
                                    }}
                                    placeholder="Contenido"
                                    required
                                    className={`w-full p-2 rounded-md bg-[#3c3c3c] text-[#ececec] focus:outline-none focus:ring-2 focus:ring-[#050a30] ${
                                        campoVacio(objetivo.contenido) && errorCampos ? 'border-red-500' : ''
                                    }`}
                                    rows={4}
                                />
                            </div>

                            {/* Criterio de Logro */}
                            <div>
                                <label className="block text-sm font-medium text-[#ececec] mb-1">
                                    Criterio de Logro
                                </label>
                                <textarea
                                    value={objetivo.criterioLogro}
                                    onChange={(e) => {
                                        const nuevosObjetivos = [...objetivos];
                                        nuevosObjetivos[index].criterioLogro = e.target.value;
                                        setObjetivos(nuevosObjetivos);
                                    }}
                                    placeholder="Criterio de Logro"
                                    required
                                    className={`w-full p-2 rounded-md bg-[#3c3c3c] text-[#ececec] focus:outline-none focus:ring-2 focus:ring-[#050a30] ${
                                        campoVacio(objetivo.criterioLogro) && errorCampos ? 'border-red-500' : ''
                                    }`}
                                    rows={4}
                                />
                            </div>
                            
                            {/* Duración (horas) */}
                            <div>
                                <label className="block text-sm font-medium text-[#ececec] mb-1">
                                    Duración (horas)
                                </label>
                                <Input
                                    type="number"
                                    value={objetivo.duracionHoras}
                                    onChange={(e) => {
                                        const nuevosObjetivos = [...objetivos];
                                        nuevosObjetivos[index].duracionHoras = Number(e.target.value);
                                        setObjetivos(nuevosObjetivos);
                                    }}
                                    placeholder="Duración (horas)"
                                    required
                                    className={(objetivo.duracionHoras < 10 || objetivo.duracionHoras > 200) && errorCampos ? 'border-red-500' : ''}
                                    min={10}
                                    max={200}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                <button
                    onClick={agregarObjetivo}
                    className="flex items-center justify-center w-full p-2 bg-[#050a30] text-[#ececec] rounded-lg hover:bg-[#ececec] hover:text-[#050a30] transition-all duration-300"
                >
                    <FaPlus className="mr-2" />
                    Agregar Objetivo
                </button>
            </div>

            {/* Mensajes de error */}
            {errorCampos && (
                <p className="text-red-500 mt-4">{errorCampos}</p>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-4 mt-6">
                <Button
                    onClick={() => navigate('/dashboard/crear-plan')}
                    className="bg-[#050a30] text-[#ececec] hover:bg-[#ececec] hover:text-[#050a30]"
                >
                    Salir del formulario
                </Button>
                <Button
                    onClick={handleSubmit}
                    className="bg-[#050a30] text-[#ececec] hover:bg-[#ececec] hover:text-[#050a30]"
                >
                    Guardar Plan de Aprendizaje
                </Button>
            </div>
        </div>
    );
};

export default PlanAprendizaje;