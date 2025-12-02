'use client';

import React from 'react'; // Importación explícita de React
import Link from 'next/link';
import { WrenchScrewdriverIcon, ArrowLeftIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import { use } from 'react'; // Necesario para desenrollar params en Next.js 15+ (si usas una versión reciente)

// En Next.js 13/14/15 las props de página son promesas o objetos directos dependiendo de la versión.
// Esta forma es segura y estándar:
export default function ProgresoPage({ params }: { params: Promise<{ uid: string }> }) {
    // Desenrollamos los params (Next.js moderno maneja params como promesa en componentes de servidor/mixtos)
    const { uid } = use(params);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-green-100 max-w-lg w-full relative overflow-hidden">

                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-16 -mt-16 opacity-50"></div>

                <div className="relative z-10">
                    <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <ChartBarIcon className="w-12 h-12 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">
                        Módulo en <span className="text-green-600">Construcción</span>
                    </h1>

                    <div className="flex justify-center items-center gap-2 text-amber-500 font-bold text-sm mb-6 bg-amber-50 py-1 px-3 rounded-full w-fit mx-auto">
                        <WrenchScrewdriverIcon className="w-4 h-4" />
                        <span>Próximamente</span>
                    </div>

                    <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                        Estamos preparando una herramienta avanzada para que puedas visualizar la evolución de peso, medidas y cumplimiento de objetivos del paciente.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-8 text-xs text-gray-400 font-mono border border-gray-100">
                        ID Paciente: {uid}
                    </div>

                    <Link href="/">
                        <button className="flex items-center justify-center gap-2 w-full bg-green-600 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200 hover:-translate-y-1">
                            <ArrowLeftIcon className="w-5 h-5" />
                            Volver al Dashboard
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}