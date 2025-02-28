import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';

// Tipo para una evaluación
type Evaluacion = {
    tipo: string;
    instrumento: string;
    habilidades: string;
    peso: string;
    fechaPlanificada: string;
};

const PlanEvaluacion: React.FC = () => {
    const navigate = useNavigate();
    const { plan_aprendizaje_pk } = useParams(); 

    // Campos principales
    const [fechaCreacion, setFechaCreacion] = useState('');
    const [titulo, setTitulo] = useState('');
    const [unidadCurricular, setUnidadCurricular] = useState('');
    const [nucleo, setNucleo] = useState('');
    const [turno, setTurno] = useState('');

    // Campos dinámicos
    const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);

    
    const [errorPonderacion, setErrorPonderacion] = useState('');
    const [errorCampos, setErrorCampos] = useState('');

    
    const baseURL = 'http://localhost:8000/api';

    // Agregar una nueva evaluación
    const agregarEvaluacion = () => {
        setEvaluaciones([
            ...evaluaciones,
            { tipo: '', instrumento: '', habilidades: '', peso: '', fechaPlanificada: '' },
        ]);
    };

    // Eliminar una evaluación
    const eliminarEvaluacion = (index: number) => {
        const nuevasEvaluaciones = evaluaciones.filter((_, i) => i !== index);
        setEvaluaciones(nuevasEvaluaciones);
    };

    // Validar ponderaciones
    const validarPonderaciones = () => {
        const sumaPonderaciones = evaluaciones.reduce(
            (sum, evaluacion) => sum + Number(evaluacion.peso || 0),
            0
        );
        return sumaPonderaciones === 100;
    };

    // Validar campos
    const validarCampos = () => {
        const camposPrincipalesValidos =
            fechaCreacion && titulo && unidadCurricular && nucleo && turno;

        const evaluacionesValidas = evaluaciones.every(
            (evaluacion) =>
                evaluacion.tipo &&
                evaluacion.instrumento &&
                evaluacion.habilidades &&
                evaluacion.peso &&
                evaluacion.fechaPlanificada
        );

        return camposPrincipalesValidos && evaluacionesValidas;
    };

    // Guardar el plan de evaluación y sus ítems
    const guardarPlanEvaluacion = async () => {
        try {

            // Guardar el plan de evaluación
            const responsePlan = await axios.post(`${baseURL}/planes-aprendizaje/${plan_aprendizaje_pk}/evaluaciones/`, {
                fecha_creacion: fechaCreacion,
                titulo,
                unidad_curricular: unidadCurricular,
                nucleo,
                turno,
            });

            const planId = responsePlan.data.id;

            // Guardar los ítems de evaluación asociados al plan
            await Promise.all(
                evaluaciones.map((evaluacion) =>
                    axios.post(`${baseURL}/planes-evaluacion/${planId}/items/`, evaluacion)
                )
            );

            
            navigate('/dashboard/crear-plan');
        } catch (error) {
            console.error('Error al guardar el plan de evaluación:', error);
            setErrorCampos('Hubo un error al guardar el plan. Inténtalo de nuevo.');
        }
    };

    // Envío del formulario
    const handleSubmit = () => {
        setErrorPonderacion('');
        setErrorCampos('');

        const ponderacionesValidas = validarPonderaciones();
        const camposValidos = validarCampos();

        if (!ponderacionesValidas) {
            setErrorPonderacion('La suma de las ponderaciones debe ser igual al 100%.');
        }

        if (!camposValidos) {
            setErrorCampos('Verifica los campos marcados en rojo.');
        }

        if (ponderacionesValidas && camposValidos) {
            guardarPlanEvaluacion();
        }
    };

    // Verificar si un campo está vacío
    const campoVacio = (valor: string) => {
        return valor.trim() === '';
    };

    return (
        <div className="bg-[#2c2c2c] p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-[#ececec] mb-6">Plan de Evaluación</h1>

            {/* Campos principales */}
            <div className="space-y-4">

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
                <Input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Título del Plan"
                    required
                    className={campoVacio(titulo) && errorCampos ? 'border-red-500' : ''}
                />
                <Input
                    type="text"
                    value={unidadCurricular}
                    onChange={(e) => setUnidadCurricular(e.target.value)}
                    placeholder="Unidad Curricular"
                    required
                    className={campoVacio(unidadCurricular) && errorCampos ? 'border-red-500' : ''}
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
            </div>

            {/* Campos dinámicos (item)*/}
            <div className="mt-6">
                {evaluaciones.map((evaluacion, index) => (
                    <div key={index} className="bg-[#050a30] p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-[#ececec]">
                                Evaluación {index + 1}
                            </h2>
                            {evaluaciones.length > 1 && (
                                <button
                                    onClick={() => eliminarEvaluacion(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">

                            {/* Tipo de Evaluación */}
                            <div>
                                <label className="block text-sm font-medium text-[#ececec] mb-1">
                                    Tipo de Evaluación
                                </label>
                                <select
                                    value={evaluacion.tipo}
                                    onChange={(e) => {
                                        const nuevasEvaluaciones = [...evaluaciones];
                                        nuevasEvaluaciones[index].tipo = e.target.value;
                                        setEvaluaciones(nuevasEvaluaciones);
                                    }}
                                    className={`w-full p-2 rounded-md bg-[#3c3c3c] text-[#ececec] focus:outline-none focus:ring-2 focus:ring-[#050a30] ${
                                        campoVacio(evaluacion.tipo) && errorCampos ? 'border-red-500' : ''
                                    }`}
                                    required
                                >
                                    <option value="">Seleccione el tipo de evaluación</option>
                                    <option value="Diagnóstica">Diagnóstica</option>
                                    <option value="Formativa">Formativa</option>
                                    <option value="Sumativa">Sumativa</option>
                                    <option value="Autoevaluación">Autoevaluación</option>
                                    <option value="Coevaluación">Coevaluación</option>
                                </select>
                            </div>

                            {/* Instrumento de Evaluación */}
                            <div>
                                <label className="block text-sm font-medium text-[#ececec] mb-1">
                                    Instrumento de Evaluación
                                </label>
                                <select
                                    value={evaluacion.instrumento}
                                    onChange={(e) => {
                                        const nuevasEvaluaciones = [...evaluaciones];
                                        nuevasEvaluaciones[index].instrumento = e.target.value;
                                        setEvaluaciones(nuevasEvaluaciones);
                                    }}
                                    className={`w-full p-2 rounded-md bg-[#3c3c3c] text-[#ececec] focus:outline-none focus:ring-2 focus:ring-[#050a30] ${
                                        campoVacio(evaluacion.instrumento) && errorCampos ? 'border-red-500' : ''
                                    }`}
                                    required
                                >
                                    <option value="">Seleccione un instrumento</option>
                                    <option value="Prueba escrita (objetiva)">Prueba escrita (objetiva)</option>
                                    <option value="Prueba escrita (ensayo)">Prueba escrita (ensayo)</option>
                                    <option value="Prueba oral">Prueba oral</option>
                                    <option value="Trabajo escrito">Trabajo escrito</option>
                                    <option value="Tarea">Tarea</option>
                                    <option value="Examen práctico">Examen práctico</option>
                                    <option value="Proyecto">Proyecto</option>
                                    <option value="Informe">Informe</option>
                                    <option value="Participación en clase">Participación en clase</option>
                                    <option value="Actividades colaborativas">Actividades colaborativas</option>
                                    <option value="Debate">Debate</option>
                                    <option value="Exposición oral">Exposición oral</option>
                                    <option value="Seminario">Seminario</option>
                                    <option value="Control de lectura">Control de lectura</option>
                                    <option value="Cuestionario">Cuestionario</option>
                                    <option value="Diario reflexivo">Diario reflexivo</option>
                                    <option value="Carpeta de trabajos">Carpeta de trabajos</option>
                                    <option value="Autoevaluación">Autoevaluación</option>
                                    <option value="Coevaluación">Coevaluación</option>
                                    <option value="Otras">Otras</option>
                                </select>
                            </div>
                            <Input
                                type="text"
                                value={evaluacion.habilidades}
                                onChange={(e) => {
                                    const nuevasEvaluaciones = [...evaluaciones];
                                    nuevasEvaluaciones[index].habilidades = e.target.value;
                                    setEvaluaciones(nuevasEvaluaciones);
                                }}
                                placeholder="Habilidades a Evaluar"
                                required
                                className={campoVacio(evaluacion.habilidades) && errorCampos ? 'border-red-500' : ''}
                            />
                            <div className="relative">
                                <select
                                    value={evaluacion.peso}
                                    onChange={(e) => {
                                        const nuevasEvaluaciones = [...evaluaciones];
                                        nuevasEvaluaciones[index].peso = e.target.value;
                                        setEvaluaciones(nuevasEvaluaciones);
                                    }}
                                    className={`w-full p-2 rounded-md bg-[#3c3c3c] text-[#ececec] focus:outline-none focus:ring-2 focus:ring-[#050a30] ${
                                        campoVacio(evaluacion.peso) && errorCampos ? 'border-red-500' : ''
                                    }`}
                                    required
                                >
                                    <option value="">Seleccione el peso</option>
                                    <option value="5">5%</option>
                                    <option value="10">10%</option>
                                    <option value="15">15%</option>
                                    <option value="20">20%</option>
                                    <option value="25">25%</option>
                                </select>
                            </div>
                            
                            {/* Fecha Planificada */}
                            <div>
                                <label className="block text-sm font-medium text-[#ececec] mb-1">
                                    Fecha Planificada
                                </label>
                                <Input
                                    type="date"
                                    value={evaluacion.fechaPlanificada}
                                    onChange={(e) => {
                                        const nuevasEvaluaciones = [...evaluaciones];
                                        nuevasEvaluaciones[index].fechaPlanificada = e.target.value;
                                        setEvaluaciones(nuevasEvaluaciones);
                                    }}
                                    required
                                    className={campoVacio(evaluacion.fechaPlanificada) && errorCampos ? 'border-red-500' : ''}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                <button
                    onClick={agregarEvaluacion}
                    className="flex items-center justify-center w-full p-2 bg-[#050a30] text-[#ececec] rounded-lg hover:bg-[#ececec] hover:text-[#050a30] transition-all duration-300"
                >
                    <FaPlus className="mr-2" />
                    Agregar Evaluación
                </button>
            </div>

            {/* Mensajes de error */}
            {errorPonderacion && (
                <p className="text-red-500 mt-4">{errorPonderacion}</p>
            )}
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
                    Guardar Plan de Evaluación
                </Button>
            </div>
        </div>
    );
};

export default PlanEvaluacion;