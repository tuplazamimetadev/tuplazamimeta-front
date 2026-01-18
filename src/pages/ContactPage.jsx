import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Menu, X, Bell, Search,
    BookOpen, Brain, Briefcase, Newspaper, Crown, LogOut,
    Mail, MessageSquare, Send, CheckCircle, User, Calendar,Activity // Iconos necesarios
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ContactPage = () => {
    const navigate = useNavigate();

    // --- ESTADOS ---
    const [activeTab, setActiveTab] = useState('general'); // 'general' o 'tutoria'
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userData, setUserData] = useState({ name: 'Cargando...', email: '', role: 'Estudiante', expiration: null });

    // Estado Formulario
    const [formData, setFormData] = useState({ subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // --- CARGAR DATOS ---
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (!token) { navigate('/login'); return; }

        fetch(`${API_URL}/api/users/me`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setUserData(data))
            .catch(() => navigate('/login'));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_name');
        navigate('/login');
    };

    // --- ENVIAR FORMULARIO ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('jwt_token');

        const payload = {
            type: activeTab === 'general' ? 'GENERAL' : 'TUTORIA',
            subject: formData.subject,
            message: formData.message
        };

        try {
            const res = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSuccess(true);
                setFormData({ subject: '', message: '' });
                setTimeout(() => setSuccess(false), 5000); // Reset mensaje éxito tras 5s
            } else {
                alert("Error al enviar el mensaje.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión.");
        } finally {
            setLoading(false);
        }
    };

    // --- LOGICA VISUAL ---
    const canEdit = userData.role === 'ADMIN' || userData.role === 'PROFESOR';

    // Lógica Navbar (Igual que en DownloadsPage)
    const canSeeTemario = userData.role !== 'SUPUESTOS';
    const canSeeTests = userData.role !== 'SUPUESTOS' && userData.role !== 'PRUEBA';
    const canSeeSupuestos = userData.role === 'ADMIN' || userData.role === 'COMPLETO' || userData.role === 'SUPUESTOS';

    const formatDate = (dateString) => {
        if (!dateString) return 'Indefinido';
        return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">

            {/* ==================================================================
                 NAVBAR (COPIA EXACTA DE DOWNLOADSPAGE PARA CONSISTENCIA)
            ================================================================== */}
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

                        {canSeeTemario && (
                            <button onClick={() => navigate('/descargas')} className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                                <BookOpen className="h-4 w-4 mr-2" /> Temario
                            </button>
                        )}

                        {canSeeTests && (
                            <button onClick={() => navigate('/tests')} className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                                <Brain className="h-4 w-4 mr-2" /> Ponte a prueba
                            </button>
                        )}

                        {canSeeSupuestos && (
                            <button onClick={() => navigate('/supuestos')} className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                                <Briefcase className="h-4 w-4 mr-2" /> Supuestos
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/fisicas')}
                            className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white"
                        >
                            <Activity className="h-4 w-4 mr-2" /> Físicas
                        </button>

                        <button onClick={() => navigate('/noticias')} className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white">
                            <Newspaper className="h-4 w-4 mr-2" /> Noticias
                        </button>

                        {/* BOTÓN CONTACTO (ACTIVO AQUÍ) */}
                        <button className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center bg-slate-700 text-white shadow-sm">
                            <Mail className="h-4 w-4 mr-2" /> Contacto
                        </button>

                        <div className="w-px h-6 bg-slate-700 mx-2"></div>

                        <button onClick={() => navigate('/suscripcion')} className="px-4 py-2 rounded-md bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-slate-900 font-bold text-sm transition flex items-center">
                            <Crown className="h-3 w-3 mr-1.5" /> Mi Plan
                        </button>
                    </div>

                    {/* User Area */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="relative hidden lg:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input type="text" placeholder="Buscar..." className="bg-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-white w-32 focus:w-48 transition-all" /></div>

                        {/* BUZÓN DE ADMIN (Solo si es admin) */}
                        {canEdit && (
                            <button
                                onClick={() => navigate('/admin/mensajes')}
                                className="relative p-2 text-slate-400 hover:text-white transition group"
                                title="Buzón Profesor"
                            >
                                <Mail className="h-6 w-6 group-hover:text-yellow-400 transition" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></span>
                            </button>
                        )}

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
                                        <span className="font-bold text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Activa</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Válida hasta:</span>
                                        <span className="font-bold text-slate-800 flex items-center">
                                            <Calendar className="w-3 h-3 mr-1 text-slate-400" /> {formatDate(userData.expiration)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 border-t border-slate-100">
                                <button onClick={handleLogout} className="w-full flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 py-2 rounded-lg font-bold text-sm transition">
                                    <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CONTENIDO PRINCIPAL */}
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <div className="text-center mb-10 animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-slate-900">Centro de Contacto</h1>
                    <p className="text-slate-600 mt-2">¿Dudas con el temario o problemas técnicos? Estamos aquí.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col md:flex-row animate-fade-in-up">

                    {/* SIDEBAR SELECCIÓN */}
                    <div className="md:w-1/3 bg-slate-50 p-6 border-r border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">¿Qué necesitas?</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => { setActiveTab('general'); setSuccess(false); }}
                                className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition ${activeTab === 'general' ? 'bg-white shadow-md text-blue-600 border border-blue-100' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                <div className={`p-2 rounded-lg ${activeTab === 'general' ? 'bg-blue-100' : 'bg-slate-200'}`}><Mail className="h-5 w-5" /></div>
                                <div>
                                    <span className="font-bold block text-sm">Consulta General</span>
                                    <span className="text-xs opacity-70">Problemas, dudas web...</span>
                                </div>
                            </button>

                            <button
                                onClick={() => { setActiveTab('tutoria'); setSuccess(false); }}
                                className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition ${activeTab === 'tutoria' ? 'bg-white shadow-md text-indigo-600 border border-indigo-100' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                <div className={`p-2 rounded-lg ${activeTab === 'tutoria' ? 'bg-indigo-100' : 'bg-slate-200'}`}><MessageSquare className="h-5 w-5" /></div>
                                <div>
                                    <span className="font-bold block text-sm">Pedir Tutoría</span>
                                    <span className="text-xs opacity-70">Dudas sobre temario</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* FORMULARIO */}
                    <div className="md:w-2/3 p-8">
                        {success ? (
                            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                                <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="h-10 w-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800">¡Mensaje Enviado!</h3>
                                <p className="text-slate-500 mt-2">El profesor ha recibido tu solicitud y te contestará por email lo antes posible.</p>
                                <button onClick={() => setSuccess(false)} className="mt-6 text-blue-600 font-bold hover:underline">Enviar otro mensaje</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 mb-1">
                                        {activeTab === 'general' ? 'Mandar un correo al profesor' : 'Solicitar una Tutoría Personal'}
                                    </h2>
                                    <p className="text-sm text-slate-500 mb-6">
                                        {activeTab === 'general'
                                            ? 'Utiliza este formulario para cualquier consulta administrativa o técnica.'
                                            : 'Describe el tema y las dudas. El profesor te contactará para agendar fecha.'}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                                        {activeTab === 'general' ? 'Asunto' : 'Tema a tratar'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder={activeTab === 'general' ? 'Ej: Problema con el login' : 'Ej: Tema 4 - Poder Judicial'}
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                                        {activeTab === 'general' ? 'Mensaje' : 'Breve descripción de la duda'}
                                    </label>
                                    <textarea
                                        required
                                        rows="5"
                                        placeholder={activeTab === 'general' ? 'Escribe tu mensaje aquí...' : 'Tengo dudas específicas sobre...'}
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        disabled={loading}
                                        className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition flex items-center justify-center gap-2 ${activeTab === 'general' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
                                    >
                                        {loading ? 'Enviando...' : <><Send className="h-4 w-4" /> Enviar Solicitud</>}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;