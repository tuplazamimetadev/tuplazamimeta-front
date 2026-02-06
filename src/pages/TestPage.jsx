import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    Brain, Play, CheckCircle, Trash2, Signal, AlertCircle, Shuffle, 
    Scale, Users, Book // Iconos nuevos para los bloques
} from 'lucide-react';

import UploadManager from '../components/UploadManager';
import TestPlayer from '../components/TestPlayer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const TestsPage = () => {
    const navigate = useNavigate();

    // --- CONFIGURACIÓN DE GENERADORES ---
    // Aquí puedes añadir más bloques en el futuro fácilmente
    const generators = [
        { 
            id: 'GENERAL', 
            label: 'Simulacro General', 
            desc: 'Preguntas aleatorias de todo el temario.',
            icon: Shuffle, 
            color: 'from-blue-600 to-indigo-600' 
        },
        { 
            id: 'BLOQUE_A', 
            label: 'Bloque A: Jurídicas', 
            desc: 'Constitución, Derecho Penal, Administrativo...',
            icon: Scale, 
            color: 'from-emerald-600 to-teal-600' 
        },
        { 
            id: 'BLOQUE_B', 
            label: 'Bloque B: Sociología', 
            desc: 'Sociología, Psicología, Técnicas...',
            icon: Users, 
            color: 'from-orange-500 to-red-500' 
        },
        // Puedes añadir Bloque C aquí en el futuro
    ];

    // --- ESTADOS ---
    const [generalTests, setGeneralTests] = useState([]);
    const [uploadTopic, setUploadTopic] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // ESTADOS PARA EL PLAYER
    const [activeTestUrl, setActiveTestUrl] = useState(null);
    const [randomQuestions, setRandomQuestions] = useState(null);

    const [userData, setUserData] = useState({
        name: 'Cargando...', email: '', role: 'Estudiante', expiration: null
    });

    // --- CARGAR TEST ANTIGUOS ---
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

    // --- GENERAR TEST ALEATORIO (ACTUALIZADO) ---
    const startRandomTest = async (category) => {
        // Validar suscripción
        if (userData.role === 'PRUEBA' || userData.role === 'GRATIS') {
            alert("Necesitas una suscripción activa para generar simulacros.");
            navigate('/suscripcion');
            return;
        }

        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        setLoading(true);
        try {
            // Construimos la URL con la categoría si no es GENERAL
            let url = `${API_URL}/api/tests/random?size=20`; // Puedes cambiar 20 por 100 si quieres
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
            console.error("Error connecting to generator:", error);
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
                        <p className="text-slate-600 mt-2 max-w-2xl mx-auto">Elige un modo de entrenamiento o descarga exámenes oficiales.</p>
                    </div>

                    {/* --- NUEVO: SELECTOR DE GENERADORES --- */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Shuffle className="w-5 h-5 text-blue-600"/> Generadores Automáticos
                        </h3>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                            {generators.map((gen) => (
                                <div 
                                    key={gen.id}
                                    onClick={() => startRandomTest(gen.id)}
                                    className={`relative bg-gradient-to-br ${gen.color} rounded-2xl p-6 text-white shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden group`}
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <gen.icon className="w-32 h-32" />
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                                            <gen.icon className="w-6 h-6 text-white"/>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{gen.label}</h3>
                                        <p className="text-white/80 text-sm mb-6 min-h-[40px]">{gen.desc}</p>
                                        
                                        <button className="w-full py-3 bg-white/20 hover:bg-white text-white hover:text-slate-900 font-bold rounded-lg transition backdrop-blur-sm flex items-center justify-center gap-2">
                                            <Play className="w-4 h-4 fill-current"/> Comenzar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- ZONA DE TESTS ANTIGUOS --- */}
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

                    {loading && <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div><p className="text-slate-500">Cargando...</p></div>}

                    {!loading && generalTests.length > 0 && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {generalTests.map((test) => {
                                const isInteractive = test.url && test.url.toLowerCase().endsWith('.json');
                                return (
                                    <article key={test.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col group">
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

export default TestsPage;