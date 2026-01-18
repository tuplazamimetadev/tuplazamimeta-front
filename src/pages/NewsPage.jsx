import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    Calendar, Megaphone, PlusCircle, Trash2, Send, ExternalLink
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const NewsPage = () => {
    const navigate = useNavigate();

    // --- ESTADOS ---
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

    const isAdmin = userData.role === 'ADMIN' || userData.role === 'PROFESOR';

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
            <Navbar user={userData} activePage="noticias" />

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