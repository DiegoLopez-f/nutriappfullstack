package com.nutri.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nutri.app.data.model.Usuario
import com.nutri.app.data.repository.HomeRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import android.util.Log

class HomeViewModel(private val repository: HomeRepository = HomeRepository()) : ViewModel() {

    private val _usuario = MutableStateFlow<Usuario?>(null)
    val usuario: StateFlow<Usuario?> = _usuario

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage

    // Carga los datos del usuario logueado
    fun cargarDatosUsuario() {
        Log.d("HomeViewModel", "cargarDatosUsuario llamado")
        viewModelScope.launch {
            _isLoading.value = true
            try {
                _usuario.value = repository.obtenerUsuario()
                _errorMessage.value = null
            } catch (e: Exception) {
                _errorMessage.value = e.message
                Log.e("HomeViewModel", "Error al cargar datos del usuario", e)
            } finally {
                _isLoading.value = false
            }
        }
    }

    // Actualizar los datos (para la pantalla de datos iniciales)
    fun actualizarDatosUsuario(
        peso: Double?,
        altura: Double?,
        objetivo: String?,
        onExito: () -> Unit
    ) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val updates = mapOf(
                    "peso" to peso,
                    "altura" to altura,
                    "objetivo" to objetivo
                )

                val usuarioActualizado = repository.actualizarUsuario(updates)

                if (usuarioActualizado != null) {
                    _usuario.value = usuarioActualizado
                }

                _errorMessage.value = null
                onExito()

            } catch (e: Exception) {
                _errorMessage.value = "Error: ${e.message}"
                Log.e("HomeViewModel", "Error al actualizar datos", e)
            } finally {
                _isLoading.value = false
            }
        }
    }
}