import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Menu, X, Bell, Search,
    BookOpen, Brain, Briefcase, Newspaper, Crown, Mail,
    Activity, LogOut, CheckCircle, Calendar, Settings, CreditCard
} from 'lucide-react';

const Navbar = ({ user, activePage }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // --- LÓGICA DE PERMISOS ---
    const canEdit = user.role === 'ADMIN' || user.role === 'PROFESOR';
    const canSeeTemario = user.role !== 'SUPUESTOS';
    const canSeeTests = user.role !== 'SUPUESTOS' && user.role !== 'PRUEBA';
    const canSeeSupuestos = user.role === 'ADMIN' || user.role === 'COMPLETO' || user.role === 'SUPUESTOS';

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

    const formatDate = (dateString) => {
        if (!dateString) return 'Indefinido';
        return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    };

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
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input type="text" placeholder="Buscar..." className="bg-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-white w-32 focus:w-48 transition-all" />
                        </div>
                        
                        {canEdit && (
                            <button onClick={() => navigate('/admin/mensajes')} className="relative p-2 text-slate-400 hover:text-white transition group" title="Buzón Profesor">
                                <Mail className="h-6 w-6 group-hover:text-yellow-400 transition" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></span>
                            </button>
                        )}

                        <button className="relative p-2 text-slate-400 hover:text-white">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>
                        
                        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full pl-2 pr-4 py-1 transition">
                            <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg uppercase">
                                {user.name ? user.name.charAt(0) : 'U'}
                            </div>
                            <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                        </button>
                    </div>

                    {/* BOTÓN MÓVIL */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
                    </div>
                </div>
            </nav>

            {/* MODAL PERFIL */}
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
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tu Suscripción</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Estado:</span>
                                        <span className="font-bold text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Activa</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Válida hasta:</span>
                                        <span className="font-bold text-slate-800 flex items-center">
                                            <Calendar className="w-3 h-3 mr-1 text-slate-400"/> {formatDate(user.expiration)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ul className="space-y-1">
                                <li><button className="w-full flex items-center px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition text-sm"><Settings className="h-4 w-4 mr-3" /> Configuración</button></li>
                                <li><button className="w-full flex items-center px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition text-sm"><CreditCard className="h-4 w-4 mr-3" /> Facturación</button></li>
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