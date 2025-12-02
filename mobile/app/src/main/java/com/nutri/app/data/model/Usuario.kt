package com.nutri.app.data.model

data class Usuario(
    val uid: String,
    val nombre: String,
    val email: String,
    val tipo: Int,
    // CAMBIO IMPORTANTE: Ahora los datos están anidados aquí
    val perfil_nutricional: PerfilNutricional? = null
)

data class PerfilNutricional(
    val peso: Double? = null,
    val altura: Double? = null,
    val objetivo: String? = null,
    // Agregamos estos por si en el futuro los usas (ya que están en tu modelo de registro)
    val alergias: List<String>? = emptyList(),
    val restricciones: List<String>? = emptyList()
)