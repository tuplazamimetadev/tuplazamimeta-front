import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, Play, Menu, X, ArrowRight, Star, Users, BookOpen, Video, LogIn, User, LogOut } from 'lucide-react';
import imagenLogo from '../assets/logo.jpeg'; 

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  // --- DETECTAR SI EL USUARIO YA ESTÁ LOGUEADO ---
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const name = localStorage.getItem('user_name');
    
    if (token) {
      setIsLoggedIn(true);
      setUserName(name || 'Alumno');
    }
  }, []);

  // --- FUNCIÓN PARA CERRAR SESIÓN ---
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_name');
    setIsLoggedIn(false);
    setUserName('');
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen font-sans text-gray-800">
      
      {/* --- NAVBAR UNIFICADA --- */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition" onClick={() => navigate('/')}>
            <Shield className="h-8 w-8 text-yellow-500" />
            <span className="text-xl font-bold tracking-wider uppercase">TUPLAZAMIMETA</span>
          </div>
          
          <div className="hidden md:flex space-x-8 font-medium items-center">
            {/* Pestaña Activa: Inicio */}
            <button className="text-yellow-400 font-bold border-b-2 border-yellow-400">Inicio</button>
            
            <button onClick={() => navigate('/guia')} className="hover:text-yellow-400 transition">Guía</button>
            <button onClick={() => navigate('/tarifas')} className="hover:text-yellow-400 transition">Tarifas</button>
            
            {/* LÓGICA CONDICIONAL NAVBAR (DESKTOP) */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/descargas')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition transform hover:scale-105 flex items-center"
                >
                  <User className="h-4 w-4 mr-2" /> Hola, {userName}
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500/20 hover:bg-red-600 text-red-400 hover:text-white p-2 rounded-full transition border border-red-500/50"
                  title="Cerrar Sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-6 py-2 rounded-full font-bold transition transform hover:scale-105 flex items-center"
              >
                <LogIn className="h-4 w-4 mr-2" /> Iniciar Sesión
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>

        {/* MENÚ MÓVIL */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 p-4 mt-2 rounded-lg space-y-4">
            <button className="block w-full text-left font-bold text-yellow-500">Inicio</button>
            <button onClick={() => navigate('/guia')} className="block w-full text-left hover:text-yellow-400">Guía</button>
            <button onClick={() => navigate('/tarifas')} className="block w-full text-left hover:text-yellow-400">Tarifas</button>
            
            {isLoggedIn ? (
               <>
                 <button onClick={() => navigate('/descargas')} className="block w-full text-left font-bold text-blue-400 mt-4 border-t border-slate-700 pt-4">
                   Ir al Aula ({userName})
                 </button>
                 <button onClick={handleLogout} className="flex items-center w-full text-left font-bold text-red-400 hover:text-red-300 mt-2">
                   <LogOut className="h-4 w-4 mr-2" /> Cerrar Sesión
                 </button>
               </>
            ) : (
               <button onClick={() => navigate('/login')} className="block w-full text-left hover:text-yellow-400 mt-4 border-t border-slate-700 pt-4">
                 Entrar al Aula
               </button>
            )}
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>
        <div className="container mx-auto px-6 py-20 md:py-28 md:flex items-center relative z-10">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="inline-flex items-center bg-blue-50 border border-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-bold mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
              Convocatoria 2026 Abierta
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Tu uniforme te espera <br/><span className="text-blue-700">en Castilla y León</span>.
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              La plataforma inteligente que adapta el estudio a tu ritmo. Tests ilimitados y simulacros reales.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {isLoggedIn ? (
                <button onClick={() => navigate('/descargas')} className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition flex items-center justify-center">
                  Continuar Estudiando <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              ) : (
                <button onClick={() => navigate('/registro')} className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition flex items-center justify-center">
                  Empezar Gratis <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              )}

              <button onClick={() => navigate('/login')} className="group border-2 border-slate-200 hover:border-blue-700 hover:text-blue-700 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center">
                <Play className="mr-2 h-5 w-5 group-hover:fill-current" /> Ver Demo
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center md:justify-end">
             <div className="relative w-full max-w-md">
                <img 
                  src={imagenLogo} 
                  alt="Opositor" 
                  className="relative rounded-2xl shadow-2xl border-4 border-white object-contain h-96 w-full p-6 bg-white" 
                />
                
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center space-x-3 border border-gray-100">
                  <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle className="h-6 w-6" /></div>
                  <div><div className="font-bold text-slate-900">1.240 Aptos</div><div className="text-xs text-slate-500">en la última promo</div></div>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* LOGOS */}
      <section className="bg-slate-50 py-10 border-y border-gray-200">
        <div className="container mx-auto text-center px-6">
          <p className="text-slate-400 mb-6 font-semibold tracking-widest text-sm uppercase">Tecnología validada por opositores de</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition duration-500">
             <div className="flex items-center space-x-2 font-bold text-xl text-slate-700"><Star className="h-6 w-6 text-yellow-500 fill-current"/> Trustpilot</div>
             <div className="flex items-center space-x-2 font-bold text-xl text-slate-700"><Users className="h-6 w-6 text-blue-500 fill-current"/> +15.000 Alumnos</div>
             <div className="flex items-center space-x-2 font-bold text-xl text-slate-700">Google Reviews</div>
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Todo lo necesario para el Apto</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">Hemos digitalizado el proceso de estudio.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-slate-100">
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mb-6"><BookOpen className="h-8 w-8" /></div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Temario Vivo</h3>
            <p className="text-slate-600">Actualizado al instante con cada cambio en el BOE.</p>
          </div>
           <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-slate-100">
            <div className="bg-yellow-50 w-16 h-16 rounded-2xl flex items-center justify-center text-yellow-600 mb-6"><CheckCircle className="h-8 w-8" /></div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Algoritmo de Test</h3>
            <p className="text-slate-600">Nuestra IA detecta tus fallos y genera tests personalizados.</p>
          </div>
           <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-slate-100">
            <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 mb-6"><Video className="h-8 w-8" /></div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Aula Virtual 4K</h3>
            <p className="text-slate-600">Clases grabadas y directos semanales con inspectores.</p>
          </div>
        </div>
      </section>

      {/* PRECIOS (RESUMEN) */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Invierte en tu futuro</h2>
            <p className="text-slate-300 text-lg">Precios transparentes. Sin permanencia.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* Mensual */}
            <div className="bg-slate-800 text-white rounded-3xl p-8 border border-slate-700 hover:border-slate-500 transition">
              <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Mensual</h3>
              <div className="flex items-baseline mb-6"><span className="text-4xl font-bold">29€</span><span className="text-slate-400 ml-2">/mes</span></div>
              <ul className="space-y-4 mb-8 text-slate-300">
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-3"/> Tests ilimitados</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-3"/> Temario Básico</li>
              </ul>
              <button onClick={() => navigate('/registro')} className="w-full py-3 rounded-xl border border-slate-600 hover:bg-slate-700 font-bold transition">Elegir Mensual</button>
            </div>
            {/* Trimestral */}
            <div className="bg-gradient-to-b from-blue-600 to-blue-800 text-white rounded-3xl p-8 relative transform md:scale-110 shadow-2xl border border-blue-500">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-slate-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">Opción más elegida</div>
              <h3 className="text-lg font-bold text-blue-200 uppercase tracking-widest mb-2">Trimestral</h3>
              <div className="flex items-baseline mb-2"><span className="text-5xl font-bold">75€</span><span className="text-blue-200 ml-2">/3 meses</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-yellow-400 mr-3"/> <strong>Todo incluido</strong></li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-yellow-400 mr-3"/> Planificador inteligente</li>
              </ul>
              <button onClick={() => navigate('/registro')} className="w-full py-4 rounded-xl bg-yellow-500 text-slate-900 font-bold hover:bg-yellow-400 transition shadow-lg">Empezar Ahora</button>
            </div>
            {/* Anual */}
            <div className="bg-slate-800 text-white rounded-3xl p-8 border border-slate-700 hover:border-slate-500 transition">
              <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Anual</h3>
              <div className="flex items-baseline mb-6"><span className="text-4xl font-bold">250€</span><span className="text-slate-400 ml-2">/año</span></div>
              <ul className="space-y-4 mb-8 text-slate-300">
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-3"/> Acceso VIP 1 año</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-3"/> Entrevista Personal</li>
              </ul>
              <button onClick={() => navigate('/registro')} className="w-full py-3 rounded-xl border border-slate-600 hover:bg-slate-700 font-bold transition">Elegir Anual</button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER COMPLETO --- */}
      <footer className="bg-white text-slate-500 py-12 text-sm border-t border-gray-200">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 text-slate-900 mb-4">
              <Shield className="h-6 w-6 text-yellow-500" />
              <span className="text-lg font-bold">TU PLAZA MI META</span>
            </div>
            <p className="mb-4">Formando a los futuros guardianes de la seguridad ciudadana con tecnología y pasión.</p>
          </div>
          <div>
            <h4 className="text-slate-900 font-bold mb-4 uppercase text-xs tracking-wider">Plataforma</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/registro')} className="hover:text-blue-600">Cursos</button></li>
              <li><button onClick={() => navigate('/tarifas')} className="hover:text-blue-600">Precios</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-bold mb-4 uppercase text-xs tracking-wider">Comunidad</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/login')} className="hover:text-blue-600">Blog Opositor</button></li>
              <li><button onClick={() => navigate('/login')} className="hover:text-blue-600">Foro de dudas</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-bold mb-4 uppercase text-xs tracking-wider">Contacto</h4>
            <p>C/ Gran Vía 12, Madrid</p>
            <p className="text-blue-600 font-bold">info@tuplazamimeta.com</p>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-12 pt-8 border-t border-gray-100 text-center text-xs">
            © 2026 Tu Plaza Mi Meta S.L. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;