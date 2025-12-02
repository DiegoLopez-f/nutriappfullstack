package com.nutri.app.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.nutri.app.data.model.Plan
import com.nutri.app.viewmodel.HomeViewModel

@Composable
fun HomeScreen(
    onLogout: () -> Unit,
    onVerPlanes: () -> Unit,
    viewModel: HomeViewModel = viewModel()
) {
    val usuario by viewModel.usuario.collectAsState()
    val planActivo by viewModel.planActivo.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.errorMessage.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.cargarDatosUsuario()
    }

    Scaffold { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(24.dp)
        ) {
            when {
                isLoading -> CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))

                error != null -> Text(
                    text = "Error: $error",
                    color = MaterialTheme.colorScheme.error,
                    modifier = Modifier.align(Alignment.Center)
                )

                usuario != null -> {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .verticalScroll(rememberScrollState()),
                        horizontalAlignment = Alignment.Start
                    ) {
                        // 1. Encabezado de Bienvenida
                        Text(
                            text = "Hola,",
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = usuario!!.nombre,
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )

                        Spacer(modifier = Modifier.height(32.dp))

                        // 2. Sección de Plan Activo
                        Text(
                            text = "Tu Plan Actual",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.SemiBold,
                            modifier = Modifier.padding(bottom = 16.dp)
                        )

                        if (planActivo != null) {
                            PlanActivoCard(plan = planActivo!!)
                        } else {
                            // Tarjeta vacía si no tiene plan
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                            ) {
                                Column(
                                    modifier = Modifier.padding(24.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Text("Aún no tienes un plan asignado.")
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Button(onClick = onVerPlanes) {
                                        Text("Ir a Planes")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PlanActivoCard(plan: Plan) {
    // Obtenemos la primera versión del mapa (generalmente la única activa)
    val version = plan.versiones.values.firstOrNull()
    val macros = version?.totalesDiarios ?: emptyMap()

    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface) // Color blanco/surface para destacar
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            // Título del Plan y Tipo
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = plan.nombre,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                // Badge del tipo de plan
                Surface(
                    color = MaterialTheme.colorScheme.primaryContainer,
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Text(
                        text = version?.tipo ?: "General",
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Objetivo (si existe)
            if (!version?.objetivo.isNullOrBlank()) {
                Text(
                    text = "Objetivo: ${version?.objetivo}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(16.dp))
            Divider(color = MaterialTheme.colorScheme.outlineVariant)
            Spacer(modifier = Modifier.height(16.dp))

            // MACROS PRINCIPALES
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                MacroItem(
                    label = "Calorías",
                    valor = "${macros["kcal"]?.toInt() ?: 0}",
                    unidad = "kcal"
                )
                MacroItem(
                    label = "Proteína",
                    valor = "${macros["proteinas"]?.toInt() ?: 0}",
                    unidad = "g"
                )
                MacroItem(
                    label = "Carbohidratos",
                    valor = "${macros["carbohidratos"]?.toInt() ?: 0}",
                    unidad = "g"
                )
                MacroItem(
                    label = "Grasas",
                    valor = "${macros["grasas"]?.toInt() ?: 0}",
                    unidad = "g"
                )
            }
        }
    }
}

@Composable
fun MacroItem(label: String, valor: String, unidad: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = valor,
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = unidad,
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}