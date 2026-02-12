# Setup: Google Play Store + RevenueCat

Guia paso a paso para configurar la monetizacion de Suscriptio via Google Play.

---

## 1. Google Play Console

### Crear cuenta de desarrollador
1. Ir a [play.google.com/console](https://play.google.com/console)
2. Pagar la cuota unica de **€25**
3. Completar la verificacion de identidad

### Crear la app
1. **Crear app** → Nombre: "Suscriptio"
2. Idioma predeterminado: Espanol
3. App type: App (no juego)
4. Free / Paid: **Gratis** (la compra in-app es el premium)

### Crear producto in-app
1. Ir a **Monetizar → Productos → Productos en la app**
2. **Crear producto**:
   - Product ID: `suscriptio_premium`
   - Tipo: **Producto gestionado** (one-time, no suscripcion)
   - Nombre: "Suscriptio Premium"
   - Descripcion: "Desbloquea suscripciones ilimitadas. Pago unico."
   - Precio: **€2.99**
3. **Activar** el producto

---

## 2. RevenueCat

### Crear cuenta
1. Ir a [app.revenuecat.com](https://app.revenuecat.com)
2. Registrarse (plan gratuito: hasta $2,500 MTR)

### Crear proyecto
1. **New Project** → Nombre: "Suscriptio"

### Vincular Google Play
1. Ir a **Project Settings → Apps → + New**
2. Seleccionar **Google Play Store**
3. Introducir:
   - Package name: `com.suscriptio.app`
   - Service account JSON (ver paso siguiente)

### Crear Service Account en Google Cloud
1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Seleccionar el proyecto vinculado a tu Play Console
3. **IAM & Admin → Service Accounts → Create**
4. Nombre: `revenuecat-suscriptio`
5. Asignar rol: **Pub/Sub Editor**
6. Crear key JSON → Descargar
7. En Play Console: **Users & Permissions → Invite user**
   - Email: el del service account
   - Permisos: **Financial data, Manage orders**
8. Subir el JSON a RevenueCat

### Configurar producto en RevenueCat
1. **Products → + New** → ID: `suscriptio_premium`
2. **Entitlements → + New** → ID: `premium`
3. Vincular el producto al entitlement
4. **Offerings → Default → + Package** → asociar el producto

### Obtener API Key
1. **Project Settings → API Keys**
2. Copiar la **Public app-specific API key** (Google Play)
3. Pegarla en tu `.env.local`:
   ```
   VITE_REVENUECAT_API_KEY=appl_XXXXXXXXXX
   ```

---

## 3. Configuracion local

### Variables de entorno
```bash
# .env.local
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_REVENUECAT_API_KEY=tu-api-key-publica
```

### Ejecutar migracion SQL
En el SQL Editor de Supabase, ejecutar:
```
supabase/migrations/001_user_profiles_purchase.sql
```

### Build y sync Android
```bash
npm run build
npx cap sync android
```

### Abrir en Android Studio
```bash
npx cap open android
```

---

## 4. Testing en sandbox

### Configurar tester en Play Console
1. Ir a **Setup → License testing**
2. Agregar tu email de Gmail como tester
3. Las compras del tester no se cobran

### Configurar tester en RevenueCat
1. Ir a **Project Settings → Test Users**
2. Agregar el mismo email

### Probar compra
1. Instalar APK debug en dispositivo real (no emulador para Google Play)
2. Login con cuenta de test
3. Ir a Settings → Upgrade
4. Completar flujo de compra (sera gratis por ser tester)
5. Verificar en RevenueCat dashboard que aparece la compra
6. Verificar en Supabase que `user_profiles.subscription_tier = 'premium'`

---

## 5. Checklist pre-lanzamiento

- [ ] Cuenta Google Play Console creada y verificada
- [ ] Cuenta RevenueCat creada
- [ ] Service Account configurado y vinculado
- [ ] Producto `suscriptio_premium` creado en Play Console (activo)
- [ ] Producto configurado en RevenueCat (product + entitlement + offering)
- [ ] API key publica copiada a `.env.local`
- [ ] Migracion SQL ejecutada en Supabase
- [ ] Compra de test exitosa en dispositivo real
- [ ] `user_profiles` se actualiza correctamente tras compra
