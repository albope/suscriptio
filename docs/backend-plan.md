# Plan: Backend y Autenticacion con Supabase

## Resumen
Anadir backend y sistema de login a Suscriptio usando **Supabase** (PostgreSQL + Auth integrado). Migracion de localStorage a cloud con soporte offline.

**Tiempo estimado:** 6-8 horas

---

## Stack Elegido: Supabase

| Caracteristica | Detalle |
|----------------|---------|
| Base de datos | PostgreSQL |
| Autenticacion | Email/password (integrado) |
| API | Auto-generada REST |
| Seguridad | Row Level Security (RLS) |
| Tier gratis | 500MB DB, 50K usuarios/mes |
| SDK | `@supabase/supabase-js` |

---

## Antes de Empezar

1. Crear cuenta gratuita en [supabase.com](https://supabase.com)
2. Crear proyecto nuevo llamado "suscriptio"
3. Copiar URL y anon key del proyecto

---

## Orden de Implementacion

### Fase 1: Setup Supabase (30 min)

1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear proyecto "suscriptio"
3. Ejecutar schema SQL en SQL Editor
4. Habilitar auth email/password
5. Copiar URL y anon key
6. Crear `.env.local`

### Fase 2: Schema de Base de Datos

```sql
-- Tabla de suscripciones
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(60) NOT NULL,
  cost DECIMAL(7,2) NOT NULL CHECK (cost >= 0.01),
  currency VARCHAR(3) DEFAULT 'EUR',
  billing_frequency VARCHAR(20) NOT NULL,
  next_payment_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  category VARCHAR(30),
  notes VARCHAR(500),
  provider_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);

-- Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users CRUD own data"
ON subscriptions FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Trigger auto-update updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriptions_updated
BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

### Fase 3: Cliente Supabase (15 min)

**Instalar dependencia:**
```bash
npm install @supabase/supabase-js
```

**Crear `src/lib/supabase.ts`:**
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Fase 4: Contexto de Autenticacion (1-2h)

**Crear `src/contexts/AuthContext.tsx`:**
- Estado: `user`, `loading`, `error`
- Metodos: `signIn`, `signUp`, `signOut`
- Persistencia de sesion automatica

**Crear `src/hooks/useAuth.ts`:**
- Hook para consumir AuthContext

### Fase 5: Paginas de Auth (1-2h)

**Crear `src/pages/Login.tsx`:**
- Formulario email/password
- Link a registro
- Manejo de errores

**Crear `src/pages/Register.tsx`:**
- Formulario email/password/confirmar
- Link a login

**Crear `src/components/auth/ProtectedRoute.tsx`:**
- Wrapper que redirige a /login si no autenticado

### Fase 6: Actualizar Rutas (30 min)

**Modificar `src/App.tsx`:**
```tsx
<AuthProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/subscriptions" element={<AppLayout><SubscriptionList /></AppLayout>} />
      </Route>
    </Routes>
  </BrowserRouter>
</AuthProvider>
```

### Fase 7: Sync con Supabase (2h)

**Crear `src/hooks/useSupabaseSubscriptions.ts`:**
- Fetch inicial al montar
- CRUD contra Supabase
- Cache local para offline

**Modificar `src/store/subscriptionStore.ts`:**
- Anadir `syncFromCloud()`
- Anadir `isLoading`, `isSyncing`
- Mantener localStorage como cache offline

### Fase 8: Migracion localStorage -> Cloud (1h)

**Crear `src/components/auth/MigrationModal.tsx`:**
- Detectar datos locales existentes
- Preguntar si migrar
- Subir a cloud
- Limpiar localStorage

**Flujo:**
```
Login -> Hay datos locales? -> Mostrar modal -> Migrar -> Dashboard
```

### Fase 9: Traducciones (30 min)

**Actualizar `src/locales/es/translation.json`:**
```json
{
  "auth": {
    "login": "Iniciar sesion",
    "register": "Crear cuenta",
    "email": "Correo electronico",
    "password": "Contrasena",
    "confirmPassword": "Confirmar contrasena",
    "forgotPassword": "Olvidaste tu contrasena?",
    "noAccount": "No tienes cuenta?",
    "hasAccount": "Ya tienes cuenta?",
    "logout": "Cerrar sesion",
    "errors": {
      "invalidCredentials": "Credenciales invalidas",
      "emailInUse": "Este correo ya esta registrado",
      "weakPassword": "La contrasena debe tener al menos 6 caracteres"
    }
  },
  "migration": {
    "title": "Datos encontrados",
    "message": "Encontramos {count} suscripciones guardadas localmente. Deseas migrarlas a tu cuenta?",
    "migrate": "Migrar datos",
    "discard": "Descartar"
  }
}
```

---

## Archivos a Crear

| Archivo | Proposito |
|---------|-----------|
| `src/lib/supabase.ts` | Cliente Supabase |
| `src/contexts/AuthContext.tsx` | Estado de autenticacion |
| `src/hooks/useAuth.ts` | Hook de auth |
| `src/hooks/useSupabaseSubscriptions.ts` | Sync cloud |
| `src/pages/Login.tsx` | Pagina login |
| `src/pages/Register.tsx` | Pagina registro |
| `src/components/auth/ProtectedRoute.tsx` | Guard de rutas |
| `src/components/auth/MigrationModal.tsx` | Modal migracion |
| `.env.local` | Variables de entorno |

## Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `src/App.tsx` | AuthProvider, nuevas rutas |
| `src/store/subscriptionStore.ts` | Sync cloud, estados loading |
| `src/types/subscription.ts` | Tipos para DB |
| `src/locales/es/translation.json` | Textos auth |
| `.gitignore` | Anadir .env.local |
| `package.json` | Anadir @supabase/supabase-js |

---

## Arquitectura de Datos

```
+-------------------------------------+
|           Supabase Cloud            |
|  +-------------+  +--------------+  |
|  |  Auth Users |  | Subscriptions|  |
|  +-------------+  +--------------+  |
+---------------+---------------------+
                | API + RLS
+---------------v---------------------+
|         Zustand Store               |
|   (In-memory, reactive)             |
+---------------+---------------------+
                | Cache
+---------------v---------------------+
|         localStorage                |
|   (Offline fallback)                |
+-------------------------------------+
```

---

## Flujos de Usuario

### Registro
```
/register -> Form -> supabase.auth.signUp() -> Auto-login -> Dashboard
```

### Login
```
/login -> Form -> supabase.auth.signInWithPassword() ->
  -> localStorage tiene datos? -> MigrationModal -> Dashboard
```

### Logout
```
Header -> Logout -> supabase.auth.signOut() -> /login
```

### CRUD Suscripciones
```
Add/Edit/Delete -> Zustand update (UI instant) ->
  -> Supabase sync (background) -> localStorage cache
```

---

## Variables de Entorno

```env
# .env.local
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx...
```

---

## Seguridad

- **RLS activo**: Usuarios solo ven sus datos
- **Anon key segura**: Disenada para frontend, RLS protege
- **HTTPS**: Forzado por Supabase
- **Passwords**: Minimo 6 caracteres (configurable)
- **Sessions**: Manejadas automaticamente por SDK

---

## Notas

- El tier gratis de Supabase es suficiente para uso personal
- La migracion es opcional (usuario decide)
- Offline funciona con cache localStorage
- Sin cambios visuales, solo funcionalidad
