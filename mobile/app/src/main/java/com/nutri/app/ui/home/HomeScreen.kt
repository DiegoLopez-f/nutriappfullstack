package com.nutri.app.ui.home

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.nutri.app.viewmodel.HomeViewModel

@Composable
fun HomeScreen(
    onLogout: () -> Unit,
    onVerPlanes: () -> Unit,
    viewModel: HomeViewModel = viewModel()
) {
    // Observar los estados del ViewModel
    val usuario by viewModel.usuario.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.errorMessage.collectAsState()

    // Cargar datos del usuario al entrar a la pantalla
    LaunchedEffect(Unit) {
        viewModel.cargarDatosUsuario()
    }

    Box(
        modifier = Modifier.fillMaxSize().padding(32.dp),
        contentAlignment = Alignment.Center
    ) {
        when {
            // Muestra "Cargando..." mientras el backend responde
            isLoading -> CircularProgressIndicator()

            // Muestra el error si el backend falla
            error != null -> Text("Error: $error", color = MaterialTheme.colorScheme.error)

            // Muestra los datos del usuario si funciona
            usuario != null -> {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        "¡Bienvenido,",
                        style = MaterialTheme.typography.headlineSmall
                    )
                    Text(
                        // Muestra el nombre traído desde el backend
                        usuario!!.nombre,
                        style = MaterialTheme.typography.headlineLarge,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(64.dp))
                    Button(onClick = onVerPlanes, modifier = Modifier.fillMaxWidth()) {
                        Text("Ver Mis Planes")
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(onClick = onLogout, modifier = Modifier.fillMaxWidth()) {
                        Text("Cerrar Sesión")
                    }
                }
            }

            // Si el usuario es nulo pero no hay error
            else -> Text("No se pudieron cargar los datos del usuario.")
        }
    }
}