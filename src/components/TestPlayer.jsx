import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, ArrowRight, ArrowLeft, RefreshCw, Calculator, HelpCircle } from 'lucide-react';

const TestPlayer = ({ fileUrl, directQuestions, onClose }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { 0: 'A', 1: 2, ... }
    const [showResult, setShowResult] = useState(false);

    // --- 1. CARGA Y NORMALIZACIÓN DE DATOS ---
    useEffect(() => {
        const load = async () => {
            try {
                let normalized = [];

                if (directQuestions) {
                    // MODO NUEVO: Preguntas directas del Backend (Aleatorias)
                    // Estructura esperada: { id, statement, optionA... correctOption: 'A' }
                    normalized = directQuestions.map(q => ({
                        id: q.id,
                        text: q.statement,
                        options: [
                            { id: 'A', text: q.optionA },
                            { id: 'B', text: q.optionB },
                            { id: 'C', text: q.optionC },
                            { id: 'D', text: q.optionD }
                        ],
                        correctId: q.correctOption, // 'A', 'B', 'C', 'D'
                        explanation: q.explanation
                    }));
                } else if (fileUrl) {
                    // MODO ANTIGUO: Archivos JSON estáticos
                    // Estructura esperada: { question, options: [], correctAnswer: 0 }
                    const res = await fetch(fileUrl);
                    const rawData = await res.json();
                    
                    normalized = rawData.map((q, idx) => ({
                        id: idx,
                        text: q.question,
                        options: q.options.map((opt, i) => ({ id: i, text: opt })), // id será 0,1,2,3
                        correctId: q.correctAnswer, // id será 0,1,2,3
                        explanation: q.explanation
                    }));
                }

                setQuestions(normalized);
                setLoading(false);
            } catch (err) {
                console.error("Error cargando test", err);
                alert("Error al cargar las preguntas.");
                onClose();
            }
        };
        load();
    }, [fileUrl, directQuestions, onClose]);

    // --- 2. LÓGICA DE JUEGO ---
    
    // Marcar/Desmarcar respuesta (Permite dejar en blanco)
    const toggleAnswer = (qIndex, optionId) => {
        if (showResult) return; // Bloqueado si ya terminó

        setAnswers(prev => {
            const current = prev[qIndex];
            if (current === optionId) {
                // Si ya estaba marcada, la desmarcamos (se queda en blanco)
                const copy = { ...prev };
                delete copy[qIndex];
                return copy;
            }
            // Si no, marcamos la nueva
            return { ...prev, [qIndex]: optionId };
        });
    };

    // Navegación
    const handleNext = () => {
        if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
        else setShowResult(true); // Si es la última, mostramos resultados
    };

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    // --- 3. CÁLCULO DE NOTA (Regla -0.25) ---
const calculateStats = () => {
        let correct = 0;
        let incorrect = 0;
        let blank = 0;

        questions.forEach((q, idx) => {
            const ans = answers[idx];
            
            if (ans === undefined || ans === null) {
                blank++;
            } else if (ans === q.correctId) {
                correct++;
            } else {
                incorrect++;
            }
        });

        const totalQuestions = questions.length;
        
        const valuePerQuestion = 10 / totalQuestions;
        const penalty = valuePerQuestion / 3;

        // Nota = (Aciertos * Valor) - (Fallos * Penalización)
        const rawScore = (correct * valuePerQuestion) - (incorrect * penalty);
        const finalScore = Math.max(0, rawScore); // No bajamos de 0

        return { correct, incorrect, blank, note: finalScore };
    };

    if (loading) return <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center text-white font-bold animate-pulse">Cargando test...</div>;

    // --- VISTA DE RESULTADOS (CORRECCIÓN) ---
    if (showResult) {
        const stats = calculateStats();
        
        return (
            <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
                <div className="bg-white rounded-3xl max-w-4xl w-full p-8 relative shadow-2xl my-8 border border-slate-200">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition"><X className="w-5 h-5 text-slate-500"/></button>
                    
                    {/* ENCABEZADO DE RESULTADOS */}
                    <div className="text-center mb-8 border-b border-slate-100 pb-8">
                        <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full text-4xl font-black mb-4 shadow-xl border-4 ${stats.note >= 5 ? 'bg-green-600 border-green-400 text-white' : 'bg-red-600 border-red-400 text-white'}`}>
                            {stats.note.toFixed(2)}
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Resultado Final</h2>
                        <p className="text-slate-500 text-sm mt-1 uppercase tracking-wider">Nota sobre 10</p>
                        
                        <div className="grid grid-cols-3 gap-4 mt-6 max-w-lg mx-auto">
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                <p className="text-green-700 font-bold text-2xl">{stats.correct}</p>
                                <p className="text-green-600 text-[10px] uppercase font-bold">Aciertos (+0.20)</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                <p className="text-red-700 font-bold text-2xl">{stats.incorrect}</p>
                                <p className="text-red-600 text-[10px] uppercase font-bold">Fallos (-0.066)</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-slate-700 font-bold text-2xl">{stats.blank}</p>
                                <p className="text-slate-500 text-[10px] uppercase font-bold">En blanco (0)</p>
                            </div>
                        </div>
                    </div>

                    {/* LISTADO DE PREGUNTAS CORREGIDAS */}
                    <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                        {questions.map((q, idx) => {
                            const userAns = answers[idx];
                            const isCorrect = userAns === q.correctId;
                            const isBlank = userAns === undefined || userAns === null;
                            const userOpt = q.options.find(o => o.id === userAns);
                            const correctOpt = q.options.find(o => o.id === q.correctId);

                            let statusClass = "border-slate-200 bg-slate-50";
                            if (!isBlank) {
                                statusClass = isCorrect ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50";
                            }

                            return (
                                <div key={idx} className={`p-5 rounded-2xl border-2 ${statusClass} text-left transition hover:shadow-sm`}>
                                    <div className="flex items-start gap-3 mb-3">
                                        <span className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-md mt-0.5">#{idx + 1}</span>
                                        <h4 className="font-bold text-slate-800 text-sm md:text-base flex-1">{q.text}</h4>
                                    </div>

                                    <div className="text-sm space-y-2 ml-10">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-500 text-xs uppercase w-24">Tu respuesta:</span>
                                            {isBlank ? (
                                                <span className="text-slate-400 italic flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200"><HelpCircle className="w-3 h-3"/> En blanco</span>
                                            ) : (
                                                <span className={`font-bold flex items-center gap-1 px-2 py-1 rounded border ${isCorrect ? 'text-green-700 bg-green-100 border-green-200' : 'text-red-700 bg-red-100 border-red-200'}`}>
                                                    {isCorrect ? <CheckCircle className="w-3 h-3"/> : <XCircle className="w-3 h-3"/>}
                                                    {userOpt?.text}
                                                </span>
                                            )}
                                        </div>
                                        {!isCorrect && (
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-500 text-xs uppercase w-24">Correcta:</span>
                                                <span className="font-bold text-green-700 flex items-center gap-1 bg-green-100 px-2 py-1 rounded border border-green-200">
                                                    <CheckCircle className="w-3 h-3"/>
                                                    {correctOpt?.text}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {q.explanation && (
                                        <div className="mt-4 ml-10 p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 shadow-sm">
                                            <strong className="text-blue-600">💡 Explicación:</strong> {q.explanation}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 flex justify-center gap-4 pt-4 border-t border-slate-100">
                        <button onClick={onClose} className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition">
                            Salir
                        </button>
                        <button onClick={() => {
                            setAnswers({});
                            setShowResult(false);
                            setCurrentIndex(0);
                        }} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            <RefreshCw className="w-4 h-4"/> Repetir Test
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- VISTA DE PREGUNTA ACTIVA (SIMULACRO) ---
    const currentQ = questions[currentIndex];
    const isLast = currentIndex === questions.length - 1;

    return (
        <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
            <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col h-[85vh] relative">
                
                {/* Header */}
                <div className="bg-slate-50 p-4 md:p-6 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="bg-slate-200 text-slate-700 font-bold px-3 py-1 rounded-full text-xs">
                            {currentIndex + 1} / {questions.length}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">
                            Acierto +0,20 | Fallo -0.066
                        </span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition text-slate-400">
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                {/* Área de Pregunta (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-8 leading-relaxed">
                        {currentQ.text}
                    </h3>

                    <div className="space-y-3">
                        {currentQ.options.map((option) => {
                            const isSelected = answers[currentIndex] === option.id;
                            return (
                                <button 
                                    key={option.id} 
                                    onClick={() => toggleAnswer(currentIndex, option.id)}
                                    className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all flex items-center gap-4 group relative overflow-hidden
                                        ${isSelected 
                                            ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md transform scale-[1.01]' 
                                            : 'border-slate-100 hover:border-blue-300 hover:bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                                        ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                                        {isSelected && <div className="w-2 h-2 bg-white rounded-full animate-in zoom-in" />}
                                    </div>
                                    <span className="text-sm md:text-base relative z-10">{option.text}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer de Navegación */}
                <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                    <button 
                        onClick={handlePrev} 
                        disabled={currentIndex === 0}
                        className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-200 hover:text-slate-700 rounded-lg transition disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4"/> Anterior
                    </button>

                    {/* Indicador de estado */}
                    <div className="hidden md:block text-xs font-bold uppercase tracking-wider">
                        {answers[currentIndex] !== undefined 
                            ? <span className="text-blue-600 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Respondida</span> 
                            : <span className="text-slate-400 flex items-center gap-1"><HelpCircle className="w-3 h-3"/> En blanco</span>
                        }
                    </div>

                    <button 
                        onClick={handleNext} 
                        className={`px-6 py-3 font-bold rounded-xl shadow-lg transition flex items-center gap-2 text-white
                            ${isLast ? 'bg-green-600 hover:bg-green-700 hover:scale-105' : 'bg-slate-900 hover:bg-blue-600'}`}
                    >
                        {isLast ? 'Corregir Test' : 'Siguiente'} 
                        {isLast ? <Calculator className="w-4 h-4"/> : <ArrowRight className="w-4 h-4"/>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestPlayer;