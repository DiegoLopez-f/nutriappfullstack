package com.nutri.app.ui.planes

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.nutri.app.viewmodel.PlanViewModel
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.DisposableEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.text.font.FontWeight
import com.nutri.app.data.model.Comida
import com.nutri.app.data.model.Version

@ExperimentalMaterial3Api
@Composable
fun PlanDetalleScreen(
    planId: String,
    navController: NavController,
    planViewModel: PlanViewModel = viewModel()
) {
    val plan by planViewModel.planSeleccionado.collectAsState()
    val isLoading by planViewModel.isLoading.collectAsState()
    val errorMessage by planViewModel.errorMessage.collectAsState()

    LaunchedEffect(planId) {
        planViewModel.cargarPlanPorId(planId)
    }

    DisposableEffect(Unit) {
        onDispose {
            planViewModel.limpiarPlanSeleccionado()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(text = plan?.nombre ?: "Detalle del Plan") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Regresar"
                        )
                    }
                }
            )
        }
    ) { paddingValues ->
        when {
            isLoading -> {
                Box(Modifier.fillMaxSize().padding(paddingValues), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator()
                }
            }
            errorMessage != null -> {
                Box(Modifier.fillMaxSize().padding(paddingValues), contentAlignment = Alignment.Center) {
                    Text(errorMessage!!, color = MaterialTheme.colorScheme.error)
                }
            }
            plan == null -> {
                Box(Modifier.fillMaxSize().padding(paddingValues), contentAlignment = Alignment.Center) {
                    Text("Plan no encontrado", style = MaterialTheme.typography.bodyLarge)
                }
            }
            else -> {
                LazyColumn(
                    modifier = Modifier.padding(paddingValues).padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    if (plan!!.descripcion.isNotBlank()) {
                        item {
                            Card(Modifier.fillMaxWidth()) {
                                Column(Modifier.padding(16.dp)) {
                                    Text(
                                        text = plan!!.descripcion,
                                        style = MaterialTheme.typography.bodyMedium,
                                    )
                                }
                            }
                        }
                    }

                    items(plan!!.versiones.entries.toList(), key = { it.key }) { (nombreVersion, version) ->
                        VersionCard(version = version)
                    }
                }
            }
        }
    }
}

@Composable
fun VersionCard(version: Version) {
    Card(Modifier.fillMaxWidth()) {
        Column(Modifier.padding(16.dp)) {
            // Header de la Versión
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Versión: ${version.tipo}",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "${version.calorias.toInt()} kcal",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.primary
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = version.objetivo,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            Divider()

            // Comidas
            version.comidas.forEach { comida ->
                ComidaItem(comida = comida)
            }
        }
    }
}

@Composable
fun ComidaItem(comida: Comida) {
    Column(Modifier.padding(top = 16.dp)) {
        Text(
            text = comida.nombre,
            style = MaterialTheme.typography.titleMedium
        )
        Spacer(modifier = Modifier.height(4.dp))

        if (comida.descripcion.isNotBlank()) {
            Text(
                text = comida.descripcion,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(start = 8.dp, bottom = 4.dp)
            )
        }

        comida.alimentos.forEach { alimento ->
            Text(
                text = "• ${alimento.refAlimento} (${alimento.cantidad})",
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(start = 16.dp)
            )
        }

        if (comida.macros.isNotEmpty()) {
            MacrosRow(macros = comida.macros, modifier = Modifier.padding(start = 8.dp, top = 8.dp))
        }
        Spacer(modifier = Modifier.height(16.dp))
        Divider()
    }
}

@Composable
fun MacrosRow(macros: Map<String, Double>, modifier: Modifier = Modifier) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceAround
    ) {
        val prot = macros["proteinas"]?.toInt() ?: macros["proteina"]?.toInt() ?: 0
        val gras = macros["grasas"]?.toInt() ?: 0
        val carb = macros["carbohidratos"]?.toInt() ?: 0

        MacroText(label = "Proteínas", valor = prot)
        MacroText(label = "Grasas", valor = gras)
        MacroText(label = "Carbohidratos", valor = carb)
    }
}

@Composable
fun MacroText(label: String, valor: Int) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = "${valor}g",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}