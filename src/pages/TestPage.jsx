import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Menu, X, Bell, Search,
    BookOpen, Crown, LogOut,
    Brain, Newspaper, Play, CheckCircle, Trash2, 
    Signal, AlertCircle, Briefcase // <--- 1. Importar icono
} from 'lucide-react';

import UploadManager from '../components/UploadManager';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const TestsPage = () => {
    const navigate = useNavigate();

    // --- ESTADOS ---
    const [generalTests, setGeneralTests] = useState([]); // Lista de tests reales
    const [uploadTopic, setUploadTopic] = useState([]); // El tema "General" para el dropdown de subida
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const [userData, setUserData] = useState({
        name: 'Cargando...', email: '', role: 'Estudiante', expiration: null
    });

    // --- LOGOUT ---
    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_name');
        navigate('/login');
    };

    // --- CARGAR DATOS ---
    const fetchContents = () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        fetch(`${API_URL}/api/contents`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                // 1. BUSCAR EL TEMA "TESTS GENERALES" (o SIMULACROS)
                const generalTopicObj = data.find(topic =>
                    topic.title.toUpperCase().includes("TESTS GENERALES") ||
                    topic.title.toUpperCase().includes("SIMULACROS")
                );

                if (generalTopicObj) {
                    // Guardamos el tema para pasárselo al UploadManager
                    setUploadTopic([generalTopicObj]);

                    // Filtramos solo los materiales que sean tipo TEST dentro de este tema
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

    // --- BORRAR TEST (Optimistic UI) ---
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
                // Borramos visualmente al instante
                setGeneralTests(prev => prev.filter(t => t.id !== materialId));
                // Resincronizamos por si acaso
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
            .then(data => setUserData(data))
            .catch(() => navigate('/login'));

        fetchContents();
    }, [navigate]);

    const canEdit = userData.role === 'ADMIN' || userData.role === 'PROFESOR';

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
            {/* NAVBAR */}
            <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-xl">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Shield className="h-8 w-8 text-yellow-500" />
                        <div className="flex flex-col">
                            <span className="text-lg font-bold tracking-wider uppercase leading-none">AULA VIRTUAL</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Tu Plaza Mi Meta</span>
                        </div>
                    </div>

                    {/* MENU CENTRAL */}
                    <div className="hidden md:flex space-x-1 items-center bg-slate-800/50 p-1 rounded-lg border border-slate-700">
                        <button onClick={() => navigate('/descargas')} className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                            <BookOpen className="h-4 w-4 mr-2" /> Temario
                        </button>
                        
                        {/* ACTIVO */}
                        <button className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm">
                            <Brain className="h-4 w-4 mr-2" /> Ponte a prueba
                        </button>

                        {/* --- 2. BOTÓN AÑADIDO --- */}
                        <button onClick={() => navigate('/supuestos')} className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                            <Briefcase className="h-4 w-4 mr-2"/> Supuestos
                        </button>

                        <button onClick={() => navigate('/noticias')} className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                            <Newspaper className="h-4 w-4 mr-2" /> Noticias
                        </button>
                        <div className="w-px h-6 bg-slate-700 mx-2"></div>
                        <button onClick={() => navigate('/suscripcion')} className="px-4 py-2 rounded-md bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-slate-900 font-bold text-sm transition flex items-center">
                            <Crown className="h-3 w-3 mr-1.5" /> Mi Plan
                        </button>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input type="text" placeholder="Buscar..." className="bg-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-white w-32 focus:w-48 transition-all" /></div>
                        <button className="relative p-2 text-slate-400 hover:text-white"><Bell className="h-6 w-6" /></button>
                        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full pl-2 pr-4 py-1 transition">
                            <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg uppercase">{userData.name ? userData.name.charAt(0) : 'U'}</div>
                            <span className="text-sm font-medium max-w-[100px] truncate">{userData.name}</span>
                        </button>
                    </div>
                    <div className="md:hidden"><button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button></div>
                </div>
            </nav>

            {/* MODAL PERFIL */}
            {isProfileOpen && (
                <div className="fixed inset-0 z-[60]" onClick={() => setIsProfileOpen(false)}>
                    <div className="absolute top-20 right-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6" onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className="h-16 w-16 bg-slate-900 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-2">{userData.name?.charAt(0)}</div>
                            <h3 className="font-bold">{userData.name}</h3>
                            <p className="text-xs text-slate-500">{userData.email}</p>
                        </div>
                        <button onClick={handleLogout} className="w-full bg-red-50 text-red-500 py-2 rounded-lg font-bold text-sm hover:bg-red-100 flex items-center justify-center">
                            <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}

            {/* CONTENIDO PRINCIPAL */}
            <div className="container mx-auto px-6 py-12">
                <div className="animate-fade-in-up">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold text-slate-900">Zona de Entrenamiento 🧠</h1>
                        <p className="text-slate-600 mt-2 max-w-2xl mx-auto">Selecciona un examen y ponte a prueba.</p>
                    </div>

                    {/* ZONA DE SUBIDA: Solo visible si existe el tema "TESTS GENERALES" */}
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
                            // Aviso para el admin si no ha creado el tema
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

                    {/* GRID DE TESTS REALES */}
                    {!loading && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {generalTests.map((test) => (
                                <article key={test.id} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative group">

                                    {/* CABECERA CON GRADIENTE */}
                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 flex justify-between items-start text-white">
                                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                            <Brain className="h-8 w-8 text-white" />
                                        </div>
                                        <span className="bg-black/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Simulacro</span>
                                    </div>

                                    {/* CUERPO CON DESCRIPCIÓN */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">{test.title}</h3>

                                        {/* DESCRIPCIÓN DINÁMICA: Si es null muestra texto por defecto */}
                                        <p className="text-slate-500 mb-6 flex-grow text-sm">
                                            {test.description || "Examen oficial tipo test. Haz clic en 'Empezar' para descargar o ver el PDF."}
                                        </p>

                                        <div className="flex items-center space-x-6 text-sm text-slate-400 mb-6 border-t border-slate-100 pt-4">
                                            <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Oficial</div>
                                            <div className="flex items-center"><Signal className="h-4 w-4 mr-2 text-yellow-500" /> General</div>
                                        </div>

                                        <div className="flex space-x-3">
                                            <a
                                                href={test.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center group"
                                            >
                                                Empezar Test <Play className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                                            </a>

                                            {/* BOTÓN BORRAR */}
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
                            ))}
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