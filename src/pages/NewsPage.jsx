import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Menu, X, Bell, Search,
    BookOpen, Brain, Settings, CreditCard, Crown, LogOut,
    Newspaper, Calendar, Megaphone, ArrowRight
} from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const NewsPage = () => {
    const navigate = useNavigate();

    // --- ESTADOS ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userData, setUserData] = useState({ name: 'Cargando...', email: '', role: '', expiration: '' });

    // --- DATOS: NOTICIAS ---
    const newsData = [
        {
            id: 1,
            title: "Publicada la Oferta de Empleo Público 2026",
            date: "10 Ene 2026",
            category: "Convocatoria",
            type: "urgent", 
            summary: "El BOCYL ha publicado hoy la aprobación de 145 plazas unificadas para Policía Local en Castilla y León. El plazo de instancias abrirá en febrero.",
        },
        {
            id: 2,
            title: "Modificación en el cuadro de exclusiones médicas",
            date: "05 Ene 2026",
            category: "Bases",
            type: "update",
            summary: "Se actualizan los requisitos de agudeza visual. Ahora se permite el uso de lentes de contacto en ciertas pruebas.",
        },
        {
            id: 3,
            title: "Fecha confirmada: Pruebas Físicas en Burgos",
            date: "28 Dic 2025",
            category: "Examen",
            type: "info",
            summary: "El tribunal ha fijado el inicio de las pruebas físicas para el día 15 de marzo en las pistas de 'El Plantío'.",
        },
        {
            id: 4,
            title: "Nuevo material añadido: Tema 24 (Urbanismo)",
            date: "20 Dic 2025",
            category: "Temario",
            type: "update",
            summary: "Hemos actualizado el tema de Urbanismo adaptándolo a la nueva Ley del Suelo de CyL.",
        }
    ];

    // --- FETCH USER DATA ---
    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_name');
        navigate('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (!token) { navigate('/login'); return; }

        fetch(`${API_URL}/api/users/me`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => setUserData({ name: data.name, email: data.email, role: data.role, expiration: data.expiration }))
            .catch(() => setUserData(prev => ({ ...prev, name: 'Alumno' })));
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
            {/* NAVBAR UNIFICADA */}
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
                        <button onClick={() => navigate('/descargas')} className="px-4 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                            <BookOpen className="h-4 w-4 mr-2"/> Temario
                        </button>
                        <button onClick={() => navigate('/tests')} className="px-4 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                            <Brain className="h-4 w-4 mr-2"/> Ponte a prueba
                        </button>
                        {/* NOTICIAS ACTIVO */}
                        <button className="px-4 py-2 rounded-md font-bold text-sm transition flex items-center bg-slate-700 text-white shadow-sm">
                            <Newspaper className="h-4 w-4 mr-2"/> Noticias
                        </button>
                        <div className="w-px h-6 bg-slate-700 mx-2"></div>
                        <button onClick={() => navigate('/suscripcion')} className="px-4 py-2 rounded-md bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-slate-900 font-bold text-sm transition flex items-center">
                            <Crown className="h-3 w-3 mr-1.5" /> Mi Plan
                        </button>
                    </div>

                    {/* RIGHT SIDE */}
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
                        <button onClick={handleLogout} className="w-full bg-red-50 text-red-500 py-2 rounded-lg font-bold text-sm hover:bg-red-100">Cerrar Sesión</button>
                    </div>
                </div>
            )}

            {/* CONTENIDO PRINCIPAL: NOTICIAS */}
            <div className="container mx-auto px-6 py-12">
                <div className="animate-fade-in-up max-w-5xl mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
                            <Megaphone className="h-8 w-8 text-blue-600" /> Tablón de Anuncios
                        </h1>
                        <p className="text-slate-600 mt-2">Últimas novedades sobre la oposición en Castilla y León.</p>
                    </div>

                    <div className="space-y-6">
                        {newsData.map((news) => (
                            <article key={news.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 hover:shadow-lg hover:border-blue-300 transition duration-300 relative overflow-hidden group">
                                <div className={`absolute top-0 left-0 bottom-0 w-2 ${
                                    news.type === 'urgent' ? 'bg-red-500' : 
                                    news.type === 'update' ? 'bg-green-500' : 'bg-blue-500'
                                }`}></div>

                                <div className="flex flex-col md:flex-row md:items-start justify-between pl-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                                                    news.type === 'urgent' ? 'bg-red-100 text-red-700' : 
                                                    news.type === 'update' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {news.category}
                                            </span>
                                            <span className="text-sm text-slate-400 flex items-center">
                                                <Calendar className="h-3 w-3 mr-1" /> {news.date}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition">
                                            {news.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed mb-4 md:mb-0">
                                            {news.summary}
                                        </p>
                                    </div>
                                    <div className="md:ml-6 flex items-center self-start md:self-center">
                                        <button className="flex items-center text-blue-600 font-bold text-sm hover:underline">
                                            Leer más <ArrowRight className="h-4 w-4 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsPage;