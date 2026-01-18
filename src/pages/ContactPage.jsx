import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    Mail, MessageSquare, Send, CheckCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ContactPage = () => {
    const navigate = useNavigate();

    // --- ESTADOS ---
    const [activeTab, setActiveTab] = useState('general');
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

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
            <Navbar user={userData} activePage="contacto" />

            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <div className="text-center mb-10 animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-slate-900">Centro de Contacto</h1>
                    <p className="text-slate-600 mt-2">¿Dudas con el temario o problemas técnicos? Estamos aquí.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col md:flex-row animate-fade-in-up">

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