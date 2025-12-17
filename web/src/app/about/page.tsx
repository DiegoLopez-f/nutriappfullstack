"use client";

import React from 'react';

// Definimos la estructura de los datos que recibe el componente
interface TeamMemberProps {
    name: string;
    role: string;
    avatarUrl: string;
}

export default function AboutUs() {
    return (
        <div className="min-h-screen pt-16 pb-12 flex flex-col items-center p-4">
            <main className="w-full max-w-4xl space-y-12">

                {/* Header */}
                <header className="text-center mb-12 border-b border-foreground/10 pb-4">
                    <h1 className="text-5xl font-bold tracking-tight mb-2">
                        Acerca de NutriAPP
                    </h1>
                    <p className="text-xl text-foreground/70">
                        Plataforma moderna y profesional para la gestión de planes nutricionales.
                    </p>
                </header>

                {/* Misión */}
                <section className="bg-white text-gray-900 shadow-xl rounded-xl p-8 transition duration-300 hover:shadow-2xl border border-gray-200">
                    <h2 className="text-3xl font-semibold mb-4 text-center">
                        Nuestra Misión: Nutrición Personalizada
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-700">
                        NutriAPP es una plataforma moderna y profesional diseñada para optimizar la gestión de planes
                        nutricionales tanto para profesionales como para usuarios finales.
                        Nuestro compromiso es hacer que el seguimiento de la salud y la dieta sea simple y efectivo.
                        Personaliza tus planes con facilidad, realiza un seguimiento efectivo de tu progreso diario y
                        mantente conectado con tus objetivos de bienestar.
                    </p>
                    <p className="mt-4 text-sm text-center text-gray-500">
                        Tecnología al servicio de una vida más saludable.
                    </p>
                </section>

                {/* Valores */}
                <section className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200">
                        <div className="text-4xl mb-3">🛠️</div>
                        <h3 className="text-xl font-semibold mb-2">Innovación Constante</h3>
                        <p className="text-sm text-gray-700">
                            Siempre buscamos las mejores y más eficientes soluciones para el futuro.
                        </p>
                    </div>

                    <div className="p-6 bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200">
                        <div className="text-4xl mb-3">🤝</div>
                        <h3 className="text-xl font-semibold mb-2">Transparencia</h3>
                        <p className="text-sm text-gray-700">
                            Creemos en la comunicación abierta y honesta con nuestra comunidad.
                        </p>
                    </div>

                    <div className="p-6 bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200">
                        <div className="text-4xl mb-3">🌟</div>
                        <h3 className="text-xl font-semibold mb-2">Impacto Positivo</h3>
                        <p className="text-sm text-gray-700">
                            Nuestro objetivo es dejar una huella positiva en el mundo digital y en nuestros usuarios.
                        </p>
                    </div>
                </section>

                {/* Equipo */}
                <section className="bg-white text-gray-900 shadow-xl rounded-xl p-8 border border-gray-200">
                    <h2 className="text-3xl font-semibold mb-6 text-center">
                        Conoce al Equipo
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
                        <TeamMember
                            name="Diego López"
                            role="CEO & Fundador"
                            avatarUrl="https://placehold.co/100x100/171717/ffffff?text=DL"
                        />
                        <TeamMember
                            name="Kevin Henriquez"
                            role="Jefe de Tecnología"
                            avatarUrl="https://placehold.co/100x100/171717/ffffff?text=KH"
                        />
                        <TeamMember
                            name="Christian Pérez"
                            role="Diseñador Principal"
                            avatarUrl="https://placehold.co/100x100/171717/ffffff?text=CP"
                        />
                    </div>
                    <p className="mt-8 text-center text-gray-500">
                        Somos un grupo de apasionados por la tecnología y la comunidad.
                    </p>
                </section>

            </main>
        </div>
    );
}

// CORRECCIÓN APLICADA AQUÍ: Tipado explícito de las props
const TeamMember = ({ name, role, avatarUrl }: TeamMemberProps) => (
    <div className="flex flex-col items-center text-center">
        <img
            src={avatarUrl}
            alt={`Avatar de ${name}`}
            className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-gray-200"
            onError={(e) => {
                const target = e.target as HTMLImageElement; // Tipado del evento
                target.onerror = null;
                target.src = "https://placehold.co/100x100/94a3b8/0f172a?text=👤";
            }}
        />
        <p className="font-semibold text-base">{name}</p>
        <p className="text-xs text-gray-600">{role}</p>
    </div>
);