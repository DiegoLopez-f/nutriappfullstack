package com.nutri.app.data.model

import com.google.firebase.firestore.PropertyName
import com.google.gson.annotations.SerializedName

data class Plan(
    val id: String = "",
    val nombre: String = "",
    val descripcion: String = "",
    val asignadoA: String = "",
    @get:PropertyName("fecha_asignacion")
    @SerializedName("fecha_asignacion")
    val fechaAsignacion: Long? = null,
    val versiones: Map<String, Version> = emptyMap()
)

data class Version(
    val tipo: String = "",
    val calorias: Double = 0.0,
    @get:PropertyName("distribucion_macros")
    @SerializedName("distribucion_macros")
    val distribucionMacros: Map<String, Double> = emptyMap(),
    val objetivo: String = "",
    val comidas: List<Comida> = emptyList(),
    @get:PropertyName("totales_diarios")
    @SerializedName("totales_diarios")
    val totalesDiarios: Map<String, Double> = emptyMap(),
    @get:PropertyName("notas_tecnicas")
    @SerializedName("notas_tecnicas")
    val notasTecnicas: List<String> = emptyList()
)

data class Comida(
    val nombre: String = "",
    val descripcion: String = "",
    val alimentos: List<AlimentoPlan> = emptyList(),
    val macros: Map<String, Double> = emptyMap()
)

data class AlimentoPlan(
    val refAlimento: String = "",
    val cantidad: String = ""
)