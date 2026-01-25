import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    Brain, Play, CheckCircle, Trash2, Signal, AlertCircle
} from 'lucide-react';

import UploadManager from '../components/UploadManager';
// 1. IMPORTAR EL PLAYER
import TestPlayer from '../components/TestPlayer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const TestsPage = () => {
    const navigate = useNavigate();

    // --- ESTADOS ---
    const [generalTests, setGeneralTests] = useState([]);
    const [uploadTopic, setUploadTopic] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 2. ESTADO PARA EL TEST ACTIVO
    const [activeTestUrl, setActiveTestUrl] = useState(null);

    const [userData, setUserData] = useState({
        name: 'Cargando...', email: '', role: 'Estudiante', expiration: null
    });

    // --- CARGAR DATOS ---
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

    // --- BORRAR TEST ---
    const handleDeleteTest = async (e, materialId) => {
        e.preventDefault();
        e.stopPropagation();

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
            } else {
                alert("Error al borrar el test.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (!token) { navigate('/login'); return; }

        fetch(`${API_URL}/api/users/me`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                setUserData(data);
                if (data.role === 'SUPUESTOS') {
                    navigate('/noticias');
                }
            })
            .catch(() => navigate('/login'));

        fetchContents();
    }, [navigate]);

    const canEdit = userData.role === 'ADMIN' || userData.role === 'PROFESOR';

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
            <Navbar user={userData} activePage="tests" />

            {/* 3. RENDERIZAR EL PLAYER SI HAY UNO ACTIVO */}
            {activeTestUrl && (
                <TestPlayer 
                    fileUrl={activeTestUrl} 
                    onClose={() => setActiveTestUrl(null)} 
                />
            )}

            <div className="container mx-auto px-6 py-12">
                <div className="animate-fade-in-up">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold text-slate-900">Zona de Entrenamiento 🧠</h1>
                        <p className="text-slate-600 mt-2 max-w-2xl mx-auto">Selecciona un examen y ponte a prueba.</p>
                    </div>

                    <div className="max-w-4xl mx-auto mb-12">
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
                                        Atención Admin: Para subir simulacros aquí, crea un tema llamado "TESTS GENERALES" en la base de datos.
                                    </p>
                                </div>
                            )
                        )}
                    </div>

                    {loading && <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div><p className="text-slate-500">Cargando simulacros...</p></div>}

                    {!loading && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {generalTests.map((test) => {
                                // 4. DETECTAR SI ES INTERACTIVO
                                const isInteractive = test.url && test.url.toLowerCase().endsWith('.json');

                                return (
                                    <article key={test.id} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative group">
                                        <div className={`p-6 flex justify-between items-start text-white ${isInteractive ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-slate-700 to-slate-900'}`}>
                                            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                                <Brain className="h-8 w-8 text-white" />
                                            </div>
                                            <span className="bg-black/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                                {isInteractive ? 'Interactivo' : 'PDF / Simulacro'}
                                            </span>
                                        </div>

                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-2xl font-bold text-slate-800 mb-2">{test.title}</h3>
                                            <p className="text-slate-500 mb-6 flex-grow text-sm">
                                                {test.description || (isInteractive ? "Pon a prueba tus conocimientos con corrección automática." : "Examen oficial en PDF para descargar.")}
                                            </p>

                                            <div className="flex items-center space-x-6 text-sm text-slate-400 mb-6 border-t border-slate-100 pt-4">
                                                <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Oficial</div>
                                                <div className="flex items-center"><Signal className="h-4 w-4 mr-2 text-yellow-500" /> General</div>
                                            </div>

                                            <div className="flex space-x-3">
                                                {/* 5. BOTÓN CONDICIONAL */}
                                                {isInteractive ? (
                                                    <button
                                                        onClick={() => setActiveTestUrl(test.url)}
                                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center group"
                                                    >
                                                        Hacer Test <Brain className="h-4 w-4 ml-2 group-hover:scale-110 transition" />
                                                    </button>
                                                ) : (
                                                    <a
                                                        href={test.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center group"
                                                    >
                                                        Descargar PDF <Play className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                                                    </a>
                                                )}

                                                {canEdit && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleDeleteTest(e, test.id)}
                                                        className="bg-red-50 hover:bg-red-100 text-red-500 p-4 rounded-xl transition shadow-sm border border-red-100"
                                                        title="Borrar simulacro"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {!loading && generalTests.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 max-w-2xl mx-auto">
                            <Brain className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-700">No hay simulacros disponibles</h3>
                            <p className="text-slate-500 mt-2">Vuelve más tarde o sube uno nuevo si eres administrador.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestsPage;