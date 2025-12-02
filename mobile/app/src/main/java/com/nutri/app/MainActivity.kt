package com.nutri.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import com.google.firebase.auth.FirebaseAuth
import com.nutri.app.ui.MainAppScreen
import com.nutri.app.ui.auth.LoginScreen
import com.nutri.app.ui.auth.RegistroScreen
import com.nutri.app.ui.theme.NutriAppTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val auth = FirebaseAuth.getInstance()

        setContent {
            NutriAppTheme {
                // Estado que controla qué pantalla "macro" se muestra
                // Valores posibles: "login", "registro", "app"
                var currentScreen by remember { mutableStateOf("login") }

                // Verificamos al iniciar si ya existe un usuario logueado
                LaunchedEffect(Unit) {
                    if (auth.currentUser != null) {
                        currentScreen = "app"
                    }
                }

                when (currentScreen) {
                    "login" -> {
                        LoginScreen(
                            onLoginExitoso = {
                                currentScreen = "app"
                            },
                            onIrARegistro = {
                                currentScreen = "registro"
                            }
                        )
                    }
                    "registro" -> {
                        RegistroScreen(
                            onRegistroExitoso = { uid, onComplete ->
                                // Al registrarse con éxito, pasamos directo a la app
                                currentScreen = "app"
                                onComplete()
                            },
                            onVolverAlLogin = {
                                currentScreen = "login"
                            }
                        )
                    }
                    "app" -> {
                        // Aquí cargamos la estructura principal con la barra de navegación
                        MainAppScreen(
                            onLogout = {
                                auth.signOut()
                                currentScreen = "login"
                            }
                        )
                    }
                }
            }
        }
    }
}