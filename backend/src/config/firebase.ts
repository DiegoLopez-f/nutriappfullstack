// backend/src/config/firebase.ts
import admin from 'firebase-admin';

// ELIMINA o COMENTA esta línea porque el archivo no existirá en el servidor:
// import serviceAccount from '../../serviceAccountKey.json';

// AÑADE esta lógica para leer desde variables de entorno:
let serviceAccount: any;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // En producción (Render), leemos la variable de entorno
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
    // En local, intentamos requerir el archivo (opcional, para que siga funcionando en tu PC)
    try {
        serviceAccount = require('../../serviceAccountKey.json');
    } catch (e) {
        console.error('No se encontraron credenciales de Firebase');
    }
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;