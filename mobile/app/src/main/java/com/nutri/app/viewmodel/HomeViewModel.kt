package com.nutri.app.viewmodel

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nutri.app.data.model.Plan
import com.nutri.app.data.model.Usuario
import com.nutri.app.data.repository.HomeRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class HomeViewModel(private val repository: HomeRepository = HomeRepository()) : ViewModel() {

    private val _usuario = MutableStateFlow<Usuario?>(null)
    val usuario: StateFlow<Usuario?> = _usuario

    // --- NUEVO ESTADO: Plan Activo ---
    private val _planActivo = MutableStateFlow<Plan?>(null)
    val planActivo: StateFlow<Plan?> = _planActivo

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage

    fun cargarDatosUsuario() {
        Log.d("HomeViewModel", "cargarDatosUsuario llamado")
        viewModelScope.launch {
            _isLoading.value = true
            try {
                // 1. Cargar Usuario
                _usuario.value = repository.obtenerUsuario()

                // 2. Cargar Plan Activo
                _planActivo.value = repository.obtenerPlanActivo()

                _errorMessage.value = null
            } catch (e: Exception) {
                _errorMessage.value = e.message
                Log.e("HomeViewModel", "Error al cargar datos", e)
            } finally {
                _isLoading.value = false
            }
        }
    }

    // (Mantén la función actualizarDatosUsuario igual que antes...)
    fun actualizarDatosUsuario(
        nombre: String? = null,
        peso: Double?,
        altura: Double?,
        objetivo: String?,
        onExito: () -> Unit
    ) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val updates = mutableMapOf<String, Any?>()

                // El nombre sigue estando afuera (en la raíz)
                if (nombre != null) {
                    updates["nombre"] = nombre
                }

                // CAMBIO: Empaquetamos peso, altura y objetivo dentro de un mapa
                val perfilUpdates = mutableMapOf<String, Any?>()
                if (peso != null) perfilUpdates["peso"] = peso
                if (altura != null) perfilUpdates["altura"] = altura
                if (objetivo != null) perfilUpdates["objetivo"] = objetivo

                // Solo agregamos el mapa si tiene datos
                if (perfilUpdates.isNotEmpty()) {
                    updates["perfil_nutricional"] = perfilUpdates
                }

                val usuarioActualizado = repository.actualizarUsuario(updates)

                if (usuarioActualizado != null) {
                    _usuario.value = usuarioActualizado
                }

                _errorMessage.value = null
                onExito()

            } catch (e: Exception) {
                _errorMessage.value = "Error: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }
}