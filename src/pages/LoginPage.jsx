import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import imagenLogo from '../assets/logo.jpeg'; 
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await response.json();
      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('user_name', data.name);
      navigate('/descargas');

    } catch (err) {
      setError('Email o contraseña incorrectos. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-gray-800">
      {/* IZQUIERDA: Formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-24 animate-fade-in-up">
        <div className="w-full max-w-md">
          <div className="mb-10 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex items-center space-x-2 text-slate-900 mb-6">
              <Shield className="h-8 w-8 text-yellow-500" />
              <span className="text-xl font-bold tracking-wider uppercase">Tu Plaza Mi Meta</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Bienvenido de nuevo</h1>
            <p className="text-slate-500">Introduce tus credenciales para acceder al aula.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" 
                  placeholder="student@tuplazamimeta.com" 
                  required 
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">Contraseña</label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-semibold">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" 
                  placeholder="••••••••" 
                  required 
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </div>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg transition transform hover:scale-[1.02] flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
               {loading ? 'Verificando...' : <><span className="mr-2">Acceder al Aula</span> <ArrowRight className="h-5 w-5" /></>}
            </button>
          </form>
          <div className="mt-8 text-center text-sm text-slate-500">
            ¿No tienes cuenta? <span onClick={() => navigate('/registro')} className="text-blue-700 font-bold cursor-pointer hover:underline">Regístrate gratis</span>
          </div>
        </div>
      </div>
      {/* DERECHA: Imagen */}
      <div className="hidden md:block w-1/2 bg-slate-900 relative overflow-hidden">
        <img src={imagenLogo} alt="Policía Nacional" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="relative z-10 h-full flex flex-col justify-end p-16 text-white">
          <div className="bg-yellow-500 w-16 h-2 mb-6"></div>
          <h2 className="text-4xl font-bold leading-tight mb-4">"El éxito es la suma de pequeños esfuerzos repetidos cada día."</h2>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;