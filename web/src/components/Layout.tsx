'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
    ArrowRightOnRectangleIcon,
    UserCircleIcon,
    HeartIcon
} from '@heroicons/react/24/solid';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/Login');
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
    };

    const isAuthPage = pathname === '/Login' || pathname === '/registro';

    if (isAuthPage) {
        return <>{children}</>;
    }

    const footerLinks = [
        { title: 'Nosotros', href: '/about' },
        { title: 'Ayuda', href: '/faq' },
        { title: 'Privacidad', href: '/privacidad' },
        { title: 'Términos', href: '/terms' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* --- HEADER --- */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo con Nutria */}
                        <Link href="/" className="flex items-center gap-3 group">
                            {/* CAMBIO 1: Emoji de Nutria */}
                            <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200">
                                🦦
                            </span>
                            <span className="text-2xl font-black text-gray-800 tracking-tighter">
                                Nutri<span className="text-green-600">App</span>
                            </span>
                        </Link>

                        {/* Menú Derecho (Cápsula Unificada) */}
                        <div className="flex items-center">
                            {!loading && (
                                <>
                                    {user ? (
                                        // LOGUEADO
                                        <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 pl-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 mr-3">
                                                <UserCircleIcon className="w-5 h-5 text-gray-400" />
                                                <span className="truncate max-w-[150px] font-medium">{user.email}</span>
                                            </div>
                                            <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block"></div>
                                            <div className="flex items-center gap-1">
                                                <Link href="/farmacias" title="Farmacias de Turno">
                                                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-full transition relative group">
                                                        <HeartIcon className="w-6 h-6 animate-pulse" />
                                                    </button>
                                                </Link>
                                                <button onClick={handleLogout} title="Cerrar Sesión" className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-full transition">
                                                    <ArrowRightOnRectangleIcon className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // NO LOGUEADO
                                        <div className="flex items-center gap-4">
                                            <Link href="/farmacias" className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-3 py-2 rounded-full transition text-sm border border-transparent hover:border-red-100">
                                                <HeartIcon className="w-5 h-5 animate-pulse" />
                                                <span className="hidden sm:inline">Farmacias</span>
                                            </Link>
                                            <div className="h-6 w-px bg-gray-300"></div>
                                            <Link href="/Login">
                                                <button className="text-gray-600 hover:text-green-700 font-bold text-sm transition">Ingresar</button>
                                            </Link>
                                            <Link href="/registro">
                                                <button className="bg-green-600 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-green-700 transition shadow-md hover:shadow-lg transform active:scale-95">Registrarse</button>
                                            </Link>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {children}
            </main>

            {/* --- FOOTER MEJORADO --- */}
            <footer className="bg-white border-t border-gray-100 mt-auto">
                <div className="max-w-7xl mx-auto py-10 px-6 lg:px-8"> {/* Más espacio vertical y lateral */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">

                        {/* Lado Izquierdo: Marca y Copy */}
                        <div className="text-center md:text-left space-y-2">
                            <Link href="/" className="inline-block group">
                                <span className="text-xl font-black text-gray-400 tracking-tighter group-hover:text-green-600 transition-colors">
                                    Nutri<span className="text-gray-300 group-hover:text-green-400">App</span>
                                </span>
                            </Link>
                            <p className="text-sm text-gray-400 font-medium">
                                © {new Date().getFullYear()} Salud Digital. Todos los derechos reservados.
                            </p>
                        </div>

                        {/* Lado Derecho: Navegación Estilizada */}
                        <nav className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4">
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    // CAMBIO 2: Tipografía mejorada (semibold, gris oscuro, tracking)
                                    className="text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors tracking-wide"
                                >
                                    {link.title}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;