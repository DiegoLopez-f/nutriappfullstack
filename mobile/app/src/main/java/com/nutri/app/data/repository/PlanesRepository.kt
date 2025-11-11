package com.nutri.app.data.repository

// Imports NUEVOS
import com.nutri.app.data.ApiService
import com.nutri.app.data.RetrofitClient
import com.nutri.app.data.model.Alimento // Asegúrate de importar Alimento
import com.nutri.app.data.model.AlimentoPayload // ¡¡NUEVO!!
import com.nutri.app.data.model.Comida
import com.nutri.app.data.model.ComidaPayload // ¡¡NUEVO!!
import com.nutri.app.data.model.Plan
import com.nutri.app.data.model.PlanPayload // ¡¡NUEVO!!

class PlanesRepository {

    private val api: ApiService = RetrofitClient.api

    /**
     * C(R)UD - LEER todos los planes del usuario logueado (desde el backend)
     */
    suspend fun obtenerPlanes(): List<Plan> {
        return try {
            api.getMisPlanes()
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList() // Devuelve lista vacía en caso de error de red
        }
    }

    /**
     * (C)RUD - CREAR un nuevo plan para el usuario logueado
     **/
    suspend fun crearPlan(
        pacienteId: String,
        nombrePlan: String,
        tipoPlan: String,
        descripcionPlan: String, // <-- ¡¡NUEVO!!
        objetivo: String,        // <-- ¡¡NUEVO!!
        comidas: List<Comida>
    ) {

        // 1. Convertir Comida a ComidaPayload
        val comidasPayload = comidas.map { comida ->
            val alimentosPayload = comida.alimentos.map { alimento ->
                AlimentoPayload(
                    refAlimento = alimento.refAlimento,
                    cantidad = alimento.cantidad
                )
            }
            ComidaPayload(
                nombre = comida.nombre,
                alimentos = alimentosPayload
            )
        }

        // 2. Construir el Payload completo
        val payload = PlanPayload(
            pacienteId = pacienteId,
            nombre = nombrePlan,
            tipo = tipoPlan,
            descripcionPlan = descripcionPlan, // <-- ¡¡NUEVO!!
            objetivo = objetivo,               // <-- ¡¡NUEVO!!
            comidas = comidasPayload
        )

        // 3. Llamar a la API
        try {
            api.crearPlan(payload)
        } catch (e: Exception) {
            e.printStackTrace()
            // Re-lanzar la excepción para que el ViewModel la atrape
            throw e
        }
    }

    /**
     * CRU(D) - ELIMINAR un plan
     */
    suspend fun eliminarPlan(planId: String) {
        try {
            api.eliminarPlan(planId)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    /**
     * OBTENER todos los alimentos (para el formulario de creación)
     */
    suspend fun obtenerAlimentos(): List<Alimento> {
        return try {
            api.getAlimentos()
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }
}