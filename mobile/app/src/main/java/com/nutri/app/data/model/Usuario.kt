package com.nutri.app.data.model

data class Usuario(
    val uid: String,
    val nombre: String,
    val email: String,
    val tipo: Int,
    val perfil_nutricional: PerfilNutricional? = null
)

data class PerfilNutricional(
    val peso: Double? = null,
    val altura: Double? = null,
    val objetivo: String? = null,
    val alergias: List<String>? = emptyList(),
    val restricciones: List<String>? = emptyList()
)