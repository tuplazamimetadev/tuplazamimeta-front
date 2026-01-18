import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    Briefcase, FileText, PlusCircle, Trash2, Send, PlayCircle, UploadCloud
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const PracticalCasesPage = () => {
    const navigate = useNavigate();

    // --- ESTADOS ---
    const [userData, setUserData] = useState({ name: 'Cargando...', email: '', role: '', expiration: '' });

    // Estados de Contenido
    const [casesList, setCasesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Estado del Formulario
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [selectedFile, setSelectedFile] = useState(null);

    // --- CARGAR DATOS ---
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (!token) { navigate('/login'); return; }

        fetch(`${API_URL}/api/users/me`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                setUserData({ name: data.name, email: data.email, role: data.role, expiration: data.expiration });
                if (data.role === 'TEST' || data.role === 'PRUEBA') {
                    navigate('/noticias');
                }
            })
            .catch(() => navigate('/login'));

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

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);

        if (selectedFile) {
            data.append('file', selectedFile);
        } else {
            alert("Por favor selecciona un archivo PDF o Vídeo.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/practical-cases`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            if (res.ok) {
                setFormData({ title: '', description: '' });
                setSelectedFile(null);
                setShowForm(false);
                fetchCases();
            } else {
                alert("Error al subir el supuesto.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión al subir.");
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

    const isAdmin = userData.role === 'ADMIN' || userData.role === 'PROFESOR';

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
            <Navbar user={userData} activePage="supuestos" />

            <div className="container mx-auto px-6 py-12">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
                            <Briefcase className="h-8 w-8 text-indigo-600" /> Supuestos Prácticos
                        </h1>
                        <p className="text-slate-600 mt-2">Casos reales y profesionales para preparar la segunda prueba.</p>

                        {isAdmin && (
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 mx-auto transition shadow-lg shadow-indigo-200"
                            >
                                <PlusCircle className="h-5 w-5" /> {showForm ? 'Cancelar' : 'Nuevo Supuesto'}
                            </button>
                        )}
                    </div>

                    {showForm && (
                        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl mb-12 border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                                <Send className="h-5 w-5 text-indigo-500" /> Crear Caso Práctico
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Título</label>
                                    <input
                                        type="text" required placeholder="Ej: Intervención en vía pública"
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none mt-1"
                                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Descripción</label>
                                    <textarea
                                        required rows="4" placeholder="Planteamiento breve..."
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none mt-1"
                                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 text-center hover:bg-indigo-50 transition cursor-pointer relative">
                                    <input
                                        type="file"
                                        required
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                    />
                                    <div className="flex flex-col items-center justify-center text-indigo-500">
                                        <UploadCloud className="h-8 w-8 mb-2" />
                                        <span className="font-bold text-sm">
                                            {selectedFile ? selectedFile.name : "Haz clic para subir PDF o Vídeo"}
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg flex justify-center items-center">
                                    {selectedFile ? 'Subir y Publicar' : 'Selecciona un archivo'}
                                </button>
                            </form>
                        </div>
                    )}

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

                                    <a
                                        href={item.url} target="_blank" rel="noopener noreferrer"
                                        className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                                    >
                                        <PlayCircle className="h-5 w-5" /> Resolver Caso
                                    </a>
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