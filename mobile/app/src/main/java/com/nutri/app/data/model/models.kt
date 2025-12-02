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

// Payload para registrar usuario
data class RegistroUsuarioPayload(
    val uid: String,
    val email: String,
    val nombre: String,
    val tipo: Int = 2, // 2 = Paciente por defecto
    val perfil_nutricional: PerfilNutricionalPayload = PerfilNutricionalPayload()
)

data class PerfilNutricionalPayload(
    val altura: Double = 0.0,
    val peso: Double = 0.0,
    val objetivo: String = "Sin definir",
    val alergias: List<String> = emptyList(),
    val restricciones: List<String> = emptyList()
)