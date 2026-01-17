import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Menu, X, Bell, Search,
    BookOpen, Brain, Crown, LogOut,
    Briefcase, FileText, CheckCircle, PlusCircle, Trash2, Send, ExternalLink, PlayCircle, Newspaper
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const PracticalCasesPage = () => {
    const navigate = useNavigate();

    // --- ESTADOS ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userData, setUserData] = useState({ name: 'Cargando...', email: '', role: '', expiration: '' });
    
    // Estados de Contenido
    const [casesList, setCasesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', url: '' });

    // --- CARGAR DATOS ---
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (!token) { navigate('/login'); return; }

        // Fetch Usuario
        fetch(`${API_URL}/api/users/me`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => setUserData({ name: data.name, email: data.email, role: data.role, expiration: data.expiration }))
            .catch(() => setUserData(prev => ({ ...prev, name: 'Alumno' })));
        
        fetchCases();
    }, [navigate]);

    const fetchCases = async () => {
        const token = localStorage.getItem('jwt_token');
        try {
            const res = await fetch(`${API_URL}/api/practical-cases`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCasesList(data);
            }
        } catch (error) {
            console.error("Error cargando supuestos:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- CREAR SUPUESTO (ADMIN) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt_token');
        try {
            const res = await fetch(`${API_URL}/api/practical-cases`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setFormData({ title: '', description: '', url: '' });
                setShowForm(false);
                fetchCases();
            }
        } catch (error) {
            alert("Error al crear el supuesto");
        }
    };

    // --- BORRAR SUPUESTO (ADMIN) ---
    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar este supuesto práctico?")) return;
        const token = localStorage.getItem('jwt_token');
        try {
            const res = await fetch(`${API_URL}/api/practical-cases/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchCases();
        } catch (error) {
            alert("Error al borrar");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_name');
        navigate('/login');
    };

    const isAdmin = userData.role === 'ADMIN' || userData.role === 'PROFESOR';
    
    // Verificar si tiene acceso (ADMIN, OPOSITOR COMPLETO o SOLO SUPUESTOS)
    // Nota: Ajusta estos strings según cómo guardes los roles en tu BD ("Solo Supuestos", "Opositor Completo", etc.)
    const hasAccess = isAdmin || userData.role === 'Solo Supuestos' || userData.role === 'Opositor Completo' || userData.role === 'Administrador';

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

                    <div className="hidden md:flex space-x-1 items-center bg-slate-800/50 p-1 rounded-lg border border-slate-700">
                        <button onClick={() => navigate('/descargas')} className="px-4 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                            <BookOpen className="h-4 w-4 mr-2"/> Temario
                        </button>
                        <button onClick={() => navigate('/tests')} className="px-4 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                            <Brain className="h-4 w-4 mr-2"/> Tests
                        </button>
                         {/* Botón Activo */}
                        <button className="px-4 py-2 rounded-md font-bold text-sm transition flex items-center bg-slate-700 text-white shadow-sm">
                            <Briefcase className="h-4 w-4 mr-2"/> Supuestos
                        </button>
                        <button onClick={() => navigate('/noticias')} className="px-4 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                            <Newspaper className="h-4 w-4 mr-2"/> Noticias
                        </button>
                        <div className="w-px h-6 bg-slate-700 mx-2"></div>
                        <button onClick={() => navigate('/suscripcion')} className="px-4 py-2 rounded-md bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-slate-900 font-bold text-sm transition flex items-center">
                            <Crown className="h-3 w-3 mr-1.5" /> Mi Plan
                        </button>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full pl-2 pr-4 py-1 transition">
                            <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg uppercase">{userData.name ? userData.name.charAt(0) : 'U'}</div>
                            <span className="text-sm font-medium max-w-[100px] truncate">{userData.name}</span>
                        </button>
                    </div>
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
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
                            <Briefcase className="h-8 w-8 text-indigo-600" /> Supuestos Prácticos
                        </h1>
                        <p className="text-slate-600 mt-2">Casos reales y guiados para preparar la segunda prueba.</p>
                        
                        {isAdmin && (
                            <button 
                                onClick={() => setShowForm(!showForm)}
                                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 mx-auto transition shadow-lg shadow-indigo-200"
                            >
                                <PlusCircle className="h-5 w-5" /> {showForm ? 'Cancelar' : 'Nuevo Supuesto'}
                            </button>
                        )}
                    </div>

                    {/* FORMULARIO ADMIN */}
                    {showForm && (
                        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl mb-12 border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                                <Send className="h-5 w-5 text-indigo-500" /> Crear Caso Práctico
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input 
                                    type="text" required placeholder="Título del caso (ej: Intervención en vía pública)"
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                />
                                <textarea 
                                    required rows="4" placeholder="Descripción breve del planteamiento..."
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                                <input 
                                    type="url" placeholder="Enlace al PDF o Vídeo (https://...)"
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})}
                                />
                                <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg">
                                    Publicar Caso
                                </button>
                            </form>
                        </div>
                    )}

                    {/* LISTA DE SUPUESTOS */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-slate-400 mt-4">Cargando casos...</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {casesList.map((item) => (
                                <article key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-xl hover:border-indigo-300 transition duration-300 flex flex-col relative group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold uppercase flex items-center gap-2">
                                            <FileText className="h-3 w-3" /> Caso Práctico
                                        </div>
                                        {isAdmin && (
                                            <button onClick={() => handleDelete(item.id)} className="text-slate-300 hover:text-red-500 transition p-1">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition">
                                        {item.title}
                                    </h3>
                                    
                                    <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">
                                        {item.description}
                                    </p>

                                    {/* Botón de Acción (Bloqueado si no tiene plan) */}
                                    {hasAccess ? (
                                        <a 
                                            href={item.url} target="_blank" rel="noopener noreferrer"
                                            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                                        >
                                            <PlayCircle className="h-5 w-5" /> Resolver Caso
                                        </a>
                                    ) : (
                                        <button 
                                            onClick={() => navigate('/suscripcion')}
                                            className="w-full bg-slate-100 text-slate-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-200 hover:text-slate-600 transition"
                                        >
                                            <Crown className="h-4 w-4" /> Disponible en Premium
                                        </button>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}

                    {!loading && casesList.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                            <Briefcase className="h-16 w-16 mx-auto mb-4 text-slate-200" />
                            <p className="text-slate-400 font-medium">No hay supuestos publicados todavía.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PracticalCasesPage;