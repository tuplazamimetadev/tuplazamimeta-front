import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Menu, X, CheckCircle, Crown, CreditCard, ArrowLeft,
  Bell, Search, BookOpen, Brain, Settings, LogOut, Newspaper, Briefcase, FileText, Mail
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const PlanesPage = () => {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Estado del usuario
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    displayRole: '',
    expiration: ''
  });

  // --- LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_name');
    navigate('/login');
  };

  // --- CARGAR DATOS ---
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) { navigate('/login'); return; }

    fetch(`${API_URL}/api/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        let internalRole = 'STUDENT';
        if (data.role === 'Solo Test') internalRole = 'TEST';
        if (data.role === 'Solo Supuestos') internalRole = 'PRACTICAL';
        if (data.role === 'Opositor Completo') internalRole = 'PREMIUM';
        if (data.role === 'Administrador') internalRole = 'ADMIN';

        setUserData({
          name: data.name,
          email: data.email,
          displayRole: data.role,
          role: internalRole,
          expiration: data.expiration
        });
      })
      .catch(err => console.error(err));
  }, [navigate]);

  // --- SIMULAR COMPRA ---
  const handleUpgrade = (planName) => {
    alert(`¡Genial! Has seleccionado el plan: ${planName}.\n\nAquí se abriría la pasarela de pago (Stripe/PayPal).`);
  };

  // --- LÓGICA DE VISIBILIDAD NAVBAR ---
  // SUPUESTOS (PRACTICAL): No ve Temario ni Tests
  const canSeeTemario = userData.role !== 'PRACTICAL';
  const canSeeTests = userData.role !== 'PRACTICAL';
  // TEST: No ve Supuestos
  const canSeeSupuestos = userData.role !== 'TEST';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800">

      {/* ==================================================================
           1. NAVBAR UNIFICADA (ACTUALIZADA)
      ================================================================== */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/descargas')}>
            <Shield className="h-8 w-8 text-yellow-500" />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-wider uppercase leading-none">AULA VIRTUAL</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Tu Plaza Mi Meta</span>
            </div>
          </div>

          {/* Menú Central */}
          <div className="hidden md:flex space-x-1 items-center bg-slate-800/50 p-1 rounded-lg border border-slate-700">

            {canSeeTemario && (
              <button
                onClick={() => navigate('/descargas')}
                className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white"
              >
                <BookOpen className="h-4 w-4 mr-2" /> Temario
              </button>
            )}

            {canSeeTests && (
              <button
                onClick={() => navigate('/tests')}
                className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white"
              >
                <Brain className="h-4 w-4 mr-2" /> Ponte a prueba
              </button>
            )}

            {/* --- 2. BOTÓN DE SUPUESTOS --- */}
            {canSeeSupuestos && (
              <button
                onClick={() => navigate('/supuestos')}
                className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white"
              >
                <Briefcase className="h-4 w-4 mr-2" /> Supuestos
              </button>
            )}

            <button
              onClick={() => navigate('/noticias')}
              className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white"
            >
              <Newspaper className="h-4 w-4 mr-2" /> Noticias
            </button>
            <button
              onClick={() => navigate('/contacto')}
              className="px-6 py-2 rounded-md font-bold text-sm transition flex items-center text-slate-400 hover:text-white"
            >
              <Mail className="h-4 w-4 mr-2" /> Contacto
            </button>

            <div className="w-px h-6 bg-slate-700 mx-2"></div>

            {/* Botón MI PLAN (ACTIVO) */}
            <button
              className="px-4 py-2 rounded-md bg-yellow-500 text-slate-900 font-bold text-sm transition flex items-center shadow-sm"
            >
              <Crown className="h-3 w-3 mr-1.5" /> Mi Plan
            </button>
          </div>

          {/* Área Personal Derecha */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Buscar..." className="bg-slate-800 border-none rounded-full pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 w-32 focus:w-48 transition-all" />
            </div>

            <button className="relative p-2 text-slate-400 hover:text-white transition">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full pl-2 pr-4 py-1 transition"
              >
                <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg uppercase">
                  {userData.name ? userData.name.charAt(0) : 'U'}
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate">{userData.name}</span>
              </button>
            </div>
          </div>

          {/* Menú Móvil */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </nav>

      {/* ==================================================================
           2. MODAL DE PERFIL
      ================================================================== */}
      {isProfileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setIsProfileOpen(false)}></div>
          <div className="fixed top-20 right-4 md:right-10 w-80 bg-white rounded-2xl shadow-2xl z-[70] overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-top-5 duration-200">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white text-center relative">
              <button onClick={() => setIsProfileOpen(false)} className="absolute top-3 right-3 text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
              <div className="h-16 w-16 bg-white rounded-full mx-auto flex items-center justify-center text-slate-900 text-2xl font-bold mb-3 shadow-lg border-4 border-slate-700 uppercase">
                {userData.name ? userData.name.charAt(0) : 'U'}
              </div>
              <h3 className="font-bold text-lg">{userData.name}</h3>
              <p className="text-slate-400 text-xs">{userData.email}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs text-yellow-800 font-bold uppercase tracking-wider mb-1">Plan Activo</p>
                  <div className="flex items-center text-slate-900 font-bold text-sm">
                    <Crown className="h-4 w-4 text-yellow-500 mr-2 fill-current" />
                    {userData.displayRole || 'Cargando...'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-500">Expira</span>
                  <span className="text-xs font-semibold text-slate-700">{userData.expiration || '--/--'}</span>
                </div>
              </div>
              <ul className="space-y-1">
                <li><button className="w-full flex items-center px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition text-sm"><Settings className="h-4 w-4 mr-3" /> Configuración</button></li>
                <li><button className="w-full flex items-center px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition text-sm"><CreditCard className="h-4 w-4 mr-3" /> Facturación</button></li>
              </ul>
              <div className="border-t border-slate-100 pt-3">
                <button onClick={handleLogout} className="w-full flex items-center justify-center px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition text-sm font-bold">
                  <LogOut className="h-4 w-4 mr-2" /> Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CONTENIDO PRINCIPAL (PLANES) */}
      <div className="container mx-auto px-6 py-12">

        {/* Botón Volver */}
        <div className="mb-8">
          <button onClick={() => navigate('/descargas')} className="flex items-center text-slate-500 hover:text-blue-600 font-medium transition">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver al temario
          </button>
        </div>

        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-slate-900">Gestiona tu Suscripción</h1>
          <p className="text-slate-600 mt-2">Mejora tu plan para acceder a más contenidos.</p>
        </div>

        {/* GRID DE PLANES ACTUALIZADO A 4 COLUMNAS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-start animate-fade-in-up">

          {/* PLAN GRATIS */}
          <div className={`rounded-3xl p-6 border-2 flex flex-col h-full transition relative ${userData.role === 'STUDENT' ? 'bg-white border-green-500 shadow-xl' : 'bg-slate-100 border-slate-200 opacity-70'}`}>
            {userData.role === 'STUDENT' && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Plan Actual</div>
            )}
            <h3 className="text-xl font-bold text-slate-700 mb-2">Prueba Gratuita</h3>
            <div className="flex items-baseline mb-6"><span className="text-4xl font-extrabold text-slate-900">0€</span></div>
            <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-600">
              <li className="flex"><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Acceso Limitado</li>
              <li className="flex"><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> 1 Tema de ejemplo</li>
            </ul>
            <button disabled={userData.role === 'STUDENT'} className="w-full py-3 rounded-xl border border-slate-300 font-bold text-slate-400 cursor-not-allowed">
              {userData.role === 'STUDENT' ? 'Tu Plan Actual' : 'Plan Básico'}
            </button>
          </div>

          {/* PLAN SOLO TEST */}
          <div className={`rounded-3xl p-6 border-2 flex flex-col h-full transition relative ${userData.role === 'TEST' ? 'bg-white border-green-500 shadow-xl' : 'bg-white border-blue-100 hover:border-blue-400 shadow-lg'}`}>
            {userData.role === 'TEST' && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Plan Actual</div>
            )}
            <h3 className="text-xl font-bold text-blue-600 mb-2">Solo Test</h3>
            <div className="flex items-baseline mb-6"><span className="text-4xl font-extrabold text-slate-900">19,99€</span><span className="ml-1 text-slate-500 text-sm">/mes</span></div>
            <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-600">
              <li className="flex"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> Preguntas ilimitadas</li>
              <li className="flex"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> Actualizaciones mensuales</li>
              <li className="flex"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> Simulacros Reales</li>

            </ul>
            {userData.role === 'TEST' ? (
              <button disabled className="w-full py-3 rounded-xl bg-green-100 text-green-700 font-bold">Tu Plan Actual</button>
            ) : (
              <button onClick={() => handleUpgrade('Solo Test')} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-lg shadow-blue-200 text-sm">
                Mejorar a Test
              </button>
            )}
          </div>

          {/* --- PLAN SOLO SUPUESTOS (NUEVO) --- */}
          <div className={`rounded-3xl p-6 border-2 flex flex-col h-full transition relative ${userData.role === 'PRACTICAL' ? 'bg-white border-green-500 shadow-xl' : 'bg-white border-indigo-100 hover:border-indigo-400 shadow-lg'}`}>
            {userData.role === 'PRACTICAL' && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Plan Actual</div>
            )}
            <h3 className="text-xl font-bold text-indigo-600 mb-2">Solo Supuestos</h3>
            <div className="flex items-baseline mb-6"><span className="text-4xl font-extrabold text-slate-900">25,99€</span><span className="ml-1 text-slate-500 text-sm">/mes</span></div>
            <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-600">
              <li className="flex"><FileText className="h-4 w-4 text-indigo-500 mr-2" /> Casos Prácticos profesionales</li>
              <li className="flex"><FileText className="h-4 w-4 text-indigo-500 mr-2" /> Actualización mensual</li>
              <li className="flex"><FileText className="h-4 w-4 text-indigo-500 mr-2" /> Resolución de dudas</li>
            </ul>
            {userData.role === 'PRACTICAL' ? (
              <button disabled className="w-full py-3 rounded-xl bg-green-100 text-green-700 font-bold">Tu Plan Actual</button>
            ) : (
              <button onClick={() => handleUpgrade('Solo Supuestos')} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-lg shadow-indigo-200 text-sm">
                Mejorar a Supuestos
              </button>
            )}
          </div>

          {/* PLAN OPOSITOR COMPLETO */}
          <div className={`rounded-3xl p-6 border-2 flex flex-col h-full transition relative ${userData.role === 'PREMIUM' ? 'bg-slate-900 border-green-500 shadow-xl' : 'bg-slate-900 border-yellow-500 shadow-2xl'}`}>
            {userData.role === 'PREMIUM' ? (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Plan Actual</div>
            ) : (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-slate-900 px-4 py-1 rounded-full text-xs font-bold uppercase">Recomendado</div>
            )}

            <h3 className="text-xl font-bold text-yellow-400 mb-2">Opositor Completo</h3>
            <div className="flex items-baseline mb-6"><span className="text-4xl font-extrabold text-white">49,99€</span><span className="ml-1 text-slate-400 text-sm">/mes</span></div>
            <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-300">
              <li className="flex"><Crown className="h-4 w-4 text-yellow-500 mr-2" /> <strong>TODO INCLUIDO</strong></li>
              <li className="flex"><CheckCircle className="h-4 w-4 text-yellow-500 mr-2" /> Temario + Tests + Supuestos</li>
              <li className="flex"><CheckCircle className="h-4 w-4 text-yellow-500 mr-2" /> Tutor personalizado</li>
            </ul>

            {userData.role === 'PREMIUM' ? (
              <button disabled className="w-full py-3 rounded-xl bg-green-600 text-white font-bold">Tu Plan Actual</button>
            ) : (
              <button onClick={() => handleUpgrade('Opositor Completo')} className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold transition shadow-lg shadow-yellow-500/20 text-sm">
                Conseguir la Plaza
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlanesPage;