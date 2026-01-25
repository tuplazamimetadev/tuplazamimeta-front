import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    CheckCircle, Video, FileText, Link as LinkIcon, File, Play, Download, Lock, Layers, Trash2, Brain
} from 'lucide-react';

import UploadManager from '../components/UploadManager';
// IMPORTANTE: Asegúrate de tener este componente creado en la ruta correcta
import TestPlayer from '../components/TestPlayer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const DownloadsPage = () => {
    const navigate = useNavigate();

    // --- ESTADOS ---
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // --- NUEVO ESTADO: CONTROL DEL PLAYER ---
    const [activeTestUrl, setActiveTestUrl] = useState(null);

    // Estado inicial de usuario
    const [userData, setUserData] = useState({
        name: 'Cargando...',
        email: '',
        role: 'Estudiante',
        expiration: null
    });

    // --- FUNCIÓN PARA CARGAR CONTENIDOS (CON FILTRO) ---
    const fetchContents = () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        fetch(`${API_URL}/api/contents`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                const filteredData = data.filter(topic =>
                    !topic.title.toUpperCase().includes("TESTS GENERALES") &&
                    !topic.title.toUpperCase().includes("SIMULACROS")
                );

                setContents(filteredData);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    // --- FUNCIÓN PARA BORRAR MATERIAL ---
    const handleDeleteMaterial = async (e, materialId) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm("¿Estás seguro de que quieres eliminar este material?")) return;

        const token = localStorage.getItem('jwt_token');

        try {
            const res = await fetch(`${API_URL}/api/materials/${materialId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                setContents(prevContents => {
                    return prevContents.map(topic => {
                        if (topic.materials) {
                            return {
                                ...topic,
                                materials: topic.materials.filter(m => m.id !== materialId)
                            };
                        }
                        return topic;
                    });
                });
                fetchContents(); // Recargar por si acaso
            } else {
                alert("Error al eliminar");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    };

    // --- EFECTO INICIAL ---
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (!token) { navigate('/login'); return; }

        fetch(`${API_URL}/api/users/me`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                setUserData({
                    name: data.name,
                    email: data.email,
                    role: data.role || 'Estudiante',
                    expiration: data.expiration
                });

                if (data.role === 'SUPUESTOS') {
                    navigate('/supuestos');
                }
            })
            .catch(() => setUserData(prev => ({ ...prev, name: 'Alumno', role: 'Sin Plan' })));

        fetchContents();
    }, [navigate]);

    // --- HELPERS VISUALES ---
    const getIcon = (file) => {
        // Lógica para detectar JSON interactivo
        if (file.url && file.url.toLowerCase().endsWith('.json')) {
            return <Brain className="h-6 w-6" />;
        }

        const safeType = file.type ? file.type.toUpperCase() : 'PDF';
        switch (safeType) {
            case 'PDF': return <FileText className="h-6 w-6" />;
            case 'WORD': return <FileText className="h-6 w-6" />;
            case 'VIDEO': return <Video className="h-6 w-6" />;
            case 'TEST': return <CheckCircle className="h-6 w-6" />;
            case 'LINK': return <LinkIcon className="h-6 w-6" />;
            default: return <File className="h-6 w-6" />;
        }
    };

    // --- PERMISOS ---
    const canEdit = userData.role === 'ADMIN' || userData.role === 'PROFESOR';

    // --- FILTRADO Y AGRUPACIÓN ---
    const filteredContents = contents.filter(topic => {
        const term = searchTerm.toLowerCase();
        return topic.title.toLowerCase().includes(term) || 
               (topic.description && topic.description.toLowerCase().includes(term));
    });

    const groupA = filteredContents.filter(t => t.title.startsWith('A.'));
    const groupB = filteredContents.filter(t => t.title.startsWith('B.'));
    const others = filteredContents.filter(t => !t.title.startsWith('A.') && !t.title.startsWith('B.'));

    // Helper para renderizar una lista de temas
    const renderTopics = (topicList) => (
        <div className="space-y-10">
            {topicList.map((topic) => (
                <div key={topic.id} className="animate-fade-in-up">
                    <div className="flex items-center mb-6 border-b border-slate-200 pb-2">
                        <div className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold mr-4 text-lg shadow-md">
                            {topic.title.includes(' - ') ? topic.title.split(' - ')[0].replace(/[AB]\./, '') : topic.id}
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                                {topic.title.includes(' - ') ? topic.title.split(' - ')[1] : topic.title}
                            </h2>
                            <p className="text-slate-500 text-sm hidden md:block">{topic.description}</p>
                        </div>
                        {topic.isPremium && <span className="ml-auto bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm"><Lock className="h-3 w-3 mr-1" /> PREMIUM</span>}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                        {topic.materials && topic.materials.map((file) => {
                            // DETECTAR SI ES JSON (Test Interactivo)
                            const isInteractive = file.url && file.url.toLowerCase().endsWith('.json');

                            return (
                                <div key={file.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-lg hover:border-blue-200 transition duration-300 transform hover:-translate-y-1 group">
                                    <div className="flex items-center space-x-4 mb-4 sm:mb-0 overflow-hidden">
                                        {/* Color del icono según tipo */}
                                        <div className={`p-3 rounded-xl flex-shrink-0 transition group-hover:scale-110 ${
                                            isInteractive ? 'bg-purple-100 text-purple-600' :
                                            file.type === 'PDF' ? 'bg-red-50 text-red-600' :
                                            file.type === 'VIDEO' ? 'bg-purple-50 text-purple-600' :
                                            file.type === 'TEST' ? 'bg-green-50 text-green-600' :
                                            file.type === 'WORD' ? 'bg-blue-50 text-blue-600' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {getIcon(file)}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-800 text-base truncate pr-2 group-hover:text-blue-700 transition">{file.title}</h3>
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                                                <span className={`px-2 py-0.5 rounded uppercase font-bold tracking-wider text-[10px] ${isInteractive ? 'bg-purple-100 text-purple-700' : 'bg-slate-100'}`}>
                                                    {isInteractive ? 'TEST INTERACTIVO' : file.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {/* LÓGICA DE BOTÓN: Si es JSON -> Hacer Test, Si no -> Bajar/Ver */}
                                        {isInteractive ? (
                                            <button 
                                                onClick={() => setActiveTestUrl(file.url)}
                                                className="text-white bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center whitespace-nowrap shadow-md shadow-purple-200"
                                            >
                                                <Brain className="h-4 w-4 mr-2" /> Hacer Test
                                            </button>
                                        ) : (
                                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center whitespace-nowrap">
                                                {file.type === 'VIDEO' || file.type === 'LINK' ? <><Play className="h-4 w-4 mr-2" /> Ver</> : <><Download className="h-4 w-4 mr-2" /> Bajar</>}
                                            </a>
                                        )}

                                        {canEdit && (
                                            <button
                                                type="button"
                                                onClick={(e) => handleDeleteMaterial(e, file.id)}
                                                className="text-red-500 bg-red-50 hover:bg-red-500 hover:text-white p-2.5 rounded-xl transition shadow-sm cursor-pointer"
                                                title="Eliminar material"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {(!topic.materials || topic.materials.length === 0) && <div className="col-span-2 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-400 italic text-sm">No hay materiales disponibles.</div>}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
            {/* Pasamos onSearch para conectar el buscador del Navbar */}
            <Navbar user={userData} activePage="temario" onSearch={setSearchTerm} />

            {/* --- PLAYER DE TESTS (MODAL) --- */}
            {activeTestUrl && (
                <TestPlayer 
                    fileUrl={activeTestUrl} 
                    onClose={() => setActiveTestUrl(null)} 
                />
            )}

            <div className="container mx-auto px-6 py-12">
                <div className="mb-10 animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-slate-900">Material Didáctico</h1>
                    <p className="text-slate-600 mt-2">Todo el contenido de tu curso, actualizado al minuto.</p>
                </div>

                <UploadManager
                    userRole={userData.role}
                    topics={contents}
                    onUploadSuccess={fetchContents}
                />

                {loading && <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div><p className="text-slate-500">Cargando tu temario...</p></div>}

                {!loading && (
                    <div className="max-w-6xl mx-auto">
                        
                        {/* Aviso si buscamos algo y no hay nada */}
                        {filteredContents.length === 0 && searchTerm !== '' && (
                            <div className="text-center py-10 text-slate-500 bg-white rounded-xl border border-slate-100 shadow-sm mb-8">
                                <p>No hemos encontrado temas que coincidan con <strong>"{searchTerm}"</strong>.</p>
                                <button onClick={() => setSearchTerm('')} className="mt-2 text-blue-600 text-sm font-bold hover:underline">Limpiar búsqueda</button>
                            </div>
                        )}

                        {groupA.length > 0 && (
                            <div className="mb-12">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-500">
                                    <Layers className="h-8 w-8 text-blue-500" />
                                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                                        Grupo A: Materias Comunes
                                    </h2>
                                </div>
                                {renderTopics(groupA)}
                            </div>
                        )}

                        {groupB.length > 0 && (
                            <div className="mb-12">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-indigo-500">
                                    <Layers className="h-8 w-8 text-indigo-500" />
                                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                                        Grupo B: Materias Específicas
                                    </h2>
                                </div>
                                {renderTopics(groupB)}
                            </div>
                        )}

                        {others.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-black text-slate-400 mb-6 pb-2 border-b-4 border-slate-300 inline-block uppercase tracking-tight">
                                    Material Adicional
                                </h2>
                                {renderTopics(others)}
                            </div>
                        )}

                        {/* Mensaje original de lista vacía si no hay nada cargado */}
                        {contents.length === 0 && !loading && (
                            <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                <p className="text-slate-400 font-medium">No hay contenido disponible.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DownloadsPage;