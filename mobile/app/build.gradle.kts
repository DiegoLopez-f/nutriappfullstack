plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.google.gms.google.services)
}

android {
    namespace = "com.nutri.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.nutri.app"
        minSdk = 29
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        viewBinding = true
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = libs.versions.kotlinCompilerExtension.get()
    }
    testOptions {
        unitTests.isReturnDefaultValues = true
    }
}

dependencies {

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.androidx.lifecycle.livedata.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.ktx)
    implementation(libs.androidx.navigation.fragment.ktx)
    implementation(libs.androidx.navigation.ui.ktx)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    implementation ("androidx.biometric:biometric:1.1.0")

    // JUnit 5 (Jupiter)
    testImplementation(libs.junit.jupiter.api)
    testRuntimeOnly(libs.junit.jupiter.engine)

    // Mockk
    testImplementation(libs.mockk)
    testImplementation(libs.mockk.android)

    // Coroutines Test
    testImplementation(libs.kotlinx.coroutines.test)

    // Helper para LiveData/StateFlow (opcional pero útil)
    testImplementation(libs.androidx.core.testing)



    // Firebase
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.auth)
    implementation(libs.firebase.firestore)
    implementation(libs.firebase.storage)
    implementation(libs.firebase.analytics)

    // Jetpack Compose
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation("androidx.compose.ui:ui-text:1.6.8") // Para KeyboardOptions
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.navigation.compose)
    implementation("androidx.compose.material:material-icons-extended:1.6.8") // Para íconos bonitos

    // Kotlin coroutines
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.kotlinx.coroutines.play.services)

    // Retrofit (El cliente HTTP)
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    // Gson Converter (Para convertir JSON a Data Classes de Kotlin)
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    // OkHttp (El "motor" de Retrofit)
    implementation("com.squareup.okhttp3:okhttp:4.10.0")
    // (Opcional pero RECOMENDADO) Interceptor para ver las llamadas en Logcat
    implementation("com.squareup.okhttp3:logging-interceptor:4.10.0")

}

tasks.withType<Test> {
    useJUnitPlatform()
}