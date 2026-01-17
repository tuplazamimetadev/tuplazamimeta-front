import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, Menu, X, User, LogIn, LogOut, HelpCircle, FileText } from 'lucide-react';

const TarifasPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  // --- DETECTAR LOGIN ---
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const name = localStorage.getItem('user_name');
    if (token) {
      setIsLoggedIn(true);
      setUserName(name || 'Alumno');
    }
  }, []);

  // --- LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_name');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
      
      {/* --- NAVBAR --- */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition" onClick={() => navigate('/')}>
            <Shield className="h-8 w-8 text-yellow-500" />
            <span className="text-xl font-bold tracking-wider uppercase">TUPLAZAMIMETA</span>
          </div>
          
          <div className="hidden md:flex space-x-8 font-medium items-center">
            <button onClick={() => navigate('/')} className="hover:text-yellow-400 transition">Inicio</button>
            <button onClick={() => navigate('/guia')} className="hover:text-yellow-400 transition">Guía</button>
            <button className="text-yellow-400 font-bold border-b-2 border-yellow-400">Tarifas</button>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <button onClick={() => navigate('/descargas')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition flex items-center">
                  <User className="h-4 w-4 mr-2" /> {userName}
                </button>
                <button onClick={handleLogout} className="bg-red-500/20 hover:bg-red-600 text-red-400 hover:text-white p-2 rounded-full transition">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-6 py-2 rounded-full font-bold transition flex items-center">
                <LogIn className="h-4 w-4 mr-2" /> Iniciar Sesión
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>

        {/* MENU MOVIL */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 p-4 mt-2 rounded-lg space-y-4">
            <button onClick={() => navigate('/')} className="block w-full text-left hover:text-yellow-400">Volver a Inicio</button>
            {isLoggedIn ? (
               <button onClick={handleLogout} className="text-red-400 font-bold">Cerrar Sesión</button>
            ) : (
               <button onClick={() => navigate('/login')} className="text-yellow-400 font-bold">Iniciar Sesión</button>
            )}
          </div>
        )}
      </nav>

      {/* --- HEADER --- */}
      <header className="bg-slate-900 text-white pt-20 pb-32 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
            <div className="absolute top-10 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-yellow-600 rounded-full blur-3xl"></div>
         </div>
         <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Planes flexibles para tu Apto</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Elige las herramientas que necesitas. Sin matrículas ni permanencias ocultas.
            </p>
         </div>
      </header>

      {/* --- TARJETAS DE PRECIOS --- */}
      <section className="container mx-auto px-6 -mt-24 relative z-20 pb-20">
        {/* Cambiado a grid-cols-4 para acomodar la nueva tarjeta */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-start">
            
            {/* PLAN 1: GRATIS */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl flex flex-col h-full hover:shadow-2xl transition duration-300">
              <div className="mb-4">
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Básico</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Prueba Gratuita</h3>
              <div className="flex items-baseline mb-6"><span className="text-4xl font-extrabold text-slate-900">0€</span></div>
              <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                Descubre nuestra plataforma antes de comprometerte.
              </p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0"/> <span className="text-sm">1 Simulacro real</span></li>
                <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0"/> <span className="text-sm">Extracto Temario</span></li>
              </ul>
              
              <button onClick={() => navigate('/registro')} className="w-full py-3 rounded-xl border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-50 transition text-sm">
                Crear cuenta
              </button>
            </div>

            {/* PLAN 2: SOLO TEST */}
            <div className="bg-white rounded-3xl p-6 border-2 border-blue-100 shadow-xl flex flex-col h-full hover:shadow-2xl hover:border-blue-300 transition duration-300">
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Práctica</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Solo Test</h3>
              <div className="flex items-baseline mb-6"><span className="text-4xl font-extrabold text-slate-900">19€</span><span className="text-slate-500 ml-1 text-sm">/mes</span></div>
              <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                Para machacar preguntas tipo test sin parar.
              </p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0"/> <span className="text-sm"><strong>+30k Preguntas</strong></span></li>
                <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0"/> <span className="text-sm">Simulacros ilimitados</span></li>
                <li className="flex items-start"><CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 shrink-0"/> <span className="text-sm">Batalla de Test</span></li>
              </ul>
              
              <button onClick={() => navigate('/registro')} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-lg text-sm">
                Elegir Solo Test
              </button>
            </div>

            {/* PLAN 3: SOLO SUPUESTOS (NUEVO) */}
            <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-xl flex flex-col h-full hover:shadow-2xl hover:border-indigo-300 transition duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-bl-full -mr-4 -mt-4"></div>
              <div className="mb-4 relative">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Casos</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Solo Supuestos</h3>
              <div className="flex items-baseline mb-6"><span className="text-4xl font-extrabold text-slate-900">25€</span><span className="text-slate-500 ml-1 text-sm">/mes</span></div>
              <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                Domina la parte práctica con casos reales y guiados.
              </p>
              
              <ul className="space-y-4 mb-8 flex-1 relative z-10">
                <li className="flex items-start"><CheckCircle className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 shrink-0"/> <span className="text-sm"><strong>+500 Supuestos</strong></span></li>
                <li className="flex items-start"><CheckCircle className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 shrink-0"/> <span className="text-sm">Resolución paso a paso</span></li>
                <li className="flex items-start"><CheckCircle className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 shrink-0"/> <span className="text-sm">Normativa aplicada</span></li>
                <li className="flex items-start"><CheckCircle className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 shrink-0"/> <span className="text-sm">Vídeos explicativos</span></li>
              </ul>
              
              <button onClick={() => navigate('/registro')} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-lg text-sm">
                Elegir Supuestos
              </button>
            </div>

            {/* PLAN 4: OPOSITOR COMPLETO */}
            <div className="bg-slate-900 rounded-3xl p-6 border-2 border-yellow-500 shadow-2xl flex flex-col h-full transform md:-translate-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-slate-900 px-4 py-1 rounded-b-lg font-bold text-xs uppercase tracking-wider w-full text-center">
                Más Elegido
              </div>

              <div className="mt-8 mb-4">
                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-yellow-500/30">Todo Incluido</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Opositor Completo</h3>
              <div className="flex items-baseline mb-6"><span className="text-4xl font-extrabold text-white">49€</span><span className="text-slate-400 ml-1 text-sm">/mes</span></div>
              <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                La preparación definitiva para conseguir tu plaza.
              </p>
              
              <ul className="space-y-4 mb-8 flex-1 text-slate-200">
                <li className="flex items-start"><CheckCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 shrink-0"/> <span className="text-sm font-bold text-white">Tests + Supuestos</span></li>
                <li className="flex items-start"><CheckCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 shrink-0"/> <span className="text-sm"><strong>Temario Audio+PDF</strong></span></li>
                <li className="flex items-start"><CheckCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 shrink-0"/> <span className="text-sm">Clases y Tutor</span></li>
                <li className="flex items-start"><CheckCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 shrink-0"/> <span className="text-sm">Entrevista Personal</span></li>
              </ul>
              
              <button onClick={() => navigate('/registro')} className="w-full py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold transition shadow-lg shadow-yellow-500/20 text-sm">
                Quiero mi Plaza
              </button>
            </div>

        </div>
      </section>

      {/* --- PREGUNTAS FRECUENTES (FAQ) --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 flex items-center justify-center">
              <HelpCircle className="mr-3 h-8 w-8 text-blue-600" /> Preguntas Frecuentes
            </h2>
            <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition">
                    <h4 className="font-bold text-lg mb-2 text-slate-800">¿Qué incluye el plan de Supuestos?</h4>
                    <p className="text-slate-600">Incluye acceso exclusivo a la base de datos de casos prácticos, vídeos de resolución y normativa, pero NO incluye el banco de preguntas tipo test ni el temario teórico.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition">
                    <h4 className="font-bold text-lg mb-2 text-slate-800">¿Tengo permanencia?</h4>
                    <p className="text-slate-600">No, ninguna. Puedes cancelar tu suscripción en cualquier momento.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition">
                    <h4 className="font-bold text-lg mb-2 text-slate-800">¿Puedo cambiar de plan?</h4>
                    <p className="text-slate-600">Sí, puedes hacer upgrade a "Opositor Completo" pagando solo la diferencia.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 text-slate-500 py-12 text-sm border-t border-gray-200 text-center">
        <div className="container mx-auto px-6">
           <p className="mb-4">© 2026 Tu Plaza Mi Meta S.L.</p>
           <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">Volver a la portada</button>
        </div>
      </footer>

    </div>
  );
};

export default TarifasPage;