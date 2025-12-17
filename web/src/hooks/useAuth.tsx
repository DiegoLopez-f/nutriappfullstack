'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
// 1. CORRECCIÓN: Importamos 'auth' directamente, 'app' no es necesario
import { auth } from '@/lib/firebase';
// 2. CORRECCIÓN: La ruta correcta es '@/lib/api'
import { api } from '@/lib/api';

interface AuthState {
    user: User | null;
    role: 'nutricionista' | 'paciente' | null; // Tipado más estricto
    loading: boolean;
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        role: null,
        loading: true,
    });

    useEffect(() => {
        // No necesitamos getAuth(app) porque ya importamos 'auth' inicializado
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const perfil = await api.getPerfil();

                    // 3. LOGICA EXTRA: El backend devuelve 'tipo' (1 o 2), no 'role'.
                    // Hacemos el mapeo aquí para que el resto de la app entienda strings.
                    const userRole = perfil.tipo === 1 ? 'nutricionista' : 'paciente';

                    setAuthState({
                        user,
                        role: userRole,
                        loading: false,
                    });
                } catch (error) {
                    console.error("Error obteniendo rol:", error);
                    setAuthState({
                        user,
                        role: 'paciente', // Fallback seguro
                        loading: false,
                    });
                }
            } else {
                setAuthState({
                    user: null,
                    role: null,
                    loading: false,
                });
            }
        });

        return () => unsubscribe();
    }, []);

    return authState;
}