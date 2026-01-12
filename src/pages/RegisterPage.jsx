import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import imagenLogo from '../assets/logo.jpeg'; 
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al registrarse. El email podría estar en uso.');

      const data = await response.json();
      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('user_name', data.name);
      navigate('/descargas');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-gray-800">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-24 animate-fade-in-up">
        <div className="w-full max-w-md">
          <div className="mb-10 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex items-center space-x-2 text-slate-900 mb-6">
              <Shield className="h-8 w-8 text-yellow-500" />
              <span className="text-xl font-bold tracking-wider uppercase">Tu Plaza Mi Meta</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Crea tu cuenta</h1>
            <p className="text-slate-500">Empieza tu camino hacia el Apto hoy mismo.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold border border-red-200">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-slate-400" /></div>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" placeholder="Juan Pérez" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-slate-400" /></div>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" placeholder="tu@email.com" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-400" /></div>
                <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="block w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" placeholder="Elige una contraseña segura" required />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className={`w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg transition transform hover:scale-[1.02] flex justify-center items-center ${loading ? 'opacity-70' : ''}`}>
               {loading ? 'Creando cuenta...' : 'Registrarme Gratis'}
            </button>
          </form>
          <div className="mt-8 text-center text-sm text-slate-500">
            ¿Ya tienes cuenta? <span onClick={() => navigate('/login')} className="text-blue-700 font-bold cursor-pointer hover:underline">Inicia Sesión</span>
          </div>
        </div>
      </div>
      <div className="hidden md:block w-1/2 bg-slate-900 relative overflow-hidden">
        <img src={imagenLogo} alt="Policía" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="relative z-10 h-full flex flex-col justify-end p-16 text-white">
          <div className="bg-yellow-500 w-16 h-2 mb-6"></div>
          <h2 className="text-4xl font-bold leading-tight mb-4">"No te pares cuando estés cansado, párate cuando hayas terminado."</h2>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;