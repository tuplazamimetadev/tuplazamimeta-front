import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, MapPin, CheckCircle, Dumbbell, BookOpen, Brain, Star, FileText, Menu, X, User, LogIn, LogOut } from 'lucide-react';

const GuidePage = () => {
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
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
      
      {/* --- NAVBAR UNIFICADA --- */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition" onClick={() => navigate('/')}>
            <Shield className="h-8 w-8 text-yellow-500" />
            <span className="text-xl font-bold tracking-wider uppercase">TUPLAZAMIMETA</span>
          </div>
          
          <div className="hidden md:flex space-x-8 font-medium items-center">
            <button onClick={() => navigate('/')} className="hover:text-yellow-400 transition">Inicio</button>
            {/* Pestaña Activa: Guía */}
            <button className="text-yellow-400 font-bold border-b-2 border-yellow-400">Guía</button>
            <button onClick={() => navigate('/tarifas')} className="hover:text-yellow-400 transition">Tarifas</button>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <button onClick={() => navigate('/descargas')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition flex items-center">
                  <User className="h-4 w-4 mr-2" /> {userName}
                </button>
                <button onClick={handleLogout} className="bg-red-500/20 hover:bg-red-600 text-red-400 hover:text-white p-2 rounded-full transition border border-red-500/50">
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
            <button onClick={() => navigate('/')} className="block w-full text-left hover:text-yellow-400">Inicio</button>
            <button onClick={() => navigate('/tarifas')} className="block w-full text-left hover:text-yellow-400">Tarifas</button>
            {isLoggedIn ? (
               <>
                 <button onClick={() => navigate('/descargas')} className="block w-full text-left font-bold text-blue-400">
                   Mi Aula ({userName})
                 </button>
                 <button onClick={handleLogout} className="flex items-center w-full text-left font-bold text-red-400 hover:text-red-300 mt-2">
                   <LogOut className="h-4 w-4 mr-2" /> Cerrar Sesión
                 </button>
               </>
            ) : (
               <button onClick={() => navigate('/login')} className="block w-full text-left hover:text-yellow-400 font-bold text-yellow-500">
                 Iniciar Sesión
               </button>
            )}
          </div>
        )}
      </nav>

      {/* CABECERA DE LA GUÍA */}
      <header className="bg-white py-16 border-b border-slate-200">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4 inline-block">
            Guía Oficial 2026
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Todo sobre la Oposición de <br/> <span className="text-blue-700">Policía Local en Castilla y León</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Investigamos a fondo el proceso selectivo unificado. Requisitos, pruebas físicas, temario y trucos para conseguir tu plaza en la convocatoria de los 33 ayuntamientos.
          </p>
        </div>
      </header>

      {/* CONTENIDO DEL ARTÍCULO */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        
        {/* INTRODUCCIÓN */}
        <section className="mb-12 prose prose-slate max-w-none">
          <p className="text-lg">
            ¿Cómo llevas la oposición? La opo de CyL es <strong>unificada</strong>. Esto significa que, en vez de ir convocando plazas en cada municipio (un mareo), agrupan varios ayuntamientos y crean una sola convocatoria.
          </p>
          <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 my-6">
            <p className="font-bold text-yellow-800 mb-2">💡 Dato clave:</p>
            <p className="text-yellow-900 m-0">
              Nos basamos en la última convocatoria de 137 plazas (2024). Si sale una nueva, actualizaremos esta guía rapidísimo.
            </p>
          </div>
        </section>

        {/* AYUNTAMIENTOS */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-700"><MapPin className="h-6 w-6" /></div>
            <h2 className="text-3xl font-bold text-slate-900">Ayuntamientos Incluidos</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { prov: 'Ávila', pueblos: ['Arenas de San Pedro', 'El Hoyo de Pinares', 'Las Navas del Marqués', 'Arévalo'] },
              { prov: 'Burgos', pueblos: ['Burgos capital', 'Medina de Pomar', 'Miranda de Ebro'] },
              { prov: 'León', pueblos: ['Astorga', 'Bembibre', 'San Andrés del Rabanedo', 'Valverde de la Virgen', 'Ponferrada'] },
              { prov: 'Palencia', pueblos: ['Palencia capital', 'Herrera de Pisuerga'] },
              { prov: 'Salamanca', pueblos: ['Peñaranda de Bracamonte', 'Santa Marta de Tormes', 'Villamayor'] },
              { prov: 'Segovia', pueblos: ['Cuéllar', 'El Espinar', 'Segovia capital'] },
              { prov: 'Soria', pueblos: ['El Burgo de Osma'] },
              { prov: 'Valladolid', pueblos: ['Arroyo de la Encomienda', 'Íscar', 'Laguna de Duero', 'Pedrajas', 'Peñafiel', 'Simancas', 'Tordesillas', 'Valladolid', 'Medina del Campo'] },
              { prov: 'Zamora', pueblos: ['Benavente', 'Toro', 'Zamora capital'] },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition">
                <h3 className="font-bold text-blue-700 border-b border-slate-100 pb-2 mb-3">{item.prov}</h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  {item.pueblos.map((p, i) => <li key={i}>• {p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* REQUISITOS */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-lg text-green-700"><CheckCircle className="h-6 w-6" /></div>
            <h2 className="text-3xl font-bold text-slate-900">Requisitos de Acceso</h2>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <ul className="space-y-4">
              <li className="flex gap-3"><span className="font-bold text-slate-900 min-w-[120px]">Edad:</span> <span>Mínimo 18 años. No superar edad jubilación forzosa.</span></li>
              <li className="flex gap-3"><span className="font-bold text-slate-900 min-w-[120px]">Titulación:</span> <span>Bachiller, Técnico o equivalente (Grupo C1).</span></li>
              <li className="flex gap-3"><span className="font-bold text-slate-900 min-w-[120px]">Carnet:</span> <span>Permisos A2 y B en vigor.</span></li>
              <li className="flex gap-3"><span className="font-bold text-slate-900 min-w-[120px]">Altura:</span> <span>Ya no hay requisito de altura mínima en muchas bases, pero revisa la específica.</span></li>
              <li className="flex gap-3"><span className="font-bold text-slate-900 min-w-[120px]">Antecedentes:</span> <span>Carecer de antecedentes por delitos dolosos.</span></li>
              <li className="flex gap-3"><span className="font-bold text-slate-900 min-w-[120px]">Armas:</span> <span>Compromiso de portar armas mediante declaración jurada.</span></li>
            </ul>
            <div className="mt-6 pt-6 border-t border-slate-100 text-sm text-slate-500">
              <p><strong>Nota:</strong> Debes cumplir los requisitos desde el fin del plazo de solicitudes hasta tu nombramiento.</p>
            </div>
          </div>
        </section>

        {/* PRUEBAS FÍSICAS */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-lg text-red-700"><Dumbbell className="h-6 w-6" /></div>
            <h2 className="text-3xl font-bold text-slate-900">Las Pruebas Físicas</h2>
          </div>
          <p className="mb-6 text-slate-600">Todas son eliminatorias (APTO / NO APTO). Aquí tienes las marcas mínimas para el <strong>Turno Libre</strong>:</p>
          
          <div className="space-y-4">
            {/* Salto */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-lg mb-2">1. Salto de Longitud (Pies juntos)</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-50 p-3 rounded-lg"><span className="block text-xs text-slate-500 uppercase">Hombres</span> <strong className="text-red-600">&gt; 2,30 m</strong></div>
                <div className="bg-slate-50 p-3 rounded-lg"><span className="block text-xs text-slate-500 uppercase">Mujeres</span> <strong className="text-red-600">&gt; 1,90 m</strong></div>
              </div>
            </div>

            {/* Balón */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-lg mb-2">2. Lanzamiento Balón Medicinal</h3>
              <p className="text-sm text-slate-500 mb-3">Hombres (5kg) / Mujeres (3kg)</p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-50 p-3 rounded-lg"><span className="block text-xs text-slate-500 uppercase">Hombres</span> <strong className="text-red-600">&gt; 6,25 m</strong></div>
                <div className="bg-slate-50 p-3 rounded-lg"><span className="block text-xs text-slate-500 uppercase">Mujeres</span> <strong className="text-red-600">&gt; 6,25 m</strong></div>
              </div>
            </div>

            {/* Velocidad */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-lg mb-2">3. Velocidad (60 metros lisos)</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-50 p-3 rounded-lg"><span className="block text-xs text-slate-500 uppercase">Hombres</span> <strong className="text-red-600">&lt; 8,6 s</strong></div>
                <div className="bg-slate-50 p-3 rounded-lg"><span className="block text-xs text-slate-500 uppercase">Mujeres</span> <strong className="text-red-600">&lt; 10,4 s</strong></div>
              </div>
            </div>

            {/* Resistencia */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-lg mb-2">4. Resistencia (1000 metros)</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-50 p-3 rounded-lg"><span className="block text-xs text-slate-500 uppercase">Hombres</span> <strong className="text-red-600">&lt; 3:30 min</strong></div>
                <div className="bg-slate-50 p-3 rounded-lg"><span className="block text-xs text-slate-500 uppercase">Mujeres</span> <strong className="text-red-600">&lt; 4:25 min</strong></div>
              </div>
            </div>

            {/* Natación */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-lg mb-2">5. Natación (25 metros libres)</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-50 p-3 rounded-lg"><span className="block text-xs text-slate-500 uppercase">Hombres</span> <strong className="text-red-600">&lt; 21 s</strong></div>
                <div className="bg-slate-50 p-3 rounded-lg"><span className="block text-xs text-slate-500 uppercase">Mujeres</span> <strong className="text-red-600">&lt; 24 s</strong></div>
              </div>
            </div>
          </div>
        </section>

        {/* TEMARIO Y TEÓRICO */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-lg text-purple-700"><BookOpen className="h-6 w-6" /></div>
            <h2 className="text-3xl font-bold text-slate-900">Pruebas Teóricas</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-xl mb-3 text-slate-800">1. Examen Tipo Test</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• 50 preguntas con 4 respuestas.</li>
                <li>• Cada fallo descuenta 0,33 puntos.</li>
                <li>• Tiempo: 60-120 minutos.</li>
                <li>• <strong>Nota mínima: 5.0</strong></li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-xl mb-3 text-slate-800">2. Examen de Desarrollo</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Redactar un tema por escrito.</li>
                <li>• Se valora ortografía, orden y claridad.</li>
                <li>• Tiempo: 60 minutos.</li>
                <li>• Penalización por faltas ortográficas.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-slate-100 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Resumen del Temario (44 Temas)</h3>
            <div className="grid md:grid-cols-2 gap-8 text-sm">
              <div>
                <h4 className="font-bold text-slate-700 mb-2 uppercase tracking-wide">Grupo A (General)</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Constitución Española (Derechos, Corona, Cortes...)</li>
                  <li>Estatuto de Castilla y León.</li>
                  <li>Derecho Administrativo (Ley 39/2015).</li>
                  <li>Régimen Local (Municipios, Provincias).</li>
                  <li>Estatuto Básico del Empleado Público.</li>
                  <li>Fuerzas y Cuerpos de Seguridad.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-700 mb-2 uppercase tracking-wide">Grupo B (Específico)</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Derecho Penal (Homicidio, Lesiones, Libertad...).</li>
                  <li>Violencia de Género.</li>
                  <li>Tráfico y Seguridad Vial (Normativa, Señales, Delitos).</li>
                  <li>Policía Administrativa (Espectáculos, Animales...).</li>
                  <li>Protección Civil y Emergencias.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PSICOTÉCNICOS */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 rounded-lg text-indigo-700"><Brain className="h-6 w-6" /></div>
            <h2 className="text-3xl font-bold text-slate-900">Psicotécnicos</h2>
          </div>
          <p className="mb-4 text-slate-600">No buscan poderes mentales, sino aptitudes para el trabajo policial. Se divide en dos partes:</p>
          <ul className="grid md:grid-cols-2 gap-4">
            <li className="bg-white p-4 border border-slate-200 rounded-lg"><strong>Aptitud:</strong> Razonamiento verbal, abstracto, numérico, memoria visual y resistencia a la fatiga.</li>
            <li className="bg-white p-4 border border-slate-200 rounded-lg"><strong>Personalidad:</strong> Estabilidad emocional, autocontrol, disciplina, autoridad y trabajo en equipo.</li>
          </ul>
        </section>

        {/* TESTIMONIOS Y CTA FINAL */}
        <section className="bg-slate-900 text-white p-8 rounded-3xl text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">¿Lo tienes claro?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            A Pablo G. le funcionó nuestro método: <br/>
            <em className="text-white block mt-2">"Llevo solo 8 meses y he conseguido estar Top 1 en simulacros. Mi tutor Marfil es de las mejores personas para asesorarte."</em>
          </p>
          <button 
            onClick={() => navigate('/registro')} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105"
          >
            Empezar a Estudiar GRATIS Ahora
          </button>
        </section>

      </div>
    </div>
  );
};

export default GuidePage;