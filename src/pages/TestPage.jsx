import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    Brain, Play, CheckCircle, Trash2, Signal, AlertCircle, Shuffle, 
    Scale, Users, Book, Shield, Gavel, Map, Car, FileText, Landmark
} from 'lucide-react';

import UploadManager from '../components/UploadManager';
import TestPlayer from '../components/TestPlayer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const TestsPage = () => {
    const navigate = useNavigate();

    // 1. ESTADO PARA NÚMERO DE PREGUNTAS
    const [numQuestions, setNumQuestions] = useState(50); // Por defecto 50

    // 2. CONFIGURACIÓN COMPLETA DE GENERADORES
    const generators = [
        // --- GLOBALES ---
        { id: 'GENERAL', label: 'Simulacro General', desc: 'Mezcla aleatoria de todo el temario.', icon: Shuffle, color: 'from-blue-600 to-indigo-600' },
        
        // --- BLOQUES GRANDES ---
{ 
            id: 'BLOQUE_A', 
            label: 'Bloque A', 
            desc: 'Constitucional, Administrativo, Función Pública y Seguridad Pública.', 
            icon: Scale, 
            color: 'from-emerald-600 to-teal-600' 
        },
        { 
            id: 'BLOQUE_B', 
            label: 'Bloque B', 
            desc: 'Penal Policial, Normativa Autonómica y Tráfico.', 
            icon: Car, // Icono cambiado a coche por el peso de tráfico 
            color: 'from-orange-500 to-red-500' 
        },

        // --- TEMAS ESPECÍFICOS (NUEVOS) ---
        { id: 'CONSTITUCIONAL', label: 'Constitucional', desc: 'Derecho Constitucional y DDHH.', icon: Landmark, color: 'from-slate-600 to-slate-800' },
        { id: 'ADMINISTRATIVO', label: 'Administrativo', desc: 'Derecho Administrativo general.', icon: FileText, color: 'from-cyan-600 to-blue-700' },
        { id: 'FUNCION_PUBLICA', label: 'Función Policial', desc: 'Ética y Deontología policial.', icon: Shield, color: 'from-indigo-500 to-purple-600' },
        { id: 'SEGURIDAD_PUBLICA', label: 'Seguridad Pública', desc: 'LO 4/2015 y seguridad privada.', icon: LockIcon, color: 'from-rose-600 to-pink-600' }, // Usamos LockIcon auxiliar abajo
        { id: 'PENAL', label: 'Derecho Penal', desc: 'Código Penal y procesal.', icon: Gavel, color: 'from-red-600 to-red-800' },
        { id: 'NORMATIVA_AUTONOMICA', label: 'Normativa Autonómica', desc: 'Estatutos y leyes locales.', icon: Map, color: 'from-green-600 to-emerald-700' },
        { id: 'TRAFICO', label: 'Tráfico', desc: 'Seguridad vial y transportes.', icon: Car, color: 'from-yellow-500 to-orange-600' },
    ];

    // --- ESTADOS ---
    const [generalTests, setGeneralTests] = useState([]);
    const [uploadTopic, setUploadTopic] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [activeTestUrl, setActiveTestUrl] = useState(null);
    const [randomQuestions, setRandomQuestions] = useState(null);

    const [userData, setUserData] = useState({
        name: 'Cargando...', email: '', role: 'Estudiante', expiration: null
    });

    const fetchContents = () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        fetch(`${API_URL}/api/contents`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                const generalTopicObj = data.find(topic =>
                    topic.title.toUpperCase().includes("TESTS GENERALES") ||
                    topic.title.toUpperCase().includes("SIMULACROS")
                );

                if (generalTopicObj) {
                    setUploadTopic([generalTopicObj]);
                    const tests = (generalTopicObj.materials || []).filter(m => m.type === 'TEST');
                    setGeneralTests(tests);
                } else {
                    setGeneralTests([]);
                    setUploadTopic([]);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    // 3. GENERAR TEST USANDO EL TAMAÑO SELECCIONADO
    const startRandomTest = async (category) => {
        if (userData.role === 'PRUEBA' || userData.role === 'GRATIS') {
            alert("Necesitas una suscripción activa para generar simulacros.");
            navigate('/suscripcion');
            return;
        }

        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        setLoading(true);
        try {
            // AQUÍ ENVIAMOS EL 'size' QUE ELIGIÓ EL USUARIO
            let url = `${API_URL}/api/tests/random?size=${numQuestions}`;
            
            if (category !== 'GENERAL') {
                url += `&category=${category}`;
            }

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.ok) {
                const questions = await res.json();
                if (questions.length > 0) {
                    setRandomQuestions(questions);
                } else {
                    alert(`No hay suficientes preguntas disponibles para ${category}.`);
                }
            } else {
                alert("Error generando el test. Inténtalo luego.");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTest = async (e, materialId) => {
        e.preventDefault(); e.stopPropagation();
        if (!window.confirm("¿Seguro que quieres eliminar este simulacro?")) return;
        const token = localStorage.getItem('jwt_token');
        try {
            const res = await fetch(`${API_URL}/api/materials/${materialId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                setGeneralTests(prev => prev.filter(t => t.id !== materialId));
                fetchContents();
            } else { alert("Error al borrar."); }
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (!token) { navigate('/login'); return; }

        fetch(`${API_URL}/api/users/me`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                setUserData(data);
                if (data.role === 'SUPUESTOS') navigate('/noticias');
            })
            .catch(() => navigate('/login'));

        fetchContents();
    }, [navigate]);

    const canEdit = userData.role === 'ADMIN' || userData.role === 'PROFESOR';

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
            <Navbar user={userData} activePage="tests" />

            {(activeTestUrl || randomQuestions) && (
                <TestPlayer 
                    fileUrl={activeTestUrl} 
                    directQuestions={randomQuestions}
                    onClose={() => { setActiveTestUrl(null); setRandomQuestions(null); }} 
                />
            )}

            <div className="container mx-auto px-6 py-12">
                <div className="animate-fade-in-up">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold text-slate-900">Zona de Entrenamiento 🧠</h1>
                        <p className="text-slate-600 mt-2 max-w-2xl mx-auto">Configura tu examen y ponte a prueba.</p>
                    </div>

                    <div className="max-w-7xl mx-auto mb-16">
                        
                        {/* HEADER CON SELECTOR DE PREGUNTAS */}
                        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Shuffle className="w-5 h-5 text-blue-600"/> Generadores Automáticos
                            </h3>
                            
                            <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center shadow-sm">
                                <span className="text-xs font-bold text-slate-400 px-3 uppercase tracking-wider">Preguntas:</span>
                                <button 
                                    onClick={() => setNumQuestions(25)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${numQuestions === 25 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    25
                                </button>
                                <button 
                                    onClick={() => setNumQuestions(50)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${numQuestions === 50 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    50
                                </button>
                            </div>
                        </div>
                        
                        {/* GRID DE GENERADORES */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {generators.map((gen) => (
                                <div 
                                    key={gen.id}
                                    onClick={() => startRandomTest(gen.id)}
                                    className={`relative bg-gradient-to-br ${gen.color} rounded-xl p-5 text-white shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden group min-h-[160px] flex flex-col justify-between`}
                                >
                                    <div className="absolute -top-2 -right-2 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <gen.icon className="w-24 h-24" />
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                                <gen.icon className="w-5 h-5 text-white"/>
                                            </div>
                                            <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded font-bold uppercase">{numQuestions} PREG</span>
                                        </div>
                                        <h3 className="text-lg font-bold leading-tight">{gen.label}</h3>
                                        <p className="text-white/80 text-xs mt-1 line-clamp-2">{gen.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ZONA DE TESTS ANTIGUOS */}
                    <div className="max-w-6xl mx-auto mb-8 border-t border-slate-200 pt-12">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-slate-500"/> Simulacros Estáticos (PDF/JSON)
                        </h3>

                        {uploadTopic.length > 0 ? (
                            <UploadManager
                                userRole={userData.role}
                                topics={uploadTopic}
                                fixedType="TEST"
                                fixedTopic={uploadTopic[0]}
                                showDescription={true}
                                onUploadSuccess={fetchContents}
                            />
                        ) : (
                            canEdit && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
                                    <p className="text-sm text-yellow-700 font-bold flex items-center">
                                        <AlertCircle className="h-5 w-5 mr-2" />
                                        Atención Admin: Crea el tema "TESTS GENERALES" para habilitar esta zona.
                                    </p>
                                </div>
                            )
                        )}
                    </div>

                    {!loading && generalTests.length > 0 && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {generalTests.map((test) => {
                                const isInteractive = test.url && test.url.toLowerCase().endsWith('.json');
                                return (
                                    <article key={test.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col group overflow-hidden">
                                        <div className="p-5 flex-grow">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`p-2 rounded-lg ${isInteractive ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                                                    {isInteractive ? <Brain className="w-5 h-5"/> : <Book className="w-5 h-5"/>}
                                                </div>
                                                {canEdit && (
                                                    <button onClick={(e) => handleDeleteTest(e, test.id)} className="text-red-300 hover:text-red-500 transition">
                                                        <Trash2 className="w-4 h-4"/>
                                                    </button>
                                                )}
                                            </div>
                                            <h4 className="font-bold text-slate-800 mb-2 line-clamp-2">{test.title}</h4>
                                            <p className="text-xs text-slate-500 line-clamp-2 mb-4">{test.description || "Sin descripción"}</p>
                                        </div>
                                        <div className="p-4 border-t border-slate-50 bg-slate-50/50 rounded-b-xl">
                                            {isInteractive ? (
                                                <button onClick={() => setActiveTestUrl(test.url)} className="w-full py-2 bg-white border border-purple-200 text-purple-700 font-bold rounded-lg hover:bg-purple-50 transition text-sm">
                                                    Hacer Test
                                                </button>
                                            ) : (
                                                <a href={test.url} target="_blank" rel="noopener noreferrer" className="block w-full py-2 text-center bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-100 transition text-sm">
                                                    Descargar PDF
                                                </a>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Icono auxiliar para Seguridad Pública si no existe en tu versión de Lucide
const LockIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

export default TestsPage;