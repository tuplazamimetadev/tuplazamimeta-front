import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Menu, X, Bell, Search,
    BookOpen, Brain, Briefcase, Newspaper, Crown,
    Mail, MessageSquare, Send, CheckCircle, User
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ContactPage = () => {
    const navigate = useNavigate();
    
    // Estados UI
    const [activeTab, setActiveTab] = useState('general'); // 'general' o 'tutoria'
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userData, setUserData] = useState({ name: '', email: '', role: '' });
    
    // Estado Formulario
    const [formData, setFormData] = useState({ subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Cargar Usuario
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
                setTimeout(() => setSuccess(false), 5000);
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

    // Navbar Helpers
    const canSeeTemario = userData.role !== 'SUPUESTOS';
    const canSeeTests = userData.role !== 'SUPUESTOS' && userData.role !== 'PRUEBA';
    const canSeeSupuestos = userData.role !== 'TEST' && userData.role !== 'PRUEBA';

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
            {/* NAVBAR (Igual que en otras páginas) */}
            <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-xl">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Shield className="h-8 w-8 text-yellow-500" />
                        <div className="flex flex-col">
                            <span className="text-lg font-bold tracking-wider uppercase leading-none">AULA VIRTUAL</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Tu Plaza Mi Meta</span>
                        </div>
                    </div>

                    <div className="hidden md:flex space-x-1 items-center bg-slate-800/50 p-1 rounded-lg border border-slate-700">
                        {canSeeTemario && <button onClick={() => navigate('/descargas')} className="px-4 py-2 rounded-md font-bold text-sm text-slate-400 hover:text-white transition"><BookOpen className="h-4 w-4 mr-2"/> Temario</button>}
                        {canSeeTests && <button onClick={() => navigate('/tests')} className="px-4 py-2 rounded-md font-bold text-sm text-slate-400 hover:text-white transition"><Brain className="h-4 w-4 mr-2"/> Tests</button>}
                        {canSeeSupuestos && <button onClick={() => navigate('/supuestos')} className="px-4 py-2 rounded-md font-bold text-sm text-slate-400 hover:text-white transition"><Briefcase className="h-4 w-4 mr-2"/> Supuestos</button>}
                        <button onClick={() => navigate('/noticias')} className="px-4 py-2 rounded-md font-bold text-sm text-slate-400 hover:text-white transition"><Newspaper className="h-4 w-4 mr-2"/> Noticias</button>
                        
                        {/* BOTÓN CONTACTO (ACTIVO) */}
                        <button className="px-4 py-2 rounded-md font-bold text-sm bg-slate-700 text-white shadow-sm flex items-center transition">
                            <Mail className="h-4 w-4 mr-2"/> Contacto
                        </button>

                        <div className="w-px h-6 bg-slate-700 mx-2"></div>
                        <button onClick={() => navigate('/suscripcion')} className="px-4 py-2 rounded-md bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-slate-900 font-bold text-sm transition flex items-center"><Crown className="h-3 w-3 mr-1.5" /> Mi Plan</button>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full pl-2 pr-4 py-1 transition">
                            <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg uppercase">{userData.name ? userData.name.charAt(0) : 'U'}</div>
                        </button>
                    </div>
                    <div className="md:hidden"><button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button></div>
                </div>
            </nav>

            {/* CONTENIDO */}
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900">Centro de Contacto</h1>
                    <p className="text-slate-600 mt-2">¿Dudas con el temario o problemas técnicos? Estamos aquí.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
                    
                    {/* SIDEBAR SELECCIÓN */}
                    <div className="md:w-1/3 bg-slate-50 p-6 border-r border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">¿Qué necesitas?</h3>
                        <div className="space-y-3">
                            <button 
                                onClick={() => { setActiveTab('general'); setSuccess(false); }}
                                className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition ${activeTab === 'general' ? 'bg-white shadow-md text-blue-600 border border-blue-100' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                <div className={`p-2 rounded-lg ${activeTab === 'general' ? 'bg-blue-100' : 'bg-slate-200'}`}><Mail className="h-5 w-5"/></div>
                                <div>
                                    <span className="font-bold block text-sm">Consulta General</span>
                                    <span className="text-xs opacity-70">Problemas, dudas web...</span>
                                </div>
                            </button>

                            <button 
                                onClick={() => { setActiveTab('tutoria'); setSuccess(false); }}
                                className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition ${activeTab === 'tutoria' ? 'bg-white shadow-md text-indigo-600 border border-indigo-100' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                <div className={`p-2 rounded-lg ${activeTab === 'tutoria' ? 'bg-indigo-100' : 'bg-slate-200'}`}><MessageSquare className="h-5 w-5"/></div>
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
                                        onChange={e => setFormData({...formData, subject: e.target.value})}
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
                                        onChange={e => setFormData({...formData, message: e.target.value})}
                                    />
                                </div>

                                <div className="pt-2">
                                    <button 
                                        disabled={loading}
                                        className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition flex items-center justify-center gap-2 ${activeTab === 'general' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
                                    >
                                        {loading ? 'Enviando...' : <><Send className="h-4 w-4"/> Enviar Solicitud</>}
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