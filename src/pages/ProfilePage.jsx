import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    User, Mail, Lock, Save, CreditCard, CheckCircle, AlertCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ProfilePage = () => {
    const navigate = useNavigate();
    
    // Estados de datos
    const [userData, setUserData] = useState({ name: '', email: '', role: '', expiration: '' });
    const [passData, setPassData] = useState({ new: '', confirm: '' });
    
    // Estados de UI
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' }); // type: 'success' | 'error'

    // --- CARGAR DATOS DEL USUARIO ---
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (!token) { navigate('/login'); return; }

        fetch(`${API_URL}/api/users/me`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                setUserData({
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    expiration: data.expiration // Guardamos el string tal cual ("17/02/2026" o "Ilimitado")
                });
            })
            .catch(() => navigate('/login'));
    }, [navigate]);

    // --- GUARDAR CAMBIOS (NOMBRE Y CONTRASEÑA) ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        setMsg({ text: '', type: '' });
        
        // Validación de contraseñas
        if (passData.new && passData.new !== passData.confirm) {
            setMsg({ text: 'Las contraseñas nuevas no coinciden.', type: 'error' });
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('jwt_token');

        try {
            const res = await fetch(`${API_URL}/api/users/me`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ 
                    name: userData.name,
                    password: passData.new || null // Solo enviamos si ha escrito algo
                })
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setUserData(prev => ({ ...prev, name: updatedUser.name })); // Actualizar vista
                setMsg({ text: 'Perfil actualizado correctamente.', type: 'success' });
                setPassData({ new: '', confirm: '' }); // Limpiar campos contraseña
                
                // Actualizar nombre en localStorage si lo usas en otros sitios
                localStorage.setItem('user_name', updatedUser.name);
            } else {
                setMsg({ text: 'Error al actualizar. Inténtalo de nuevo.', type: 'error' });
            }
        } catch (error) {
            console.error(error);
            setMsg({ text: 'Error de conexión con el servidor.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Función auxiliar para mostrar el nombre bonito del rol
    const getRoleDisplayName = (role) => {
        if (role === 'ADMIN' || role === 'PROFESOR') return 'Cuenta Administrador';
        if (role === 'PREMIUM' || role === 'COMPLETO') return 'Opositor Completo';
        if (role === 'TEST') return 'Solo Test';
        if (role === 'SUPUESTOS' || role === 'PRACTICAL') return 'Solo Supuestos';
        return 'Plan Gratuito'; 
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
            <Navbar user={userData} activePage="perfil" />

            <div className="container mx-auto px-6 py-12 max-w-5xl">
                <div className="mb-10 animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <User className="h-8 w-8 text-slate-700" /> Configuración de Cuenta
                    </h1>
                    <p className="text-slate-600 mt-2">Gestiona tus datos personales y seguridad.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 animate-fade-in-up">
                    
                    {/* COLUMNA IZQUIERDA: RESUMEN Y PLAN */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Tarjeta de Perfil */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                            <div className="h-24 w-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg border-4 border-white">
                                {userData.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <h2 className="font-bold text-xl text-slate-800 break-words">{userData.name}</h2>
                            <span className="inline-block bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-bold mt-2 uppercase tracking-wide border border-slate-200">
                                {userData.role || 'Estudiante'}
                            </span>
                        </div>

                        {/* Tarjeta de Suscripción */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                                <CreditCard className="h-4 w-4" /> Tu Suscripción
                            </h3>
                            <div className="mb-4">
                                <p className="text-sm text-slate-500 mb-1">Plan actual:</p>
                                <p className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    {getRoleDisplayName(userData.role)}
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                </p>
                            </div>
                            
                            {userData.expiration && (
                                <div className="mb-6 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                                    {/* CORREGIDO: Usamos la variable directa, sin new Date() */}
                                    Válido hasta: <strong>{userData.expiration}</strong>
                                </div>
                            )}

                            <button 
                                onClick={() => navigate('/suscripcion')}
                                className="w-full py-2.5 border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-xl text-sm font-bold text-slate-600 bg-transparent transition"
                            >
                                Gestionar / Renovar
                            </button>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: FORMULARIO DE EDICIÓN */}
                    <div className="md:col-span-2">
                        <form onSubmit={handleUpdate} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full">
                            
                            {/* Sección Datos */}
                            <div className="mb-8">
                                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                                    <User className="h-5 w-5 text-blue-500" /> Datos Personales
                                </h3>

                                <div className="grid gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nombre Completo</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50 focus:bg-white"
                                            value={userData.name}
                                            onChange={e => setUserData({...userData, name: e.target.value})}
                                            placeholder="Tu nombre y apellidos"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Correo Electrónico</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input 
                                                type="email" 
                                                disabled 
                                                className="w-full p-3 pl-10 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                                                value={userData.email}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" /> El correo no se puede modificar por seguridad.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sección Contraseña */}
                            <div className="mb-8">
                                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                                    <Lock className="h-5 w-5 text-blue-500" /> Seguridad
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nueva Contraseña</label>
                                        <input 
                                            type="password" 
                                            placeholder="••••••••"
                                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                            value={passData.new}
                                            onChange={e => setPassData({...passData, new: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confirmar Contraseña</label>
                                        <input 
                                            type="password" 
                                            placeholder="••••••••"
                                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                            value={passData.confirm}
                                            onChange={e => setPassData({...passData, confirm: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Deja los campos vacíos si no quieres cambiar tu contraseña.</p>
                            </div>

                            {/* Mensajes de Feedback */}
                            {msg.text && (
                                <div className={`p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    {msg.type === 'success' ? <CheckCircle className="h-5 w-5"/> : <AlertCircle className="h-5 w-5"/>}
                                    {msg.text}
                                </div>
                            )}

                            {/* Botón Guardar */}
                            <button 
                                disabled={loading}
                                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition flex items-center justify-center gap-2 shadow-lg shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Guardando cambios...' : <><Save className="h-5 w-5" /> Guardar Perfil</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;