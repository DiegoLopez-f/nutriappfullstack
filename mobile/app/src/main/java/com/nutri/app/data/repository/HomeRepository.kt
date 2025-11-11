package com.nutri.app.data.repository

// Borramos los imports de FirebaseFirestore
// import com.google.firebase.firestore.FirebaseFirestore
// import kotlinx.coroutines.tasks.await

// Añadimos los imports de nuestra API
import com.nutri.app.data.ApiService
import com.nutri.app.data.RetrofitClient
import com.nutri.app.data.model.Usuario

class HomeRepository {

    // La fuente de datos ya no es 'db', es nuestra 'api' de Retrofit
    private val api: ApiService = RetrofitClient.api

    /**
     * Obtiene el perfil del usuario desde NUESTRO BACKEND.
     * Ya no necesita 'uid' porque el AuthInterceptor añade el token
     * y el backend sabe quiénes somos.
     */
    suspend fun obtenerUsuario(): Usuario? {
        return try {
            // Llama al endpoint 'GET /api/perfil'
            api.getMiPerfil()
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }


    /**
     * Actualiza los datos del perfil del usuario en el backend.
     */
    suspend fun actualizarUsuario(updates: Map<String, Any?>): Usuario? {
        return try {
            api.actualizarMiPerfil(updates)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}