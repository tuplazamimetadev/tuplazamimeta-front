import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, ArrowLeft, Mail, MessageSquare, User, Calendar, Reply
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const AdminMessagesPage = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (!token) { navigate('/login'); return; }

        // Verificar rol ADMIN (Seguridad Frontend)
        fetch(`${API_URL}/api/users/me`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(user => {
                if (user.role !== 'ADMIN' && user.role !== 'PROFESOR') {
                    alert("Acceso denegado");
                    navigate('/');
                }
            });

        // Cargar Mensajes
        fetch(`${API_URL}/api/contact`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                setMessages(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [navigate]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
            {/* Navbar Simple */}
            <nav className="bg-slate-900 text-white p-4 shadow-xl sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="h-8 w-8 text-yellow-500" />
                        <span className="font-bold text-lg">PANEL PROFESOR</span>
                    </div>
                    <button onClick={() => navigate('/')} className="text-sm text-slate-300 hover:text-white flex items-center gap-1">
                        <ArrowLeft className="h-4 w-4" /> Volver a la Web
                    </button>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Mail className="h-8 w-8 text-blue-600" /> Buzón de Entrada
                    </h1>
                    <p className="text-slate-600 mt-2">Gestiona las solicitudes de tutoría y dudas de los alumnos.</p>
                </div>

                {loading ? (
                    <div className="text-center py-20">Cargando mensajes...</div>
                ) : (
                    <div className="grid gap-6">
                        {messages.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                                <p className="text-slate-400">No tienes mensajes pendientes.</p>
                            </div>
                        )}

                        {messages.map((msg) => (
                            <div key={msg.id} className={`bg-white p-6 rounded-xl shadow-sm border border-l-4 transition hover:shadow-md ${msg.type === 'TUTORIA' ? 'border-l-indigo-500' : 'border-l-blue-500'}`}>
                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                    {/* Cabecera del Mensaje */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${msg.type === 'TUTORIA' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {msg.type === 'TUTORIA' ? 'Solicitud Tutoría' : 'Consulta General'}
                                            </span>
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> {formatDate(msg.sentAt)}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-1">{msg.subject}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                            <User className="h-4 w-4" /> {msg.userName} ({msg.userEmail})
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700 whitespace-pre-wrap">
                                            {msg.message}
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex items-center">
                                        <a 
                                            href={`mailto:${msg.userEmail}?subject=RE: ${msg.subject}&body=Hola ${msg.userName},%0D%0A%0D%0ARecibí tu consulta sobre "${msg.subject}".%0D%0A%0D%0A...`}
                                            className="bg-slate-900 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-lg whitespace-nowrap"
                                        >
                                            <Reply className="h-4 w-4" /> Responder por Email
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMessagesPage;