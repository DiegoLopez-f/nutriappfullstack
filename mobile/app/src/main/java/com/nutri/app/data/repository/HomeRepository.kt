package com.nutri.app.data.repository

import com.nutri.app.data.RetrofitClient
import com.nutri.app.data.model.Plan
import com.nutri.app.data.model.Usuario

class HomeRepository {

    private val api = RetrofitClient.api

    suspend fun obtenerUsuario(): Usuario? {
        return try {
            api.getMiPerfil()
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    // --- NUEVO: Función para obtener el plan más reciente ---
    suspend fun obtenerPlanActivo(): Plan? {
        return try {
            val planes = api.getMisPlanes()
            // Ordenamos por fecha (si existe) y tomamos el primero, o simplemente el primero de la lista
            // Asumimos que el backend devuelve los planes, tomamos el último añadido o el primero disponible.
            planes.firstOrNull()
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    suspend fun actualizarUsuario(updates: Map<String, Any?>): Usuario? {
        return try {
            api.actualizarMiPerfil(updates)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}