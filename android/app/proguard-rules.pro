# Suscriptio ProGuard Rules

# ========================================
# Capacitor
# ========================================
-keep class com.getcapacitor.** { *; }
-keep class * extends com.getcapacitor.Plugin
-keepclassmembers class * extends com.getcapacitor.Plugin {
    @com.getcapacitor.annotation.CapacitorMethod <methods>;
}

# WebView JavaScript interface
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class android.webkit.** { *; }

# ========================================
# RevenueCat + Google Play Billing
# ========================================
-keep class com.revenuecat.purchases.** { *; }
-keep class com.android.billingclient.** { *; }

# ========================================
# Kotlin (used by plugins)
# ========================================
-keep class kotlin.Metadata { *; }
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-dontwarn kotlinx.coroutines.**

# ========================================
# General Android
# ========================================
-keepattributes SourceFile,LineNumberTable
-keepclassmembers class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}
-keepclassmembers class **.R$* {
    public static <fields>;
}

# Suppress warnings for optional dependencies
-dontwarn org.conscrypt.**
-dontwarn org.bouncycastle.**
-dontwarn org.openjsse.**
