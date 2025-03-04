import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';

// Tipo para una evaluación
type Evaluacion = {
    objetivoAsociado: string;
    tipo: string;
    instrumento: string;
    habilidades: string;
    peso: string;
    fechaPlanificada: string;
    duracionHoras: number;
};

const PlanEvaluacion: React.FC = () => {
    const navigate = useNavigate();
    const { plan_aprendizaje_pk } = useParams();

    // Campos principales
    const [nombre, setNombre] = useState('');
    const [fechaCreacion, setFechaCreacion] = useState('');
    const [fechaModificacion, setFechaModificacion] = useState('');
    const [titulo, setTitulo] = useState('');
    const [unidadCurricular, setUnidadCurricular] = useState('');
    const [nucleo, setNucleo] = useState('');
    const [turno, setTurno] = useState('');
    const [pnf, setPnf] = useState('');
    const [docente, setDocente] = useState('');

    // Campos dinámicos
    const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);

    const [errorPonderacion, setErrorPonderacion] = useState('');
    const [errorCampos, setErrorCampos] = useState('');

    // Obtener objetivos del plan de aprendizaje
    const [objetivos, setObjetivos] = useState<{ id: string; titulo: string }[]>([]);
    useEffect(() => {
        const fetchObjetivos = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API_HOST + '/gestion-planes/objetivos-aprendizaje/');
                if (Array.isArray(response.data)) {
                    setObjetivos(response.data);
                } else {
                    console.error('La respuesta del backend no es un array:', response.data);
                    setObjetivos([]);
                }
            } catch (error) {
                console.error('Error al obtener los objetivos:', error);
                setObjetivos([]);
            }
        };
        fetchObjetivos();
    }, [plan_aprendizaje_pk]);

    // Agregar una nueva evaluación
    const agregarEvaluacion = () => {
        setEvaluaciones([
            ...evaluaciones,
            { objetivoAsociado: '', tipo: '', instrumento: '', habilidades: '', peso: '', fechaPlanificada: '', duracionHoras: 0 },
        ]);
    };

    // Eliminar una evaluación
    const eliminarEvaluacion = (index: number) => {
        const nuevasEvaluaciones = evaluaciones.filter((_, i) => i !== index);
        setEvaluaciones(nuevasEvaluaciones);
    };

    // Validar las ponderaciones
    const validarPonderaciones = () => {
        const sumaPonderaciones = evaluaciones.reduce(
            (sum, evaluacion) => sum + Number(evaluacion.peso || 0),
            0
        );
        return sumaPonderaciones === 100;
    };

    // Validar los campos
    const validarCampos = () => {
        const camposPrincipalesValidos =
            nombre && fechaCreacion && fechaModificacion && titulo && unidadCurricular && nucleo && turno && pnf && docente;

        const evaluacionesValidas = evaluaciones.every(
            (evaluacion) =>
                evaluacion.objetivoAsociado &&
                evaluacion.tipo &&
                evaluacion.instrumento &&
                evaluacion.habilidades &&
                evaluacion.peso &&
                evaluacion.fechaPlanificada &&
                evaluacion.duracionHoras >= 2 &&
                evaluacion.duracionHoras <= 9
        );

        return camposPrincipalesValidos && evaluacionesValidas;
    };

    // Crear plan de evaluación y sus ítems
    const guardarPlanEvaluacion = async () => {
        try {
            // Guardar plan de evaluación
            const responsePlan = await axios.post(import.meta.env.VITE_API_HOST + `/gestion-planes/planes-evaluacion/`, {
                nombre,
                fecha_creacion: fechaCreacion,
                fecha_modificacion: fechaModificacion,
                titulo,
                unidad_curricular: unidadCurricular,
                nucleo,
                turno,
                pnf,
                docente,
            });

            const planId = responsePlan.data.id;

            // Guardar ítems de evaluación asociados al plan
            await Promise.all(
                evaluaciones.map((evaluacion) =>
                    axios.post(import.meta.env.VITE_API_HOST + `/gestion-planes/items-evaluacion/`, {
                        ...evaluacion,
                        plan_evaluacion: planId,
                        objetivo_aprendizaje: evaluacion.objetivoAsociado, // Asocia el item con el objetivo aprendizaje
                    })
                )
            );

            // Redirigir a la sección "Crear Plan"
            navigate('/lagout/crear-plan');
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

                {/* Nombre */}
                <label className="block text-sm font-medium text-[#ececec] mb-1">
                    Nombre del Plan
                </label>
                <Input 
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre del Plan"
                    required
                    className={campoVacio(nombre) && errorCampos ? 'border-red-500' : ''}
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

                {/* Fecha de Modificación */}
                <div>
                    <label className="block text-sm font-medium text-[#ececec] mb-1">
                        Fecha de Modificación
                    </label>
                    <Input
                        type="date"
                        value={fechaModificacion}
                        onChange={(e) => setFechaModificacion(e.target.value)}
                        required
                        className={campoVacio(fechaModificacion) && errorCampos ? 'border-red-500' : ''}
                    />
                </div>

                {/* Título */}
                <label className="block text-sm font-medium text-[#ececec] mb-1">
                    Título del Plan
                </label>
                <Input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Título del Plan"
                    required
                    className={campoVacio(titulo) && errorCampos ? 'border-red-500' : ''}
                />

                {/* Unidad Curricular */}
                <label className="block text-sm font-medium text-[#ececec] mb-1">
                    Unidad Curricular
                </label>
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
                        <option value="FLO">La Floresta</option>
                        <option value="URB">La Urbina</option>
                        <option value="ALT">Altagracia</option>
                        <option value="LGA">La Guaira</option>
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
                        <option value="M">Matutino</option>
                        <option value="V">Vespertino</option>
                        <option value="N">Nocturno</option>
                        
                    </select>
                </div>

                {/* PNF */}
                <label className="block text-sm font-medium text-[#ececec] mb-1">
                    PNF
                </label>
                <Input
                    type="text"
                    value={pnf}
                    onChange={(e) => setPnf(e.target.value)}
                    placeholder="PNF"
                    required
                    className={campoVacio(pnf) && errorCampos ? 'border-red-500' : ''}
                />

                {/* Docente */}
                <label className="block text-sm font-medium text-[#ececec] mb-1">
                    Docente
                </label>
                <Input
                    type="text"
                    value={docente}
                    onChange={(e) => setDocente(e.target.value)}
                    placeholder="Docente"
                    required
                    className={campoVacio(docente) && errorCampos ? 'border-red-500' : ''}
                />
            </div>

            {/* Campos dinámicos */}
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

                            {/* Objetivo Asociado */}
                            <div>
                                <label className="block text-sm font-medium text-[#ececec] mb-1">
                                    Objetivo Asociado
                                </label>
                                {objetivos.length > 0 ? (
                                    <select
                                        value={evaluacion.objetivoAsociado}
                                        onChange={(e) => {
                                            const nuevasEvaluaciones = [...evaluaciones];
                                            nuevasEvaluaciones[index].objetivoAsociado = e.target.value;
                                            setEvaluaciones(nuevasEvaluaciones);
                                        }}
                                        className={`w-full p-2 rounded-md bg-[#3c3c3c] text-[#ececec] focus:outline-none focus:ring-2 focus:ring-[#050a30] ${
                                            campoVacio(evaluacion.objetivoAsociado) && errorCampos ? 'border-red-500' : ''
                                        }`}
                                        required
                                    >
                                        <option value="">Seleccione un objetivo</option>
                                        {objetivos.map((objetivo) => (
                                            <option key={objetivo.id} value={objetivo.id}>
                                                {objetivo.titulo}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-red-500">No hay objetivos disponibles.</p>
                                )}
                            </div>

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
                                    <option value="DI">Diagnóstica</option>
                                    <option value="FO">Formativa</option>
                                    <option value="SU">Sumativa</option>
                                    <option value="AU">Autoevaluación</option>
                                    <option value="CO">Coevaluación</option>
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
                                    <option value="PR">Prueba escrita (objetiva)</option>
                                    <option value="PE">Prueba escrita (ensayo)</option>
                                    <option value="PO">Prueba oral</option>
                                    <option value="TR">Trabajo escrito</option>
                                    <option value="TA">Tarea</option>
                                    <option value="EX">Exposición oral</option>
                                    <option value="PY">Proyecto</option>
                                    <option value="IN">Informe</option>
                                    <option value="PC">Participación en clase</option>
                                    <option value="AC">Actividades colaborativas</option>
                                    <option value="DE">Debate</option>
                                    <option value="SE">Seminario</option>
                                    <option value="CT">Control de lectura</option>
                                    <option value="CV">Cuestionario</option>
                                    <option value="DI">Diario reflexivo</option>
                                    <option value="CA">Carpeta de trabajos</option>
                                    <option value="AU">Autoevaluación</option>
                                    <option value="CO">Coevaluación</option>
                                    <option value="OT">Otras</option>
                                </select>
                            </div>

                            {/* Habilidades a evaluar */}
                            <label className="block text-sm font-medium text-[#ececec] mb-1">
                                Habilidades a Evaluar 
                            </label>
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

                            {/* Ponderación */}
                            <label className="block text-sm font-medium text-[#ececec] mb-1">
                                Peso (Ponderacion)
                            </label>
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

                            {/* Duración (horas) */}
                            <div>
                                <label className="block text-sm font-medium text-[#ececec] mb-1">
                                    Duración (horas)
                                </label>
                                <Input
                                    type="number"
                                    value={evaluacion.duracionHoras}
                                    onChange={(e) => {
                                        const nuevasEvaluaciones = [...evaluaciones];
                                        nuevasEvaluaciones[index].duracionHoras = Number(e.target.value);
                                        setEvaluaciones(nuevasEvaluaciones);
                                    }}
                                    placeholder="Duración (horas)"
                                    required
                                    className={(evaluacion.duracionHoras < 2 || evaluacion.duracionHoras > 9) && errorCampos ? 'border-red-500' : ''}
                                    min={2}
                                    max={9}
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
                    onClick={() => navigate('/lagout/crear-plan')}
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