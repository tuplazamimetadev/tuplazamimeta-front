import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, CheckCircle, Play, Menu, X, ArrowRight, Star, Users, BookOpen, Video, LogIn, User, LogOut, Target, Brain, Award, MessageCircle
} from 'lucide-react';
// Importamos tu logo desde assets
import imagenLogo from '../assets/logo.jpeg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    const navigate = useNavigate();

    // --- DETECTAR USUARIO ---
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        const name = localStorage.getItem('user_name');

        if (token) {
            setIsLoggedIn(true);
            setUserName(name || 'Alumno');
        }
    }, []);

    // --- DETECTAR SCROLL PARA NAVBAR ---
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_name');
        setIsLoggedIn(false);
        setUserName('');
        setIsMenuOpen(false);
        navigate('/');
    };

    // IMAGEN DE FONDO (Debe estar en la carpeta /public)
    const bgImage = "/logopoli.jpg";

    return (
        <div className="font-sans text-slate-800 bg-slate-50 overflow-x-hidden">

            {/* --- NAVBAR MEJORADO --- */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-slate-900/95 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl'
                    : 'bg-transparent pt-8 pb-6'
                }`}>
                <div className="container mx-auto flex justify-between items-center px-6">
                    {/* LOGO NAVBAR */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-yellow-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                            <Shield className="h-10 w-10 text-yellow-500 fill-yellow-500/10 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black tracking-widest uppercase text-white leading-none">
                                TUPLAZA<span className="text-yellow-400">MIMETA</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] group-hover:text-yellow-200 transition-colors">
                                Academia Online
                            </span>
                        </div>
                    </div>

                    {/* MENÚ DESKTOP */}
                    <div className="hidden md:flex items-center gap-10">
                        <div className="flex gap-8 text-base font-bold text-slate-200">
                            <button className="text-yellow-400 border-b-2 border-yellow-400 pb-1">Inicio</button>
                            <button onClick={() => navigate('/guia')} className="hover:text-white transition-colors hover:-translate-y-0.5 transform duration-200">Guía</button>
                            <button onClick={() => navigate('/tarifas')} className="hover:text-white transition-colors hover:-translate-y-0.5 transform duration-200">Tarifas</button>
                        </div>

                        <div className="flex items-center gap-4 pl-8 border-l border-white/10">
                            {isLoggedIn ? (
                                <>
                                    <button
                                        onClick={() => navigate('/descargas')}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full font-bold text-base transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(37,99,235,0.5)] flex items-center gap-2 border border-blue-400/30"
                                    >
                                        <User className="h-5 w-5" /> {userName}
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-white/10 hover:bg-red-500/90 text-white p-2.5 rounded-full transition-all backdrop-blur-md border border-white/10"
                                        title="Cerrar Sesión"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-8 py-3 rounded-full font-bold text-base transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.4)] flex items-center gap-2"
                                >
                                    <LogIn className="h-5 w-5" /> Acceso Alumnos
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/10">
                            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>

                {/* MENÚ MÓVIL */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-xl border-t border-white/10 p-6 shadow-2xl animate-fade-in-down">
                        <div className="flex flex-col gap-4 text-lg font-bold text-slate-300">
                            <button className="text-left text-yellow-400 py-2 border-b border-white/10">Inicio</button>
                            <button onClick={() => navigate('/guia')} className="text-left py-2 border-b border-white/10 hover:text-white">Guía</button>
                            <button onClick={() => navigate('/tarifas')} className="text-left py-2 hover:text-white">Tarifas</button>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/10">
                            {isLoggedIn ? (
                                <div className="space-y-3">
                                    <button onClick={() => navigate('/descargas')} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg">Ir al Aula Virtual</button>
                                    <button onClick={handleLogout} className="w-full bg-slate-800 text-red-400 py-3 rounded-xl font-bold">Cerrar Sesión</button>
                                </div>
                            ) : (
                                <button onClick={() => navigate('/login')} className="w-full bg-yellow-500 text-slate-900 py-4 rounded-xl font-bold text-lg shadow-lg">Iniciar Sesión</button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
                {/* Imagen de Fondo */}
                <div className="absolute inset-0 z-0">
                    <img src={bgImage} alt="Fondo Policía" className="w-full h-full object-cover object-center transform scale-105 animate-slow-zoom" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-slate-900/30"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-12 gap-12 items-center h-full pb-12 pt-24">
                    <div className="md:col-span-8 animate-fade-in-up flex flex-col justify-center">
                        <div>
                            <div className="inline-flex items-center bg-blue-600/30 border border-blue-400/50 text-blue-100 px-5 py-2 rounded-full text-sm font-bold mb-8 backdrop-blur-md shadow-sm">
                                <span className="w-3 h-3 bg-blue-400 rounded-full mr-3 animate-pulse ring-4 ring-blue-400/30"></span>
                                Convocatoria 2026 Castilla y León
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-8 drop-shadow-2xl tracking-tight">
                                TU UNIFORME <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 filter drop-shadow-[0_2px_10px_rgba(234,179,8,0.5)]">
                                    TE ESPERA.
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-200 mb-12 leading-relaxed max-w-2xl font-medium opacity-90">
                                La plataforma inteligente que adapta el estudio a tu ritmo. Tests ilimitados, simulacros reales y el mejor equipo docente.
                            </p>
                            <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-6">
                                {isLoggedIn ? (
                                    <button onClick={() => navigate('/descargas')} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-green-900/40 transition transform hover:-translate-y-1 flex items-center justify-center">
                                        Continuar Estudiando <ArrowRight className="ml-3 h-6 w-6" />
                                    </button>
                                ) : (
                                    <button onClick={() => navigate('/registro')} className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-blue-900/40 transition transform hover:-translate-y-1 flex items-center justify-center">
                                        Empezar Gratis <ArrowRight className="ml-3 h-6 w-6" />
                                    </button>
                                )}
                                <button onClick={() => navigate('/login')} className="group bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-xl transition backdrop-blur-md flex items-center justify-center">
                                    <Play className="mr-3 h-6 w-6 fill-white opacity-80 group-hover:opacity-100 transition" /> Ver Demo
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-4"></div>
                </div>

                {/* --- NUEVO: LOGO FLOTANTE ABAJO A LA DERECHA --- */}
                <div className="absolute bottom-8 right-8 hidden md:block animate-fade-in-up delay-500 z-20">
                    {/* Contenedor con efecto cristal y borde sutil para que el logo resalte */}
                    <div className="bg-white/5 backdrop-blur-lg p-4 rounded-3xl border border-white/10 shadow-2xl transform hover:scale-105 transition-all duration-300 hover:bg-white/10 hover:border-white/30">
                        <img
                            src={imagenLogo}
                            alt="Logo Tu Plaza Mi Meta"
                            // Tamaño medio (w-32 en pantallas normales, w-40 en grandes) y esquinas redondeadas
                            className="w-32 lg:w-40 h-auto rounded-2xl shadow-md"
                        />
                    </div>
                </div>
            </header>

            {/* LOGOS AUTORIDAD */}
            <section className="bg-white py-16 border-b border-slate-100 relative z-20 -mt-8 rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.1)]">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-slate-400 mb-10 font-bold tracking-[0.2em] text-sm uppercase">Método avalado por expertos</p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-32 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        <div className="flex flex-col items-center gap-3 group">
                            <Star className="h-10 w-10 text-yellow-500 fill-current group-hover:scale-110 transition shadow-sm" />
                            <span className="font-bold text-xl text-slate-700">+10 Años experiencia</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 group">
                            <Users className="h-10 w-10 text-blue-600 fill-current group-hover:scale-110 transition shadow-sm" />
                            <span className="font-bold text-xl text-slate-700">Profesores policías</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 group">
                            <Shield className="h-10 w-10 text-slate-700 fill-current group-hover:scale-110 transition shadow-sm" />
                            <span className="font-bold text-xl text-slate-700">Material Oficial</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- GRID DE 6 TARJETAS --- */}
            <section className="py-24 container mx-auto px-6">
                <div className="text-center mb-20">
                    <div className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-blue-100">
                        Academia 360º
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
                        Todo para tu <span className="text-blue-600 underline decoration-yellow-400 underline-offset-8 decoration-4">Apto</span>
                    </h2>
                    <p className="text-xl text-slate-500 max-w-3xl mx-auto">
                        Hemos unificado todas las herramientas que necesitas en una sola plataforma. Sin parches, sin libros obsoletos.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* 1. Temario */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl border border-slate-100 transition-all duration-300 hover:-translate-y-2 group">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                            <BookOpen className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Temario Vivo</h3>
                        <p className="text-slate-500 leading-relaxed text-lg">Actualizado el mismo día que sale en el BOE. Siempre estudiarás la versión vigente.</p>
                    </div>

                    {/* 2. Tests (Destacada) */}
                    <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-yellow-500/20 transition-colors"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                                <Target className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Tests Interactivos</h3>
                            <p className="text-slate-300 leading-relaxed text-lg">Test totalmente interactivos dentro del aula virtual, con actualziaciones mensuales.</p>
                        </div>
                    </div>

                    {/* 3. Clases */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl border border-slate-100 transition-all duration-300 hover:-translate-y-2 group">
                        <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                            <Video className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">Clases 4K</h3>
                        <p className="text-slate-500 leading-relaxed text-lg">Videoclases grabadas y sesiones en directo. Explicaciones claras de policías en activo.</p>
                    </div>

                    {/* 4. Supuestos */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl border border-slate-100 transition-all duration-300 hover:-translate-y-2 group">
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                            <Brain className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition-colors">Supuestos Prácticos</h3>
                        <p className="text-slate-500 leading-relaxed text-lg">La clave del apto. Creados por profesionales y actualizados con casos reales recientes.</p>
                    </div>

                    {/* 5. Físicas */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl border border-slate-100 transition-all duration-300 hover:-translate-y-2 group">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform">
                            <Award className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">Entrenamiento Físico</h3>
                        <p className="text-slate-500 leading-relaxed text-lg">Planes específicos para las pruebas físicas de Policía Local. No pierdas puntos en la pista.</p>
                    </div>

                    {/* 6. Tutorías */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl border border-slate-100 transition-all duration-300 hover:-translate-y-2 group">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                            <MessageCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">Tutorías 24h</h3>
                        <p className="text-slate-500 leading-relaxed text-lg">No estás solo. Contacta con profesores expertos y resuelve tus dudas jurídicas en menos de 24h.</p>
                    </div>
                </div>
            </section>

            {/* --- CTA FINAL --- */}
            <section className="py-24 bg-gradient-to-br from-blue-900 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black mb-8">¿Listo para conseguir tu placa?</h2>
                    <p className="text-xl text-blue-200 mb-12 max-w-2xl mx-auto">
                        Únete hoy a la academia con mayor índice de aprobados de Castilla y León.
                    </p>
                    <button
                        onClick={() => navigate('/tarifas')}
                        className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-12 py-6 rounded-2xl font-black text-xl shadow-[0_0_40px_rgba(234,179,8,0.4)] transition-all transform hover:scale-105"
                    >
                        VER PLANES Y PRECIOS
                    </button>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-white pt-20 pb-10 border-t border-slate-200">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <Shield className="h-8 w-8 text-yellow-500 fill-current" />
                                <span className="text-xl font-black text-slate-900 uppercase">TUPLAZAMIMETA</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed">
                                Plataforma líder en formación policial. Tecnología, pasión y resultados.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-6 uppercase text-sm tracking-wider">Explora</h4>
                            <ul className="space-y-4 text-slate-600 font-medium">
                                <li><button onClick={() => navigate('/')} className="hover:text-blue-600 transition">Inicio</button></li>
                                <li><button onClick={() => navigate('/guia')} className="hover:text-blue-600 transition">Guía Opositor</button></li>
                                <li><button onClick={() => navigate('/tarifas')} className="hover:text-blue-600 transition">Precios</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-6 uppercase text-sm tracking-wider">Comunidad</h4>
                            <ul className="space-y-4 text-slate-600 font-medium">
                                <li><button onClick={() => navigate('/login')} className="hover:text-blue-600 transition">Blog Opositor</button></li>
                                <li><button onClick={() => navigate('/login')} className="hover:text-blue-600 transition">Foro de dudas</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-6 uppercase text-sm tracking-wider">Contacto</h4>
                            <p className="text-slate-500 mb-2">¿Dudas?</p>
                            <a href="mailto:tuplazamimeta@gmail.com" className="text-lg font-bold text-blue-600 hover:underline">tuplazamimeta@gmail.com</a>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-8 text-center text-slate-400 text-sm font-medium">
                        © {new Date().getFullYear()} Tu Plaza Mi Meta S.L. · Hecho con 💙 para futuros policías.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;