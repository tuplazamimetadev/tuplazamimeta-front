import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Menu, X, Bell, Search,
    BookOpen, Brain, LogOut, Crown,
    Newspaper, Calendar, Megaphone, ArrowRight, PlusCircle, Trash2, Send, ExternalLink, Briefcase, Mail, Activity
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const NewsPage = () => {
    const navigate = useNavigate();

    // --- ESTADOS ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userData, setUserData] = useState({ name: 'Cargando...', email: '', role: '', expiration: '' });

    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', link: '' });

    // --- CARGAR DATOS ---
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (!token) { navigate('/login'); return; }

        fetch(`${API_URL}/api/users/me`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => setUserData({ name: data.name, email: data.email, role: data.role, expiration: data.expiration }))
            .catch(() => setUserData(prev => ({ ...prev, name: 'Alumno' })));

        fetchNews();
    }, [navigate]);

    const fetchNews = async () => {
        const token = localStorage.getItem('jwt_token');
        try {
            const res = await fetch(`${API_URL}/api/news`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNewsList(data);
            }
        } catch (error) {
            console.error("Error al cargar noticias:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt_token');
        try {
            const res = await fetch(`${API_URL}/api/news`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setFormData({ title: '', description: '', link: '' });
                setShowForm(false);
                fetchNews();
            }
        } catch (error) {
            alert("Error al publicar la noticia");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que quieres borrar esta noticia?")) return;
        const token = localStorage.getItem('jwt_token');
        try {
            const res = await fetch(`${API_URL}/api/news/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchNews();
        } catch (error) {
            alert("Error al borrar la noticia");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_name');
        navigate('/login');
    };

    const isAdmin = userData.role === 'ADMIN' || userData.role === 'PROFESOR';

    // --- LÓGICA DE VISIBILIDAD NAVBAR ---
    // SUPUESTOS: No ve Temario ni Tests
    const canSeeTemario = userData.role !== 'SUPUESTOS';
    const canSeeTests = userData.role !== 'SUPUESTOS';
    // TEST: No ve Supuestos
    const canSeeSupuestos = userData.role !== 'TEST';

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
                        {canSeeTemario && (
                            <button onClick={() => navigate('/descargas')} className="px-4 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                                <BookOpen className="h-4 w-4 mr-2" /> Temario
                            </button>
                        )}

                        {canSeeTests && (
                            <button onClick={() => navigate('/tests')} className="px-4 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                                <Brain className="h-4 w-4 mr-2" /> Ponte a prueba
                            </button>
                        )}

                        {canSeeSupuestos && (
                            <button onClick={() => navigate('/supuestos')} className="px-4 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                                <Briefcase className="h-4 w-4 mr-2" /> Supuestos
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/fisicas')}
                            className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white"
                        >
                            <Activity className="h-4 w-4 mr-2" /> Físicas
                        </button>

                        {/* ACTIVO */}
                        <button className="px-4 py-2 rounded-md font-bold text-sm transition flex items-center bg-slate-700 text-white shadow-sm">
                            <Newspaper className="h-4 w-4 mr-2" /> Noticias
                        </button>
                        <button
                            onClick={() => navigate('/contacto')}
                            className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white"
                        >
                            <Mail className="h-4 w-4 mr-2" /> Contacto
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

            {/* CONTENIDO PRINCIPAL */}
            <div className="container mx-auto px-6 py-12">
                <div className="animate-fade-in-up max-w-5xl mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
                            <Megaphone className="h-8 w-8 text-blue-600" /> Tablón de Anuncios
                        </h1>
                        <p className="text-slate-600 mt-2">Últimas novedades sobre la oposición en Castilla y León.</p>

                        {isAdmin && (
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 mx-auto transition shadow-lg shadow-blue-200"
                            >
                                <PlusCircle className="h-5 w-5" /> {showForm ? 'Cancelar' : 'Publicar Noticia'}
                            </button>
                        )}
                    </div>

                    {showForm && (
                        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl mb-12 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                                <Send className="h-5 w-5 text-blue-500" /> Nueva Novedad
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text" required placeholder="Título de la noticia"
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                                <textarea
                                    required rows="4" placeholder="Contenido de la noticia..."
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                                <input
                                    type="url" placeholder="Enlace opcional (https://...)"
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })}
                                />
                                <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition">
                                    Publicar en el Tablón
                                </button>
                            </form>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-20 text-slate-400">Cargando noticias...</div>
                    ) : (
                        <div className="space-y-6">
                            {newsList.map((news) => (
                                <article key={news.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 hover:shadow-lg transition duration-300 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 bottom-0 w-2 bg-blue-500"></div>
                                    <div className="flex flex-col md:flex-row md:items-start justify-between pl-4">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-sm text-slate-400 flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {new Date(news.publishedDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                {isAdmin && (
                                                    <button onClick={() => handleDelete(news.id)} className="text-slate-300 hover:text-red-500 transition">
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition">
                                                {news.title}
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed mb-4 whitespace-pre-wrap">
                                                {news.description}
                                            </p>
                                        </div>
                                        {news.link && (
                                            <div className="md:ml-6 flex items-center self-start md:self-center">
                                                <a
                                                    href={news.link} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center text-blue-600 font-bold text-sm hover:underline bg-blue-50 px-4 py-2 rounded-lg"
                                                >
                                                    Más info <ExternalLink className="h-4 w-4 ml-1.5" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))}
                            {newsList.length === 0 && (
                                <div className="text-center py-20 text-slate-400 italic">No hay noticias publicadas todavía.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsPage;