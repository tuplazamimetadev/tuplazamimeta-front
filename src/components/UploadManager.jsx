import React, { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, CheckCircle, AlertCircle, AlignLeft, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// AÑADIDO: 'showDescription' para ocultar/mostrar el campo según la página
const UploadManager = ({ userRole, topics, onUploadSuccess, fixedType, fixedTopic, showDescription = false }) => {
    
    // 1. SEGURIDAD
    if (userRole !== 'ADMIN' && userRole !== 'PROFESOR') return null;

    // --- ESTADOS ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(''); 
    const [topicId, setTopicId] = useState('');
    const [type, setType] = useState('PDF');
    
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // --- EFECTO PARA PROPS FIJAS ---
    useEffect(() => {
        if (fixedType) setType(fixedType);
        if (fixedTopic) setTopicId(fixedTopic.id);
    }, [fixedType, fixedTopic]);

    // --- SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!topicId) { setMessage({type: 'error', text: 'Selecciona un tema'}); return; }
        
        setLoading(true);
        setMessage(null);

        const token = localStorage.getItem('jwt_token');

        try {
            let endpoint = '';
            let body = null;
            let headers = { 'Authorization': `Bearer ${token}` };

            // A. JSON (Video/Link)
            if (type === 'VIDEO' || type === 'LINK') {
                endpoint = `${API_URL}/api/materials`; 
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify({
                    title,
                    description, // Se envía aunque esté vacío
                    type,
                    url, 
                    topicId
                });
            } 
            // B. FORMDATA (Archivo)
            else {
                if (!file) throw new Error("Debes seleccionar un archivo");
                endpoint = `${API_URL}/api/materials/upload`; 
                
                const formData = new FormData();
                formData.append('file', file);
                formData.append('title', title);
                formData.append('description', description); // Se envía al back
                formData.append('type', type);
                formData.append('topicId', topicId);
                body = formData;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: body
            });

            if (!response.ok) throw new Error('Error al subir el material');

            setMessage({ type: 'success', text: 'Material agregado correctamente' });
            
            // Limpieza
            setTitle('');
            setDescription('');
            setUrl('');
            setFile(null);
            
            if (onUploadSuccess) onUploadSuccess();

        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: error.message || 'Error desconocido' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 mb-10 animate-fade-in-down">
            <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 pb-4">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Upload className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Panel de Profesor</h3>
                    <p className="text-xs text-slate-500">Añadir nuevo material didáctico</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
                
                {/* 1. TÍTULO */}
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Título del Material</label>
                    <input 
                        type="text" 
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Ej: Tema 1..." 
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    />
                </div>

                {/* 2. DESCRIPCIÓN (CONDICIONAL: Solo si showDescription es true) */}
                {showDescription && (
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Descripción (Opcional)</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Detalles, dificultad, nº preguntas..." 
                                rows="1"
                                className="w-full pl-10 p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none h-[50px]"
                            />
                        </div>
                    </div>
                )}

                {/* 3. TEMA (Se oculta si está fijado) */}
                {!fixedTopic && (
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Asignar al Tema</label>
                        <select 
                            required
                            value={topicId}
                            onChange={e => setTopicId(e.target.value)}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                        >
                            <option value="">-- Elige un Tema --</option>
                            {topics.map(t => (
                                <option key={t.id} value={t.id}>Tema {t.id}: {t.title}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* 4. TIPO (Se oculta si está fijado) */}
                {!fixedType && (
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Recurso</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['PDF', 'TEST', 'VIDEO', 'LINK'].map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`text-xs font-bold py-2 rounded-lg border transition ${type === t ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* AVISO DE CONFIGURACIÓN AUTOMÁTICA */}
                {(fixedType || fixedTopic) && (
                    <div className="col-span-2 bg-blue-50 text-blue-800 text-xs p-3 rounded-xl flex items-center border border-blue-100">
                        <Check className="h-4 w-4 mr-2" />
                        <span>
                            Configuración automática: 
                            {fixedType && <strong className="ml-1">Tipo {fixedType}</strong>}
                            {fixedTopic && <span className="ml-1">en <strong>{fixedTopic.title}</strong></span>}
                        </span>
                    </div>
                )}

                {/* 5. ARCHIVO / URL */}
                <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        {type === 'VIDEO' || type === 'LINK' ? 'Enlace (URL)' : 'Subir Archivo (PDF)'}
                    </label>
                    
                    {type === 'VIDEO' || type === 'LINK' ? (
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                            <input 
                                type="url" 
                                required
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                placeholder="https://youtube.com/..." 
                                className="w-full pl-10 p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                            />
                        </div>
                    ) : (
                        <div className="relative">
                            <input 
                                type="file" 
                                required
                                onChange={e => setFile(e.target.files[0])}
                                accept=".pdf" 
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <p className="text-[10px] text-slate-400 mt-1 ml-1">
                                {type === 'TEST' ? 'Sube el examen en formato PDF.' : 'Sube el documento PDF.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* BOTÓN */}
                <div className="col-span-2 mt-2">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-bold text-white transition shadow-lg ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1'}`}
                    >
                        {loading ? 'Subiendo...' : 'Publicar Material'}
                    </button>
                </div>

                {/* MENSAJES */}
                {message && (
                    <div className={`col-span-2 p-3 rounded-xl flex items-center text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.type === 'success' ? <CheckCircle className="mr-2 h-5 w-5"/> : <AlertCircle className="mr-2 h-5 w-5"/>}
                        {message.text}
                    </div>
                )}

            </form>
        </div>
    );
};

export default UploadManager;