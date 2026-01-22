import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Menu, X, Bell, Search,
    BookOpen, Brain, Briefcase, Newspaper, Crown, Mail,
    Activity, LogOut, CheckCircle, Calendar, Settings, CreditCard
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Navbar = ({ user, activePage, onSearch }) => {
    const navigate = useNavigate();
    
    // --- ESTADOS DE UI ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    // --- ESTADOS DE DATOS ---
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    // --- LÓGICA DE PERMISOS ---
    const canEdit = user.role === 'ADMIN' || user.role === 'PROFESOR';
    const canSeeTemario = user.role !== 'SUPUESTOS';
    const canSeeTests = user.role !== 'SUPUESTOS' && user.role !== 'PRUEBA';
    const canSeeSupuestos = user.role === 'ADMIN' || user.role === 'COMPLETO' || user.role === 'SUPUESTOS';

    // --- 1. CARGAR NOTIFICACIONES ---
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            fetch(`${API_URL}/api/notifications`, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => res.ok ? res.json() : [])
                .then(data => {
                    setNotifications(data);
                    setUnreadCount(data.filter(n => !n.read).length);
                })
                .catch(err => console.error("Error cargando notificaciones", err));
        }
    }, [user]);

    // --- 2. MANEJAR BÚSQUEDA ---
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (onSearch) {
            onSearch(term);
        }
    };

    // --- 3. MARCAR NOTIFICACIÓN LEÍDA ---
    const markAsRead = async (id) => {
        const token = localStorage.getItem('jwt_token');
        
        const updatedNotifs = notifications.map(n => n.id === id ? { ...n, read: true } : n);
        setNotifications(updatedNotifs);
        setUnreadCount(updatedNotifs.filter(n => !n.read).length);

        try {
            await fetch(`${API_URL}/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error al marcar como leída", error);
        }
    };

    // --- LOGOUT ---
    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_name');
        navigate('/login');
    };

    // --- ESTILOS DE BOTÓN ---
    const getButtonClass = (pageName) => {
        const baseClass = "px-4 py-2 rounded-md font-bold text-sm transition flex items-center";
        if (activePage === pageName) {
            return `${baseClass} bg-slate-700 text-white shadow-sm`;
        }
        return `${baseClass} text-slate-400 hover:text-white`;
    };

    const getPlanButtonClass = () => {
        if (activePage === 'suscripcion') {
            return "px-4 py-2 rounded-md bg-yellow-500 text-slate-900 font-bold text-sm transition flex items-center shadow-sm";
        }
        return "px-4 py-2 rounded-md bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-slate-900 font-bold text-sm transition flex items-center";
    };

    // --- CORRECCIÓN: Eliminada función formatDate() ---
    // El backend ya envía el string formateado ("17/02/2026" o "Ilimitado")

    return (
        <>
            <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-xl">
                <div className="container mx-auto flex justify-between items-center">
                    {/* LOGO */}
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Shield className="h-8 w-8 text-yellow-500" />
                        <div className="flex flex-col">
                            <span className="text-lg font-bold tracking-wider uppercase leading-none">AULA VIRTUAL</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Tu Plaza Mi Meta</span>
                        </div>
                    </div>

                    {/* MENÚ CENTRAL (DESKTOP) */}
                    <div className="hidden md:flex space-x-1 items-center bg-slate-800/50 p-1 rounded-lg border border-slate-700">
                        {canSeeTemario && (
                            <button onClick={() => navigate('/descargas')} className={getButtonClass('temario')}>
                                <BookOpen className="h-4 w-4 mr-2"/> Temario
                            </button>
                        )}
                        {canSeeTests && (
                            <button onClick={() => navigate('/tests')} className={getButtonClass('tests')}>
                                <Brain className="h-4 w-4 mr-2"/> Tests
                            </button>
                        )}
                        {canSeeSupuestos && (
                            <button onClick={() => navigate('/supuestos')} className={getButtonClass('supuestos')}>
                                <Briefcase className="h-4 w-4 mr-2"/> Supuestos
                            </button>
                        )}
                        <button onClick={() => navigate('/fisicas')} className={getButtonClass('fisicas')}>
                            <Activity className="h-4 w-4 mr-2"/> Físicas
                        </button>
                        <button onClick={() => navigate('/noticias')} className={getButtonClass('noticias')}>
                            <Newspaper className="h-4 w-4 mr-2"/> Noticias
                        </button>
                        <button onClick={() => navigate('/contacto')} className={getButtonClass('contacto')}>
                            <Mail className="h-4 w-4 mr-2"/> Contacto
                        </button>

                        <div className="w-px h-6 bg-slate-700 mx-2"></div>
                        
                        <button onClick={() => navigate('/suscripcion')} className={getPlanButtonClass()}>
                            <Crown className="h-3 w-3 mr-1.5" /> Mi Plan
                        </button>
                    </div>

                    {/* ÁREA DE USUARIO (DERECHA) */}
                    <div className="hidden md:flex items-center space-x-4">
                        
                        {/* 1. BUSCADOR INTELIGENTE */}
                        <div className="relative hidden lg:block group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-400 transition" />
                            <input 
                                type="text" 
                                placeholder="Buscar..." 
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="bg-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-white w-32 focus:w-64 transition-all outline-none focus:ring-2 focus:ring-blue-500/50 border border-transparent focus:border-blue-500" 
                            />
                        </div>
                        
                        {canEdit && (
                            <button onClick={() => navigate('/admin/mensajes')} className="relative p-2 text-slate-400 hover:text-white transition group" title="Buzón Profesor">
                                <Mail className="h-6 w-6 group-hover:text-yellow-400 transition" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></span>
                            </button>
                        )}

                        {/* 2. CAMPANA DE NOTIFICACIONES */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsNotifOpen(!isNotifOpen)} 
                                className="relative p-2 text-slate-400 hover:text-white transition rounded-full hover:bg-slate-800"
                            >
                                <Bell className="h-6 w-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse ring-2 ring-slate-900"></span>
                                )}
                            </button>

                            {/* DROPDOWN NOTIFICACIONES */}
                            {isNotifOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                                    <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="bg-slate-50 p-3 border-b border-slate-100 flex justify-between items-center">
                                            <span className="font-bold text-slate-700 text-sm">Notificaciones</span>
                                            {unreadCount > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} nuevas</span>}
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-6 text-center text-slate-400 text-sm">No tienes notificaciones pendientes.</div>
                                            ) : (
                                                notifications.map(notif => (
                                                    <div 
                                                        key={notif.id} 
                                                        className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer ${notif.read ? 'opacity-50 grayscale' : 'bg-blue-50/40'}`}
                                                        onClick={() => markAsRead(notif.id)}
                                                    >
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h4 className="text-sm font-bold text-slate-800">{notif.title}</h4>
                                                            {!notif.read && <div className="h-2 w-2 bg-blue-500 rounded-full mt-1"></div>}
                                                        </div>
                                                        <p className="text-xs text-slate-600 line-clamp-2">{notif.message}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full pl-2 pr-4 py-1 transition">
                            <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg uppercase">
                                {user.name ? user.name.charAt(0) : 'U'}
                            </div>
                            <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                        </button>
                    </div>

                    {/* BOTÓN MÓVIL (HAMBURGUESA) */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300 hover:text-white p-2">
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* MENÚ MÓVIL DESPLEGABLE */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-slate-700 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-2">
                            {canSeeTemario && (
                                <button onClick={() => navigate('/descargas')} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold flex items-center transition">
                                    <BookOpen className="h-5 w-5 mr-3 text-blue-500"/> Temario
                                </button>
                            )}
                            {canSeeTests && (
                                <button onClick={() => navigate('/tests')} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold flex items-center transition">
                                    <Brain className="h-5 w-5 mr-3 text-purple-500"/> Tests
                                </button>
                            )}
                            {canSeeSupuestos && (
                                <button onClick={() => navigate('/supuestos')} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold flex items-center transition">
                                    <Briefcase className="h-5 w-5 mr-3 text-indigo-500"/> Supuestos
                                </button>
                            )}
                            <button onClick={() => navigate('/fisicas')} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold flex items-center transition">
                                <Activity className="h-5 w-5 mr-3 text-orange-500"/> Físicas
                            </button>
                            <button onClick={() => navigate('/noticias')} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold flex items-center transition">
                                <Newspaper className="h-5 w-5 mr-3 text-green-500"/> Noticias
                            </button>
                            <button onClick={() => navigate('/contacto')} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold flex items-center transition">
                                <Mail className="h-5 w-5 mr-3 text-pink-500"/> Contacto
                            </button>
                            <button onClick={() => navigate('/suscripcion')} className="w-full text-left px-4 py-3 rounded-xl bg-yellow-500/10 hover:bg-yellow-500 hover:text-slate-900 text-yellow-400 font-bold flex items-center transition mt-2">
                                <Crown className="h-5 w-5 mr-3"/> Mi Plan
                            </button>
                            
                            <div className="border-t border-slate-700 mt-2 pt-4">
                                <div className="flex items-center px-4 mb-4">
                                    <div className="h-10 w-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg mr-3">
                                        {user.name ? user.name.charAt(0) : 'U'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{user.name}</p>
                                        <p className="text-xs text-slate-400">{user.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => navigate('/perfil')} className="w-full text-left px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 font-bold flex items-center transition">
                                    <Settings className="h-5 w-5 mr-3"/> Configuración
                                </button>
                                <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-slate-800 font-bold flex items-center transition">
                                    <LogOut className="h-5 w-5 mr-3"/> Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* 3. MODAL PERFIL CON REDIRECCIONES */}
            {isProfileOpen && (
                <div className="fixed inset-0 z-[60]" onClick={() => setIsProfileOpen(false)}>
                    <div className="absolute top-20 right-4 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
                        <div className="bg-slate-900 p-6 text-center relative">
                            <div className="h-20 w-20 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-slate-800 mb-3">
                                {user.name?.charAt(0)}
                            </div>
                            <h3 className="font-bold text-white text-xl">{user.name}</h3>
                            <p className="text-slate-400 text-sm mb-3">{user.email}</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 uppercase tracking-wide">
                                <Crown className="w-3 h-3 mr-1" /> {user.role}
                            </span>
                        </div>
                        <div className="p-6 space-y-6">
                            <div 
                                className="bg-slate-50 rounded-xl p-4 border border-slate-100 cursor-pointer hover:border-blue-300 transition group"
                                onClick={() => navigate('/suscripcion')} 
                            >
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex justify-between">
                                    Tu Suscripción
                                    <span className="text-blue-500 opacity-0 group-hover:opacity-100 text-[10px] transition">Gestionar</span>
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Estado:</span>
                                        <span className="font-bold text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Activa</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Válida hasta:</span>
                                        {/* CORRECCIÓN AQUÍ: Mostrar string directo */}
                                        <span className="font-bold text-slate-800 flex items-center">
                                            <Calendar className="w-3 h-3 mr-1 text-slate-400"/> {user.expiration || 'Indefinido'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ul className="space-y-1">
                                <li>
                                    <button 
                                        onClick={() => navigate('/perfil')} 
                                        className="w-full flex items-center px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition text-sm"
                                    >
                                        <Settings className="h-4 w-4 mr-3" /> Configuración
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => navigate('/suscripcion')} 
                                        className="w-full flex items-center px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition text-sm"
                                    >
                                        <CreditCard className="h-4 w-4 mr-3" /> Facturación
                                    </button>
                                </li>
                            </ul>
                            <div className="bg-slate-50 p-4 border-t border-slate-100">
                                <button onClick={handleLogout} className="w-full flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 py-2 rounded-lg font-bold text-sm transition">
                                    <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;