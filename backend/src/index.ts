// 1. Importaciones (sintaxis de TypeScript)
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

// 2. Importar la llave de Firebase
import serviceAccount from '../serviceAccountKey.json';

// --- Añade esta sección para extender los tipos de Express ---
declare global {
    namespace Express {
        interface Request {
            user?: admin.auth.DecodedIdToken; // El usuario decodificado
        }
    }
}
// --- Fin de la sección ---

// 3. Inicializar Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any)
});

// 4. Inicializar la App de Express
const app = express();
const port = 3000;

// 5. Configurar Middlewares
app.use(cors());
app.use(express.json());

// 6. Definir la base de datos para fácil acceso
const db = admin.firestore();

// 7. Importar la lógica del Plan (el archivo que ya creamos)
import { PlanPayload, calcularMacrosPlan } from './plan-utils';

// --- Middleware de Autenticación (El Guardia) ---
async function verifyFirebaseToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).send('No autorizado: Se requiere un token.');
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (!idToken) {
        return res.status(403).send('No autorizado: Token malformado.');
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(403).send('No autorizado: Token inválido o expirado.');
    }
}

// --- === ENDPOINTS DE LA API === ---

// ... (endpoints /api/test, /api/protegido, /api/alimentos) ...
app.get('/api/test', (req: Request, res: Response) => {
    res.status(200).send({ message: '¡Hola desde tu backend con TypeScript!' });
});
app.get('/api/protegido', verifyFirebaseToken, (req: Request, res: Response) => {
    res.status(200).send({
        message: `¡Bienvenido, ${req.user?.email}!`,
        tuUID: req.user?.uid,
    });
});
app.get('/api/alimentos', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
        const alimentosSnapshot = await db.collection('alimentos').get();
        const alimentosList = alimentosSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).send(alimentosList);
    } catch (error) {
        console.error('Error al obtener alimentos:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
});


// ... (endpoint GET /api/planes/asignados) ...
app.get('/api/planes/asignados', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            return res.status(403).send({ message: 'Usuario no válido.' });
        }

        console.log(`Buscando planes asignados para el UID: ${uid}`);
        const planesSnapshot = await db.collection('usuarios').doc(uid).collection('planes').get();

        if (planesSnapshot.empty) {
            console.log('No se encontraron planes para este usuario.');
            return res.status(200).send([]);
        }

        const planesList = planesSnapshot.docs.map(planDoc => {
            const planData = planDoc.data();

            // Convertir el Timestamp a Long
            let fechaAsignacionLong: number | null = null;
            const fechaAsignacionData = planData.fecha_asignacion;

            if (fechaAsignacionData && typeof fechaAsignacionData.toMillis === 'function') {
                fechaAsignacionLong = fechaAsignacionData.toMillis();
            } else if (typeof fechaAsignacionData === 'number') {
                fechaAsignacionLong = fechaAsignacionData;
            }

            return {
                id: planDoc.id,
                nombre: planData.nombre,
                descripcion: planData.descripcion,
                versiones: planData.versiones,
                fecha_asignacion: fechaAsignacionLong
            };
        });

        res.status(200).send(planesList);

    } catch (error) {
        console.error('Error al obtener planes asignados:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
});


// ... (endpoint GET /api/planes/asignados) ...

// --- ¡¡ENDPOINT POST MEJORADO!! (Acepta descripcion y objetivo) ---
app.post('/api/planes', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
        const nutricionistaUid = req.user?.uid;
        if (!nutricionistaUid) {
            return res.status(403).send({ message: 'Usuario (Nutricionista) no válido.' });
        }

        // 1. OBTENER Y VALIDAR DATOS (Añadimos nuevos campos)
        const { pacienteId, descripcionPlan, objetivo, ...planData } =
            req.body as (PlanPayload & { pacienteId: string, descripcionPlan?: string, objetivo?: string });

        if (!pacienteId) {
            return res.status(400).send({ message: "Se requiere un 'pacienteId' para crear el plan." });
        }
        if (!planData.nombre || !planData.tipo || !planData.comidas) {
            return res.status(400).send({ message: 'Datos del plan incompletos (nombre, tipo, comidas).' });
        }

        // 2. CALCULAR
        const { comidasParaGuardar, totalesDiarios } = await calcularMacrosPlan(db, planData.comidas);

        if (comidasParaGuardar.length === 0) {
            return res.status(400).send({ message: 'El plan debe contener al menos un alimento válido.' });
        }

        // 3. PREPARAR LA VERSIÓN (Añadimos objetivo)
        const versionId = planData.tipo.toLowerCase().replace('ó', 'o');
        const versionData = {
            tipo: planData.tipo,
            calorias: totalesDiarios.kcal,
            distribucion_macros: { proteina: 0, carbohidratos: 0, grasas: 0 },
            objetivo: objetivo || 'Objetivo no especificado', // <-- ¡¡NUEVO!!
            comidas: comidasParaGuardar,
            totales_diarios: totalesDiarios,
            notas_tecnicas: [],
        };

        // 4. PREPARAR EL PLAN (Añadimos descripción)
        const planParaGuardar = {
            nombre: planData.nombre.trim(),
            descripcion: descripcionPlan || `Plan ${planData.tipo} creado por Nutricionista ${nutricionistaUid}`, // <-- ¡¡NUEVO!!
            fecha_asignacion: admin.firestore.FieldValue.serverTimestamp(),
            versiones: {
                [versionId]: versionData
            }
        };

        // 5. GUARDAR
        const planRef = await db.collection('usuarios').doc(pacienteId).collection('planes').add(planParaGuardar);

        console.log(`Plan ${planRef.id} creado para ${pacienteId} (con campos extra)`);
        res.status(201).send({
            id: planRef.id,
            message: 'Plan creado exitosamente',
        });

    } catch (error) {
        console.error('Error al crear plan:', error);
        res.status(500).send({ message: 'Error interno del servidor al crear el plan.' });
    }
});

// ... (endpoint DELETE /api/planes/:planId) ...

// ... (endpoint DELETE /api/planes/:planId) ...
app.delete('/api/planes/:planId', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
        const uid = req.user?.uid;
        const { planId } = req.params;

        if (!uid) {
            return res.status(403).send({ message: 'Usuario no válido.' });
        }
        if (!planId) {
            return res.status(400).send({ message: 'Se requiere un ID de plan.' });
        }

        await db.collection('usuarios').doc(uid).collection('planes').doc(planId).delete();
        res.status(200).send({ message: 'Plan eliminado exitosamente' });

    } catch (error) {
        console.error('Error al eliminar el plan:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
});

// --- ¡¡ENDPOINT GET /api/perfil CORREGIDO!! ---
/**
 * Endpoint para OBTENER el perfil de usuario (peso, altura, etc.)
 * del usuario logueado.
 * CONVIERTE Timestamps a Longs.
 */
app.get('/api/perfil', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            return res.status(403).send({ message: 'Token de usuario no válido.' });
        }

        const userRef = db.collection('usuarios').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            // (Mantenemos la lógica de 'crear si no existe' por si acaso,
            // pero ahora sabemos que el problema era otro)
            console.log(`Perfil no encontrado para ${uid}. Creando perfil...`);
            const email = req.user?.email || 'desconocido';
            const nombreUsuario = email.split('@')[0];

            const nuevoUsuario = {
                uid: uid,
                email: email,
                nombre: nombreUsuario,
                peso: null,
                altura: null,
                objetivo: null,
                creadoEn: Date.now(), // ¡Enviamos un Long de inmediato!
                actualizadoEn: Date.now() // ¡Enviamos un Long de inmediato!
            };

            // Guardamos y devolvemos el nuevo usuario
            await userRef.set(nuevoUsuario);
            return res.status(200).send(nuevoUsuario);

        } else {
            // 4. SI YA EXISTE: Lo leemos y CONVERTIMOS los Timestamps
            console.log(`Perfil encontrado para ${uid}.`);
            const userData = userDoc.data()!; // '!' porque sabemos que existe

            // --- ¡¡AQUÍ ESTÁ LA CORRECCIÓN!! ---
            const creadoEnData = userData.creadoEn;
            const actualizadoEnData = userData.actualizadoEn;

            // Convertir 'creadoEn'
            let creadoEnLong: number | null = null;
            if (creadoEnData && typeof creadoEnData.toMillis === 'function') {
                creadoEnLong = creadoEnData.toMillis();
            } else if (typeof creadoEnData === 'number') {
                creadoEnLong = creadoEnData;
            } else {
                creadoEnLong = Date.now(); // Fallback
            }

            // Convertir 'actualizadoEn'
            let actualizadoEnLong: number | null = null;
            if (actualizadoEnData && typeof actualizadoEnData.toMillis === 'function') {
                actualizadoEnLong = actualizadoEnData.toMillis();
            } else if (typeof actualizadoEnData === 'number') {
                actualizadoEnLong = actualizadoEnData;
            } else {
                actualizadoEnLong = Date.now(); // Fallback
            }

            // Devolvemos el objeto de usuario con Longs, no Timestamps
            return res.status(200).send({
                ...userData, // Todos los demás campos (uid, nombre, email, etc.)
                creadoEn: creadoEnLong,
                actualizadoEn: actualizadoEnLong
            });
        }

    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
});


// ... (después de tu endpoint GET /api/perfil) ...

// --- ¡¡NUEVO ENDPOINT!! ---
/**
 * Endpoint para ACTUALIZAR el perfil del usuario logueado.
 * Usado por DatosInicialesScreen.
 */
app.put('/api/perfil', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            return res.status(403).send({ message: 'Usuario no válido.' });
        }

        // 1. Obtener los datos del body (peso, altura, objetivo)
        const { peso, altura, objetivo, nombre } = req.body;

        const updates: { [key: string]: any } = {
            actualizadoEn: admin.firestore.FieldValue.serverTimestamp()
        };

        // 2. Construir el objeto de actualización solo con los campos que llegaron
        if (peso !== undefined) updates.peso = peso;
        if (altura !== undefined) updates.altura = altura;
        if (objetivo !== undefined) updates.objetivo = objetivo;
        if (nombre !== undefined) updates.nombre = nombre; // Permitir actualizar el nombre

        // 3. Actualizar el documento en Firestore
        const userRef = db.collection('usuarios').doc(uid);
        await userRef.update(updates);

        // 4. Devolver el documento actualizado
        const updatedDoc = await userRef.get();
        res.status(200).send(updatedDoc.data());

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
});

// ... (El resto de tus endpoints y 'app.listen')


// 8. Iniciar el servidor
app.listen(port, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${port}`);
});