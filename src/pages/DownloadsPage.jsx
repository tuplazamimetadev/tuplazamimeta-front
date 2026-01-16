import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Menu, X, Bell, Search,
    BookOpen, CheckCircle, Video, FileText, Settings, CreditCard, Crown,
    Link as LinkIcon, File, Play, Download, Lock, LogOut,
    Brain, Newspaper, Calendar, User, Trash2
} from 'lucide-react';

import UploadManager from '../components/UploadManager';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const DownloadsPage = () => {
    const navigate = useNavigate();

    // --- ESTADOS ---
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    // Estado inicial de usuario
    const [userData, setUserData] = useState({ 
        name: 'Cargando...', 
        email: '', 
        role: 'Estudiante', 
        expiration: null 
    });

    // --- LOGOUT ---
    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_name');
        navigate('/login');
    };

    // --- FUNCIÓN PARA CARGAR CONTENIDOS ---
    const fetchContents = () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        fetch(`${API_URL}/api/contents`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : [])
            .then(data => { setContents(data); setLoading(false); })
            .catch(() => setLoading(false));
    };

    // --- FUNCIÓN PARA BORRAR MATERIAL (CORREGIDA CON LOGS) ---
const handleDeleteMaterial = async (e, materialId) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm("¿Estás seguro de que quieres eliminar este material?")) return;
        
        const token = localStorage.getItem('jwt_token');
        
        try {
            const res = await fetch(`${API_URL}/api/materials/${materialId}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (res.ok) {
                console.log("✅ BORRADO EXITOSO (204). ACTUALIZANDO UI...");

                // --- TRUCO: BORRAMOS DEL ESTADO LOCAL INMEDIATAMENTE ---
                setContents(prevContents => {
                    return prevContents.map(topic => {
                        // Si el tema tiene materiales, filtramos el que hemos borrado
                        if (topic.materials) {
                            return {
                                ...topic,
                                materials: topic.materials.filter(m => m.id !== materialId)
                            };
                        }
                        return topic;
                    });
                });

                // Y luego, por si acaso, pedimos la lista al servidor en segundo plano
                // (Si llega tarde no importa, porque ya lo hemos quitado visualmente)
                fetchContents(); 

            } else {
                alert("Error al eliminar");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    };

    // --- EFECTO INICIAL ---
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (!token) { navigate('/login'); return; }

        // 1. Obtener Datos del Usuario
        fetch(`${API_URL}/api/users/me`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                setUserData({ 
                    name: data.name, 
                    email: data.email, 
                    role: data.role || 'Estudiante', 
                    expiration: data.expiration
                });
            })
            .catch(() => setUserData(prev => ({ ...prev, name: 'Alumno', role: 'Sin Plan' })));

        // 2. Cargar Contenidos Iniciales
        fetchContents();
    }, [navigate]);

    // --- HELPERS VISUALES ---
    const getIcon = (type) => {
        // Normalizamos a mayúsculas por si acaso
        const safeType = type ? type.toUpperCase() : 'PDF';
        
        switch (safeType) {
            case 'PDF': return <FileText className="h-6 w-6" />;
            case 'WORD': return <FileText className="h-6 w-6" />; // Soporte Legacy
            case 'VIDEO': return <Video className="h-6 w-6" />;
            case 'TEST': return <CheckCircle className="h-6 w-6" />; // Icono TEST
            case 'LINK': return <LinkIcon className="h-6 w-6" />;
            default: return <File className="h-6 w-6" />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Indefinido';
        return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Determinar si puede editar (ADMIN o PROFESOR)
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
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Tuplazamimeta</span>
                        </div>
                    </div>

                    {/* Menú Central */}
                    <div className="hidden md:flex space-x-1 items-center bg-slate-800/50 p-1 rounded-lg border border-slate-700">
                        <button className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center bg-slate-700 text-white shadow-sm">
                            <BookOpen className="h-4 w-4 mr-2"/> Temario
                        </button>
                        <button onClick={() => navigate('/tests')} className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                            <Brain className="h-4 w-4 mr-2"/> Ponte a prueba
                        </button>
                        <button onClick={() => navigate('/noticias')} className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                            <Newspaper className="h-4 w-4 mr-2"/> Noticias
                        </button>
                        <div className="w-px h-6 bg-slate-700 mx-2"></div>
                        <button onClick={() => navigate('/suscripcion')} className="px-4 py-2 rounded-md bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-slate-900 font-bold text-sm transition flex items-center">
                            <Crown className="h-3 w-3 mr-1.5" /> Mi Plan
                        </button>
                    </div>

                    {/* User Area */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="relative hidden lg:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input type="text" placeholder="Buscar..." className="bg-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-white w-32 focus:w-48 transition-all" /></div>
                        <button className="relative p-2 text-slate-400 hover:text-white"><Bell className="h-6 w-6" /><span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span></button>
                        
                        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full pl-2 pr-4 py-1 transition">
                            <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg uppercase">
                                {userData.name ? userData.name.charAt(0) : 'U'}
                            </div>
                            <span className="text-sm font-medium max-w-[100px] truncate">{userData.name}</span>
                        </button>
                    </div>
                    <div className="md:hidden"><button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button></div>
                </div>
            </nav>

            {/* MODAL PERFIL */}
            {isProfileOpen && (
                <div className="fixed inset-0 z-[60]" onClick={() => setIsProfileOpen(false)}>
                    <div className="absolute top-20 right-4 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
                        <div className="bg-slate-900 p-6 text-center relative">
                            <div className="h-20 w-20 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-slate-800 mb-3">
                                {userData.name?.charAt(0)}
                            </div>
                            <h3 className="font-bold text-white text-xl">{userData.name}</h3>
                            <p className="text-slate-400 text-sm mb-3">{userData.email}</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 uppercase tracking-wide">
                                <Crown className="w-3 h-3 mr-1" /> {userData.role}
                            </span>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tu Suscripción</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Estado:</span>
                                        <span className="font-bold text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Activa</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Válida hasta:</span>
                                        <span className="font-bold text-slate-800 flex items-center">
                                            <Calendar className="w-3 h-3 mr-1 text-slate-400"/> {formatDate(userData.expiration)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Configuración</h4>
                                <ul className="space-y-1">
                                    <li><button className="w-full flex items-center p-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition text-sm"><User className="w-4 h-4 mr-3" /> Editar Perfil</button></li>
                                    <li><button className="w-full flex items-center p-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition text-sm"><CreditCard className="w-4 h-4 mr-3" /> Métodos de Pago</button></li>
                                    <li><button className="w-full flex items-center p-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition text-sm"><Settings className="w-4 h-4 mr-3" /> Preferencias</button></li>
                                </ul>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 border-t border-slate-100">
                            <button onClick={handleLogout} className="w-full flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 py-2 rounded-lg font-bold text-sm transition">
                                <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONTENIDO PRINCIPAL: TEMARIO */}
            <div className="container mx-auto px-6 py-12">
                <div className="mb-10 animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-slate-900">Material Didáctico</h1>
                    <p className="text-slate-600 mt-2">Todo el contenido de tu curso, actualizado al minuto.</p>
                </div>

                <UploadManager 
                    userRole={userData.role} 
                    topics={contents} 
                    onUploadSuccess={fetchContents} 
                />

                {loading && <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div><p className="text-slate-500">Cargando tu temario...</p></div>}
                
                {!loading && (
                    <div className="space-y-10 max-w-6xl mx-auto">
                        {contents.map((topic) => (
                            <div key={topic.id} className="animate-fade-in-up">
                                <div className="flex items-center mb-6 border-b border-slate-200 pb-2">
                                    <div className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold mr-4 text-lg shadow-md">{topic.id}</div>
                                    <div><h2 className="text-xl md:text-2xl font-bold text-slate-800">{topic.title}</h2><p className="text-slate-500 text-sm hidden md:block">{topic.description}</p></div>
                                    {topic.isPremium && <span className="ml-auto bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm"><Lock className="h-3 w-3 mr-1" /> PREMIUM</span>}
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                                    {topic.materials && topic.materials.map((file) => (
                                        <div key={file.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-lg hover:border-blue-200 transition duration-300 transform hover:-translate-y-1 group">
                                            <div className="flex items-center space-x-4 mb-4 sm:mb-0 overflow-hidden">
                                                {/* ICONO COLOREADO SEGÚN TIPO */}
                                                <div className={`p-3 rounded-xl flex-shrink-0 transition group-hover:scale-110 ${
                                                    file.type === 'PDF' ? 'bg-red-50 text-red-600' : 
                                                    file.type === 'VIDEO' ? 'bg-purple-50 text-purple-600' : 
                                                    file.type === 'TEST' ? 'bg-green-50 text-green-600' : 
                                                    file.type === 'WORD' ? 'bg-blue-50 text-blue-600' : 
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {getIcon(file.type)}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-slate-800 text-base truncate pr-2 group-hover:text-blue-700 transition">{file.title}</h3>
                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                                                        <span className="bg-slate-100 px-2 py-0.5 rounded uppercase font-bold tracking-wider text-[10px]">{file.type}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ACCIONES (Botón Bajar + Botón Borrar) */}
                                            <div className="flex items-center space-x-2">
                                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center whitespace-nowrap">
                                                    {file.type === 'VIDEO' || file.type === 'LINK' ? <><Play className="h-4 w-4 mr-2" /> Ver</> : <><Download className="h-4 w-4 mr-2" /> Bajar</>}
                                                </a>
                                                
                                                {/* BOTÓN DE BORRAR */}
                                                {canEdit && (
                                                    <button 
                                                        type="button" 
                                                        onClick={(e) => handleDeleteMaterial(e, file.id)} 
                                                        className="text-red-500 bg-red-50 hover:bg-red-500 hover:text-white p-2.5 rounded-xl transition shadow-sm cursor-pointer"
                                                        title="Eliminar material"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {(!topic.materials || topic.materials.length === 0) && <div className="col-span-2 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-400 italic text-sm">No hay materiales disponibles.</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DownloadsPage;