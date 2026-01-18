import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Menu, X, Bell, Search,
    BookOpen, Brain, Briefcase, Newspaper, Crown, Mail,
    Activity, Timer, Dumbbell, Waves, Footprints, CheckCircle, AlertTriangle, FileText,
    ChevronDown, ChevronUp, Flame, Calendar
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const PhysicalsPage = () => {
    const navigate = useNavigate();
    
    // --- ESTADOS ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userData, setUserData] = useState({ name: 'Cargando...', email: '', role: 'Estudiante', expiration: null });
    
    // Estado para controlar qué plan de entrenamiento está desplegado
    const [expandedPlanId, setExpandedPlanId] = useState(null);

    // --- CARGAR DATOS ---
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (!token) { navigate('/login'); return; }
        
        fetch(`${API_URL}/api/users/me`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setUserData(data))
            .catch(() => navigate('/login'));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_name');
        navigate('/login');
    };

    const togglePlan = (id) => {
        if (expandedPlanId === id) {
            setExpandedPlanId(null);
        } else {
            setExpandedPlanId(id);
        }
    };

    // --- DATOS EXTENDIDOS DE LAS PRUEBAS (Basado en el PDF y Fisiología del Deporte) ---
    const testsData = [
        {
            id: 1,
            title: "Salto de Longitud",
            icon: <Footprints className="h-8 w-8 text-orange-500" />,
            desc: "Potencia tren inferior. Pies juntos.",
            marks: { men: "2,30 m.", women: "1,90 m." }, // [cite: 301]
            rules: [
                "Salida tras línea de 1m x 0,05m[cite: 315].",
                "Pies juntos, sin carrera previa[cite: 294, 316].",
                "Se permite balanceo de talones y elevación antes del salto[cite: 317].",
                "Se mide hasta la huella más cercana a la línea de salida[cite: 318]."
            ],
            training: {
                focus: "Fuerza Explosiva y Técnica de Vuelo",
                phases: [
                    {
                        name: "Fase 1: Fuerza Base (Semanas 1-4)",
                        exercises: [
                            "Sentadilla profunda: 4 series x 8 repeticiones (carga media).",
                            "Peso muerto rumano: 3 series x 10 repeticiones.",
                            "Gemelos en máquina: 4 series x 15 repeticiones."
                        ]
                    },
                    {
                        name: "Fase 2: Potencia (Semanas 5-8)",
                        exercises: [
                            "Saltos al cajón (Box Jumps): 4 series x 6 saltos (máxima altura).",
                            "Sentadilla con salto (carga ligera): 3 series x 8 repeticiones.",
                            "Kettlebell Swings: 3 series x 15 repeticiones (explosivo)."
                        ]
                    },
                    {
                        name: "Fase 3: Específico y Técnica (Semanas 9-12)",
                        exercises: [
                            "Simulacro de salto: 10 saltos midiendo marca. Descanso completo entre saltos.",
                            "Técnica de braceo: Practicar el impulso de brazos coordinado con la cadera.",
                            "Aterrizaje: Practicar caer tirando el cuerpo hacia adelante para no perder cm."
                        ]
                    }
                ],
                tip: "El 30% del salto es el braceo. Lanza los brazos al cielo violentamente al despegar."
            }
        },
        {
            id: 2,
            title: "Balón Medicinal",
            icon: <Dumbbell className="h-8 w-8 text-purple-600" />,
            desc: "Potencia tren superior. Lanzamiento dorsal.",
            marks: { men: "6,25 m. (5 Kg)", women: "6,25 m. (3 Kg)" }, // [cite: 301, 335]
            rules: [
                "Balón de 5 Kg (Hombres) / 3 Kg (Mujeres)[cite: 335].",
                "Lanzamiento con dos manos desde detrás de la cabeza[cite: 337].",
                "No se puede despegar totalmente los pies del suelo (saltar)[cite: 342].",
                "Se permite balanceo de cuerpo y brazos[cite: 338]."
            ],
            training: {
                focus: "Cadena Posterior, Tríceps y Core",
                phases: [
                    {
                        name: "Fase 1: Hipertrofia Funcional (Semanas 1-4)",
                        exercises: [
                            "Press Francés: 3 series x 10 repeticiones.",
                            "Pullover con mancuerna: 4 series x 10 repeticiones (Clave para el movimiento).",
                            "Dominadas o Jalón al pecho: 3 series x 10 repeticiones."
                        ]
                    },
                    {
                        name: "Fase 2: Transferencia (Semanas 5-8)",
                        exercises: [
                            "Lanzamiento de balón contra el suelo (Slam Ball): 3 x 10.",
                            "Extensiones lumbares con carga: 3 x 15.",
                            "Plancha abdominal dinámica: 3 x 45 segundos."
                        ]
                    },
                    {
                        name: "Fase 3: Técnica de Lanzamiento (Semanas 9-12)",
                        exercises: [
                            "Lanzamientos reales midiendo distancia.",
                            "Trabajo de ángulo: Busca lanzar a 45 grados, no en plano.",
                            "Coordinación: Arquear espalda (fase excéntrica) y latigazo (concéntrica) sin levantar talones."
                        ]
                    }
                ],
                tip: "La fuerza nace de los riñones/lumbares, no solo de los brazos. Arquea bien el cuerpo antes de soltar."
            }
        },
        {
            id: 3,
            title: "Velocidad (60 metros)",
            icon: <Timer className="h-8 w-8 text-red-500" />,
            desc: "Pura potencia anaeróbica aláctica.",
            marks: { men: "8\"6", women: "10\"4" }, // [cite: 301, 360]
            rules: [
                "Salida de pie o agachado, sin tacos[cite: 347].",
                "Solo se permite 1 salida nula por corredor. A la segunda, eliminado[cite: 351, 352].",
                "Medición manual con cronómetro[cite: 349]."
            ],
            training: {
                focus: "Reacción, Aceleración y Velocidad Punta",
                phases: [
                    {
                        name: "Fase 1: Fuerza y Técnica (Semanas 1-4)",
                        exercises: [
                            "Sentadillas pesadas: 5 x 5 (fuerza máxima).",
                            "Técnica de carrera: Skipping alto, talones al glúteo, impulsiones.",
                            "Multisaltos horizontales (zancada)."
                        ]
                    },
                    {
                        name: "Fase 2: Aceleración (Semanas 5-8)",
                        exercises: [
                            "Salidas cortas: 10 metros, 20 metros y 30 metros (Descanso total entre ellas).",
                            "Arrastres con trineo o paracaídas (si disponible).",
                            "Cuestas: Series de 40m en pendiente pronunciada."
                        ]
                    },
                    {
                        name: "Fase 3: Velocidad Lanzada (Semanas 9-12)",
                        exercises: [
                            "Series de 60m al 100%.",
                            "Salidas con señal auditiva (palmada/silbato) para entrenar el tiempo de reacción.",
                            "No frenar al llegar: Entrena para correr 70 metros, no 60."
                        ]
                    }
                ],
                tip: "No mires a los lados. Cabeza agachada los primeros 10-15 metros, luego levanta la vista y mantén la frecuencia."
            }
        },
        {
            id: 4,
            title: "Resistencia (1000 metros)",
            icon: <Activity className="h-8 w-8 text-green-600" />,
            desc: "Resistencia mixta (Aeróbica/Anaeróbica).",
            marks: { men: "3'30\"", women: "4'25\"" }, // [cite: 301, 370]
            rules: [
                "Salida de pie o agachado[cite: 363].",
                "Un solo intento[cite: 366].",
                "Segunda salida nula elimina al aspirante[cite: 367]."
            ],
            training: {
                focus: "VO2 Max y Tolerancia al Lactato",
                phases: [
                    {
                        name: "Fase 1: Base Aeróbica (Semanas 1-4)",
                        exercises: [
                            "Rodajes largos (Carrera continua): 40-50 min a ritmo cómodo (Zona 2).",
                            "Fartlek: 30 min alternando 2 min rápido / 2 min lento.",
                            "Fortalecimiento de tobillos y prevención de periostitis."
                        ]
                    },
                    {
                        name: "Fase 2: Series Largas (Semanas 5-8)",
                        exercises: [
                            "Series de 400m: 6-8 repeticiones (Ritmo objetivo de carrera). Rec: 1:30 min.",
                            "Series de 800m: 3-4 repeticiones.",
                            "Ritmo controlado: 20 min a ritmo umbral (incómodo pero sostenible)."
                        ]
                    },
                    {
                        name: "Fase 3: Series Cortas y Ritmo (Semanas 9-12)",
                        exercises: [
                            "Series de 200m: 10 repeticiones (Velocidad superior a carrera). Rec: 45 seg.",
                            "Simulacro de 1000m (cada 2 semanas).",
                            "Estrategia: Aprende a pasar el 400m y el 800m en los tiempos exactos."
                        ]
                    }
                ],
                tip: "La tercera vuelta (metros 600-800) es donde se pierde la prueba. Es mental. Mantén el ritmo ahí y esprinta los últimos 200."
            }
        },
        {
            id: 5,
            title: "Natación (25 metros)",
            icon: <Waves className="h-8 w-8 text-blue-500" />,
            desc: "Velocidad en medio acuático.",
            marks: { men: "21\"", women: "24\"" }, // [cite: 301, 387]
            rules: [
                "Estilo libre[cite: 298, 374].",
                "Salida desde poyete (borde) o desde dentro del agua[cite: 373].",
                "Dos salidas nulas eliminan[cite: 377].",
                "Prohibido apoyarse en corcheras o tocar el fondo[cite: 377]."
            ],
            training: {
                focus: "Técnica, Salida y Batido de Piernas",
                phases: [
                    {
                        name: "Fase 1: Adaptación y Técnica (Semanas 1-4)",
                        exercises: [
                            "Punto muerto: Nadar crol fijándose en el deslizamiento.",
                            "Rolido: Trabajar la rotación del cuerpo.",
                            "Respiración bilateral: Aprender a respirar por ambos lados (aunque en 25m respirarás poco)."
                        ]
                    },
                    {
                        name: "Fase 2: Fuerza Específica (Semanas 5-8)",
                        exercises: [
                            "Series solo piernas (con tabla): 4 x 25m a tope.",
                            "Series solo brazos (con pull-buoy): 4 x 25m.",
                            "Series de velocidad asistida (aletas): Para sentir la hidrodinámica a alta velocidad."
                        ]
                    },
                    {
                        name: "Fase 3: Salidas y Sprints (Semanas 9-12)",
                        exercises: [
                            "Práctica de salida de cabeza: Ganarás 3-4 metros gratis si lo haces bien.",
                            "Apnea: Series de 12,5m sin respirar.",
                            "Series de 25m cronometradas (Sprint total). Intenta respirar máximo 1 o 2 veces."
                        ]
                    }
                ],
                tip: "El salto es el 40% de la prueba en una distancia tan corta. Entra al agua como una flecha, no como una 'bomba'."
            }
        }
    ];

    const canEdit = userData.role === 'ADMIN' || userData.role === 'PROFESOR';
    const canSeeTemario = userData.role !== 'SUPUESTOS'; 
    const canSeeTests = userData.role !== 'SUPUESTOS' && userData.role !== 'PRUEBA';
    const canSeeSupuestos = userData.role === 'ADMIN' || userData.role === 'COMPLETO' || userData.role === 'SUPUESTOS';

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
            
            {/* NAVBAR */}
            <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-xl">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Shield className="h-8 w-8 text-yellow-500" />
                        <div className="flex flex-col">
                            <span className="text-lg font-bold tracking-wider uppercase leading-none">AULA VIRTUAL</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Tuplazamimeta</span>
                        </div>
                    </div>

                    <div className="hidden md:flex space-x-1 items-center bg-slate-800/50 p-1 rounded-lg border border-slate-700">
                        {canSeeTemario && <button onClick={() => navigate('/descargas')} className="px-4 py-2 rounded-md font-bold text-sm text-slate-400 hover:text-white transition"><BookOpen className="h-4 w-4 mr-2"/> Temario</button>}
                        {canSeeTests && <button onClick={() => navigate('/tests')} className="px-4 py-2 rounded-md font-bold text-sm text-slate-400 hover:text-white transition"><Brain className="h-4 w-4 mr-2"/> Tests</button>}
                        {canSeeSupuestos && <button onClick={() => navigate('/supuestos')} className="px-4 py-2 rounded-md font-bold text-sm text-slate-400 hover:text-white transition"><Briefcase className="h-4 w-4 mr-2"/> Supuestos</button>}
                        <button onClick={() => navigate('/noticias')} className="px-4 py-2 rounded-md font-bold text-sm text-slate-400 hover:text-white transition"><Newspaper className="h-4 w-4 mr-2"/> Noticias</button>
                        <button onClick={() => navigate('/contacto')} className="px-4 py-2 rounded-md font-bold text-sm text-slate-400 hover:text-white transition"><Mail className="h-4 w-4 mr-2"/> Contacto</button>
                        
                        {/* ACTIVO */}
                        <button className="px-4 py-2 rounded-md font-bold text-sm bg-slate-700 text-white shadow-sm flex items-center transition">
                            <Activity className="h-4 w-4 mr-2"/> Físicas
                        </button>

                        <div className="w-px h-6 bg-slate-700 mx-2"></div>
                        <button onClick={() => navigate('/suscripcion')} className="px-4 py-2 rounded-md bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-slate-900 font-bold text-sm transition flex items-center"><Crown className="h-3 w-3 mr-1.5" /> Mi Plan</button>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full pl-2 pr-4 py-1 transition">
                            <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg uppercase">{userData.name ? userData.name.charAt(0) : 'U'}</div>
                        </button>
                    </div>
                    <div className="md:hidden"><button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button></div>
                </div>
            </nav>

            {/* PERFIL MODAL */}
            {isProfileOpen && (
                <div className="fixed inset-0 z-[60]" onClick={() => setIsProfileOpen(false)}>
                    <div className="absolute top-20 right-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6" onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className="h-16 w-16 bg-slate-900 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-2">{userData.name?.charAt(0)}</div>
                            <h3 className="font-bold">{userData.name}</h3>
                            <p className="text-xs text-slate-500">{userData.email}</p>
                        </div>
                        <button onClick={handleLogout} className="w-full bg-red-50 text-red-500 py-2 rounded-lg font-bold text-sm hover:bg-red-100">Cerrar Sesión</button>
                    </div>
                </div>
            )}

            {/* CONTENIDO PRINCIPAL */}
            <div className="container mx-auto px-6 py-12 max-w-7xl">
                
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-4xl font-black text-slate-900 flex items-center justify-center gap-3 mb-4">
                        <Activity className="h-10 w-10 text-orange-500" /> Preparación Física
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Planificación profesional para superar las 5 pruebas de la oposición.
                        <br/>
                        <span className="text-sm text-slate-400">Datos basados en BOCYL-D-25092025-29</span>
                    </p>
                </div>

                {/* AVISO CERTIFICADO */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl shadow-sm mb-12 animate-fade-in-up">
                    <div className="flex items-start">
                        <AlertTriangle className="h-6 w-6 text-yellow-600 mr-4 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-yellow-800 text-lg mb-1">Obligatorio: Certificado Médico [cite: 49]</h3>
                            <p className="text-yellow-700 text-sm leading-relaxed">
                                Debes presentar un certificado médico oficial extendido en impreso original y firmado por colegiado en ejercicio. Debe indicar expresamente que reúnes las <strong>"condiciones físicas y sanitarias necesarias"</strong> para realizar las pruebas de la Base 15. Sin esto, serás excluido [cite: 291-292].
                            </p>
                        </div>
                    </div>
                </div>

                {/* LISTA DE PRUEBAS */}
                <div className="space-y-8">
                    {testsData.map((test) => (
                        <div key={test.id} className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition duration-300">
                            
                            {/* CABECERA TARJETA */}
                            <div className="flex flex-col md:flex-row">
                                {/* INFO IZQUIERDA */}
                                <div className="p-8 md:w-1/3 bg-slate-50 border-r border-slate-100 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
                                                {test.icon}
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-800">{test.title}</h3>
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wide mb-6">{test.desc}</p>
                                        
                                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Marcas Mínimas [cite: 301]</h4>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="flex items-center font-bold text-blue-900"><User className="h-3 w-3 mr-2 text-blue-500"/> Hombres</span>
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono font-bold">{test.marks.men}</span>
                                            </div>
                                            <div className="h-px bg-slate-100 my-2"></div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="flex items-center font-bold text-pink-900"><User className="h-3 w-3 mr-2 text-pink-500"/> Mujeres</span>
                                                <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded font-mono font-bold">{test.marks.women}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => togglePlan(test.id)}
                                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition gap-2 ${expandedPlanId === test.id ? 'bg-slate-800 text-white' : 'bg-white border-2 border-slate-800 text-slate-800 hover:bg-slate-50'}`}
                                    >
                                        {expandedPlanId === test.id ? 'Ocultar Plan' : 'Ver Plan de Entrenamiento'}
                                        {expandedPlanId === test.id ? <ChevronUp className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}
                                    </button>
                                </div>

                                {/* REGLAS DERECHA */}
                                <div className="p-8 md:w-2/3">
                                    <h4 className="flex items-center text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
                                        <FileText className="h-4 w-4 mr-2 text-slate-400" /> Reglas de Ejecución (Base 15)
                                    </h4>
                                    <ul className="space-y-3 mb-6">
                                        {test.rules.map((rule, idx) => (
                                            <li key={idx} className="text-sm text-slate-600 flex items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <span className="mr-3 text-red-500 font-bold">•</span> {rule}
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h5 className="text-sm font-bold text-green-800 mb-1">Consejo Pro</h5>
                                            <p className="text-sm text-green-700">{test.training.tip}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PLAN DESPLEGABLE */}
                            {expandedPlanId === test.id && (
                                <div className="bg-slate-900 p-8 text-white animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                                        <Flame className="h-6 w-6 text-orange-500" />
                                        <h3 className="text-xl font-bold">Plan Específico: {test.training.focus}</h3>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {test.training.phases.map((phase, index) => (
                                            <div key={index} className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-slate-500 transition">
                                                <div className="flex items-center gap-2 mb-3 text-yellow-400">
                                                    <Calendar className="h-4 w-4" />
                                                    <h4 className="font-bold text-sm uppercase">{phase.name}</h4>
                                                </div>
                                                <ul className="space-y-3">
                                                    {phase.exercises.map((ex, i) => (
                                                        <li key={i} className="text-sm text-slate-300 flex items-start">
                                                            <span className="mr-2 text-blue-400">▹</span> {ex}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PhysicalsPage;