'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "¿Cómo se calculan mis requerimientos calóricos?",
        answer: "Utilizamos fórmulas estandarizadas basadas en tu tasa metabólica basal (TMB) y nivel de actividad física, ajustadas por tu nutricionista según tu objetivo específico (volumen, definición o mantenimiento)."
    },
    {
        question: "¿Puedo cambiar mi objetivo después de registrarme?",
        answer: "Sí, puedes actualizar tu peso y preferencias en tu perfil. Sin embargo, para cambios drásticos en el plan (ej. pasar de definición a volumen), te recomendamos contactar a tu nutricionista para que ajuste tus macros."
    },
    {
        question: "¿Qué hago si tengo alergias alimentarias?",
        answer: "Es vital que registres tus alergias en tu perfil. El sistema alertará al nutricionista y filtraremos sugerencias de alimentos para evitar ingredientes peligrosos para ti."
    },
    {
        question: "¿Con qué frecuencia se actualizan los planes?",
        answer: "Depende de tu progreso. Generalmente, los nutricionistas revisan los resultados cada 2 a 4 semanas. Si sientes que tu plan actual no funciona, puedes solicitar una revisión antes."
    },
    {
        question: "¿La información de farmacias es en tiempo real?",
        answer: "Sí, nos conectamos directamente con la base de datos del MINSAL para mostrarte las farmacias de turno disponibles en tu comuna al momento de la consulta."
    }
];

export default function FAQ() {
    // Estado para manejar qué pregunta está abierta
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="max-w-3xl w-full space-y-8">

                {/* Encabezado */}
                <div className="text-center space-y-4">
                    <div className="inline-block p-3 bg-green-100 rounded-full mb-2">
                        <QuestionMarkCircleIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Preguntas Frecuentes
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Resolvemos tus dudas principales sobre el funcionamiento de NutriApp y la gestión de tus planes.
                    </p>
                </div>

                {/* Lista de FAQs */}
                <div className="space-y-4 mt-8">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                                openIndex === index
                                    ? 'border-green-200 bg-green-50/30 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-green-200'
                            }`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
                            >
                                <span className={`font-semibold text-lg ${openIndex === index ? 'text-green-800' : 'text-gray-700'}`}>
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUpIcon className="w-5 h-5 text-green-600" />
                                ) : (
                                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                )}
                            </button>

                            {/* Respuesta desplegable */}
                            <div
                                className={`transition-all duration-300 ease-in-out ${
                                    openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-green-100/50">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer de contacto */}
                <div className="text-center pt-8">
                    <p className="text-gray-500">
                        ¿No encuentras lo que buscas?{" "}
                        <a href="mailto:soporte@nutriapp.com" className="text-green-600 font-semibold hover:underline">
                            Contáctanos
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
}