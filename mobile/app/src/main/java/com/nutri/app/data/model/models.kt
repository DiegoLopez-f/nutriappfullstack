package com.nutri.app.data.model

data class Alimento(
    val id: String,
    val nombre: String,
    val proteina: Double,
    val grasas: Double,
    val carbohidratos: Double,
    val calorias: Double
)


// El alimento que enviamos al backend
data class AlimentoPayload(
    val refAlimento: String,
    val cantidad: String
)

// La comida que enviamos al backend
data class ComidaPayload(
    val nombre: String,
    val alimentos: List<AlimentoPayload>
)

// El objeto completo que enviamos en Retrofit
data class PlanPayload(
    val pacienteId: String,
    val nombre: String,
    val tipo: String,
    val descripcionPlan: String,
    val objetivo: String,
    val comidas: List<ComidaPayload>
)