package com.nutri.app

import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.biometric.BiometricPrompt
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.core.content.ContextCompat
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.NavType
import androidx.navigation.navArgument
import com.nutri.app.ui.auth.LoginScreen
import com.nutri.app.ui.auth.RegistroScreen
import com.nutri.app.ui.home.HomeScreen
import com.google.firebase.auth.FirebaseAuth
import com.nutri.app.ui.auth.DatosInicialesScreen
import com.nutri.app.ui.planes.PlanScreen
import java.util.concurrent.Executor
import android.widget.Toast
import androidx.fragment.app.FragmentActivity
import com.nutri.app.ui.planes.PlanDetalleScreen
import android.util.Log
import com.nutri.app.ui.planes.CrearPlanScreen


class MainActivity : FragmentActivity() {

    @ExperimentalMaterial3Api
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        showBiometricPrompt()

        setContent {
            val navController = rememberNavController()
            val auth = FirebaseAuth.getInstance()

            // Si ya hay usuario logueado, ir directo al Home
            val startDestination = if (auth.currentUser != null) "home" else "login"

            NavHost(navController = navController, startDestination = startDestination) {
                composable("login") {
                    LoginScreen(
                        onLoginExitoso = {
                            navController.navigate("home") {
                                popUpTo("login") { inclusive = true }
                            }
                        },
                        onIrARegistro = {
                            navController.navigate("registro")
                        }
                    )
                }

                // Pantalla de registro
                composable("registro") {
                    RegistroScreen(
                        onRegistroExitoso = { _, onFinish ->
                            // Ir a la pantalla de datos iniciales después de crear el usuario
                            navController.navigate("datosIniciales") {
                                popUpTo("registro") { inclusive = true }
                            }
                            onFinish()
                        },
                        onVolverAlLogin = {
                            navController.popBackStack()
                        }
                    )
                }

                // Pantalla datos iniciales
                composable("datosIniciales") {
                    DatosInicialesScreen(navController)
                }

                // Pantalla home
                composable("home") {
                    HomeScreen(
                        onLogout = {
                            val user = auth.currentUser

                            if (user != null) {
                                Log.d("TOKEN_TEST", "Obteniendo token antes de logout...")
                                user.getIdToken(true)
                                    .addOnSuccessListener { result ->

                                        val idToken = result.token

                                        // LOGCAT USADO MIENTRAS PROBAMOS
                                        if (idToken != null) {
                                            // ¡EL TOKEN APARECERÁ AQUÍ EN LOGCAT!
                                            Log.d("TOKEN_TEST", "--- ¡COPIA ESTE TOKEN! ---")
                                            Log.d("TOKEN_TEST", idToken)
                                            Log.d("TOKEN_TEST", "----------------------------")
                                        } else {
                                            Log.e("TOKEN_TEST", "El token vino nulo desde Firebase.")
                                        }


                                        auth.signOut()
                                        navController.navigate("login") {
                                            popUpTo("home") { inclusive = true }
                                        }
                                    }
                                    .addOnFailureListener { e ->
                                        Log.e("TOKEN_TEST", "Error al obtener token", e)

                                        auth.signOut()
                                        navController.navigate("login") {
                                            popUpTo("home") { inclusive = true }
                                        }
                                    }
                            } else {
                                // Si por alguna razón el usuario es nulo, solo desloguea
                                auth.signOut()
                                navController.navigate("login") {
                                    popUpTo("home") { inclusive = true }
                                }
                            }
                            // HASTA AQUI LO DEL LOGCAT Y LA PRUEBA
                        },
                        onVerPlanes = {
                            val uid = FirebaseAuth.getInstance().currentUser?.uid
                            if (uid != null) {
                                navController.navigate("planes/$uid")
                            }
                        }
                    )
                }


                // PANTALLA PLANES
                composable(
                    route = "planes/{uid}", // Mantenemos la ruta por ahora
                    arguments = listOf(navArgument("uid") { type = NavType.StringType })
                ) { backStackEntry ->
                    PlanScreen(navController = navController)
                }

                composable("crearPlan") {
                    CrearPlanScreen(navController = navController)
                }

                // PANTALLA DETALLE PLAN
                composable(
                    route = "planDetalle/{planId}",
                    arguments = listOf(navArgument("planId") { type = NavType.StringType })
                ) { backStackEntry ->
                    val planId = backStackEntry.arguments?.getString("planId") ?: ""
                    PlanDetalleScreen(planId = planId, navController = navController)
                }
            }
        }
    }
    private fun showBiometricPrompt() {
        // Executor para que el callback se ejecute en el hilo principal
        val executor: Executor = ContextCompat.getMainExecutor(this)

        val biometricPrompt = BiometricPrompt(
            this,
            executor,
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    super.onAuthenticationSucceeded(result)
                    showToast("Autenticación exitosa!")
                }

                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    super.onAuthenticationError(errorCode, errString)
                    showToast("Error: $errString")
                }

                override fun onAuthenticationFailed() {
                    super.onAuthenticationFailed()
                    showToast("Autenticación fallida")
                }
            }
        )

        // Configuración del prompt
        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Autenticación biométrica")
            .setSubtitle("Usa huella digital para entrar")
            .setNegativeButtonText("Cancelar")
            .build()

        biometricPrompt.authenticate(promptInfo)
    }

    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
}