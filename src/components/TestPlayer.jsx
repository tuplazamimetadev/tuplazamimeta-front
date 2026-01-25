import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';

const TestPlayer = ({ fileUrl, onClose }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [history, setHistory] = useState([]); // Guardar qué respondió en cada una

    // 1. Cargar el JSON al abrir
    useEffect(() => {
        fetch(fileUrl)
            .then(res => res.json())
            .then(data => {
                setQuestions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando test", err);
                alert("Error al cargar el archivo del test.");
                onClose();
            });
    }, [fileUrl, onClose]);

    // 2. Manejar clic en una opción
    const handleOptionClick = (optionIndex) => {
        if (isAnswered) return; // No dejar cambiar si ya respondió

        setSelectedOption(optionIndex);
        setIsAnswered(true);

        const currentQ = questions[currentIndex];
        const isCorrect = optionIndex === currentQ.correctAnswer;

        if (isCorrect) {
            setScore(score + 1);
        }

        // Guardar historial para revisión final si quisieras
        setHistory([...history, { q: currentIndex, selected: optionIndex, correct: isCorrect }]);
    };

    // 3. Pasar a la siguiente
    const handleNext = () => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    if (loading) return <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center text-white">Cargando Test...</div>;

    // --- VISTA DE RESULTADOS ---
    if (showResult) {
        const percentage = Math.round((score / questions.length) * 10);
        return (
            <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white rounded-3xl max-w-lg w-full p-8 text-center relative shadow-2xl">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X /></button>
                    
                    <div className="mb-6">
                        {percentage >= 5 ? 
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-12 h-12"/></div> :
                            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><XCircle className="w-12 h-12"/></div>
                        }
                        <h2 className="text-3xl font-bold text-slate-800">Has sacado un {percentage}</h2>
                        <p className="text-slate-500 mt-2">Aciertos: {score} de {questions.length}</p>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button onClick={onClose} className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition">Salir</button>
                        <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold transition flex items-center gap-2"><RefreshCw className="w-4 h-4"/> Repetir</button>
                    </div>
                </div>
            </div>
        );
    }

    // --- VISTA DE PREGUNTA ---
    const currentQ = questions[currentIndex];

    return (
        <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
            <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-500 uppercase text-xs tracking-wider">Pregunta {currentIndex + 1}/{questions.length}</span>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition"><X className="w-5 h-5 text-slate-500"/></button>
                </div>

                {/* Pregunta */}
                <div className="p-8 overflow-y-auto">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
                        {currentQ.question}
                    </h3>

                    <div className="space-y-3">
                        {currentQ.options.map((option, idx) => {
                            // Lógica de colores
                            let btnClass = "w-full p-4 rounded-xl border-2 text-left font-medium transition flex items-center justify-between group ";
                            
                            if (isAnswered) {
                                if (idx === currentQ.correctAnswer) btnClass += "bg-green-50 border-green-500 text-green-700 ";
                                else if (idx === selectedOption) btnClass += "bg-red-50 border-red-500 text-red-700 ";
                                else btnClass += "border-slate-100 text-slate-400 opacity-50 ";
                            } else {
                                btnClass += "border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700 ";
                            }

                            return (
                                <button 
                                    key={idx} 
                                    onClick={() => handleOptionClick(idx)}
                                    disabled={isAnswered}
                                    className={btnClass}
                                >
                                    <span>{option}</span>
                                    {isAnswered && idx === currentQ.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600"/>}
                                    {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle className="w-5 h-5 text-red-600"/>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Explicación (Solo si ya respondió) */}
                    {isAnswered && currentQ.explanation && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800 text-sm flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p>{currentQ.explanation}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button 
                        onClick={handleNext} 
                        disabled={!isAnswered}
                        className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {currentIndex + 1 === questions.length ? 'Finalizar' : 'Siguiente'} <ArrowRight className="w-4 h-4"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestPlayer;