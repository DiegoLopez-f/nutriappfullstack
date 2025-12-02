'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api } from '@/lib/api';
import {
    ClipboardDocumentCheckIcon,
    HeartIcon,
    ChartBarIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

import DashboardPaciente from '@/components/paciente/Dashboard';
import DashboardNutricionista from '@/components/nutricionista/Dashboard';

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [perfil, setPerfil] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                const dataPerfil = await api.getPerfil();
                setPerfil(dataPerfil);
            } catch (error) {
                console.error("Error cargando perfil:", error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
                <p className="mt-4 text-green-700 font-medium animate-pulse">Cargando NutriApp...</p>
            </div>
        );
    }

    if (!perfil) {
        // --- FOYER / LANDING PAGE RESTAURADO ---
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">

                {/* Hero Section */}
                <div className="flex-grow flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto space-y-8">

                        {/* Logo Badge */}
                        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-green-100 mb-4">
                            <span className="text-3xl">🥑</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                            Tu salud, <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                                simplificada.
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Gestiona tus planes de alimentación, sigue tu progreso y encuentra farmacias de turno en un solo lugar.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <button
                                onClick={() => router.push('/registro')}
                                className="px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                Empezar ahora
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => router.push('/Login')}
                                className="px-8 py-4 bg-white text-gray-700 text-lg font-bold rounded-xl shadow-sm border border-gray-200 hover:border-green-300 hover:text-green-700 transition-all duration-200"
                            >
                                Ya tengo cuenta
                            </button>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full px-4">
                        <FeatureCard
                            icon={<ClipboardDocumentCheckIcon className="w-8 h-8 text-blue-500" />}
                            title="Planes Personalizados"
                            desc="Dietas adaptadas a tus objetivos de volumen o definición."
                            color="bg-blue-50"
                        />
                        <FeatureCard
                            icon={<ChartBarIcon className="w-8 h-8 text-green-500" />}
                            title="Seguimiento Real"
                            desc="Monitorea tus macros y progreso día a día."
                            color="bg-green-50"
                        />
                        <FeatureCard
                            icon={<HeartIcon className="w-8 h-8 text-red-500" />}
                            title="Farmacias de Turno"
                            desc="Información actualizada del MINSAL al instante."
                            color="bg-red-50"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Router de Roles
    if (perfil.tipo === 1) {
        return <DashboardNutricionista />;
    } else {
        return <DashboardPaciente perfilInicial={perfil} />;
    }
}

// Componente visual para las tarjetas del Home
const FeatureCard = ({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-200 text-left">
        <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-4`}>
            {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
);