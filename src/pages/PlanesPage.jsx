import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  CheckCircle, Crown, ArrowLeft, FileText
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const PlanesPage = () => {
  const navigate = useNavigate();

  // Estado del usuario
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',     // Rol interno (TEST, PREMIUM, etc)
    expiration: ''
  });

  // --- CARGAR DATOS ---
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) { navigate('/login'); return; }

    fetch(`${API_URL}/api/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // CORRECCIÓN: Mapear los códigos exactos que usa el Backend (SubscriptionController)
        let internalRole = 'STUDENT';
        
        // El backend devuelve códigos como "TEST", "SUPUESTOS", "COMPLETO" o "ADMIN"
        if (data.role === 'TEST') internalRole = 'TEST';
        if (data.role === 'SUPUESTOS') internalRole = 'PRACTICAL';
        if (data.role === 'COMPLETO' || data.role === 'PREMIUM') internalRole = 'PREMIUM';
        if (data.role === 'ADMIN' || data.role === 'PROFESOR') internalRole = 'ADMIN';

        setUserData({
          name: data.name,
          email: data.email,
          role: internalRole,
          expiration: data.expiration
        });
      })
      .catch(err => console.error(err));
  }, [navigate]);

  // --- COMPRAR / ACTUALIZAR ---
  const handleUpgrade = async (planName) => {
    if (!window.confirm(`¿Confirmar suscripción al plan ${planName}?`)) return;
    
    const token = localStorage.getItem('jwt_token');
    try {
        const res = await fetch(`${API_URL}/api/subscription/upgrade`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ plan: planName }) // Enviamos el nombre del plan
        });

        if (res.ok) {
            alert("¡Plan actualizado con éxito! Disfruta de 30 días más.");
            window.location.reload(); 
        } else {
            alert("Error al procesar el pago/actualización.");
        }
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
      <Navbar user={userData} activePage="suscripcion" />

      <div className="container mx-auto px-6 py-12">

        <div className="mb-8">
          <button onClick={() => navigate('/descargas')} className="flex items-center text-slate-500 hover:text-blue-600 font-medium transition">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver al temario
          </button>
        </div>

        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-slate-900">Gestiona tu Suscripción</h1>
          <p className="text-slate-600 mt-2">Mejora tu plan para acceder a más contenidos.</p>
        </div>

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

          {/* PLAN SOLO SUPUESTOS */}
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
          <div className={`rounded-3xl p-6 border-2 flex flex-col h-full transition relative ${userData.role === 'PREMIUM' || userData.role === 'ADMIN' ? 'bg-slate-900 border-green-500 shadow-xl' : 'bg-slate-900 border-yellow-500 shadow-2xl'}`}>
            {userData.role === 'PREMIUM' || userData.role === 'ADMIN' ? (
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

            {userData.role === 'PREMIUM' || userData.role === 'ADMIN' ? (
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