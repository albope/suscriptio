# Investigación: Notificaciones PWA para Suscriptio

## Resumen Ejecutivo

Este documento analiza las opciones de notificaciones para recordar pagos próximos en Suscriptio, considerando que es una PWA sin backend.

## Tecnologías Disponibles

### 1. Notification API (Local Notifications)
**Soporte**: Chrome, Firefox, Edge, Safari (desde 16.4 en iOS)

```javascript
// Solicitar permiso
const permission = await Notification.requestPermission();

// Mostrar notificación
new Notification('Pago próximo', {
  body: 'Netflix vence mañana',
  icon: '/icons/icon-192x192.png'
});
```

**Ventajas**:
- No requiere backend
- Funciona mientras la app esté abierta
- Fácil implementación

**Limitaciones**:
- Solo funciona con la app/pestaña abierta
- No hay programación de futuro (no se puede decir "notifica mañana")

### 2. Web Push API + Service Worker
**Soporte**: Chrome, Firefox, Edge | **NO en iOS Safari**

```javascript
// Requiere backend con Web Push
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
});
```

**Ventajas**:
- Notificaciones incluso con app cerrada
- Programables desde servidor

**Limitaciones**:
- ❌ **Requiere backend** (servidor push)
- ❌ **NO funciona en iOS Safari** (limitación crítica)
- Complejidad adicional (VAPID keys, servicio push)

### 3. Background Sync API
**Soporte**: Chrome, Edge (limitado)

```javascript
// Service Worker
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-payments') {
    event.waitUntil(checkUpcomingPayments());
  }
});
```

**Ventajas**:
- Puede ejecutar código periódicamente

**Limitaciones**:
- ❌ No garantiza ejecución en momento específico
- ❌ Soporte muy limitado (solo Chromium)
- ❌ Chrome lo limita severamente en PWAs

## Tabla Comparativa de Soporte

| Característica | Chrome | Firefox | Safari Desktop | Safari iOS | Edge |
|---------------|--------|---------|----------------|------------|------|
| Notification API | ✅ | ✅ | ✅ | ✅ (16.4+) | ✅ |
| Web Push | ✅ | ✅ | ✅ | ❌ | ✅ |
| Background Sync | ✅ | ❌ | ❌ | ❌ | ✅ |
| PWA Install | ✅ | ❌ | ✅ | ✅ | ✅ |

## Recomendación para Suscriptio

### Enfoque Híbrido (Sin Backend)

Dado que Suscriptio no tiene backend, recomendamos:

1. **Notificaciones In-App** (Implementar)
   - Badge/indicador visual de pagos próximos
   - Banner/toast al abrir la app
   - Funciona en todos los dispositivos

2. **Notification API** (Implementar)
   - Solicitar permiso al usuario
   - Mostrar notificación cuando la app está abierta
   - Check automático cada X minutos mientras está activa

3. **Recordatorios al Abrir la App**
   - Al iniciar, verificar pagos en próximas 24-48 horas
   - Mostrar modal/alerta destacada

### Limitaciones a Comunicar al Usuario

- ⚠️ "Los recordatorios solo funcionan mientras la app esté abierta"
- ⚠️ "Para no olvidar pagos, abre la app regularmente"
- 💡 "Añade un acceso directo a tu pantalla de inicio"

## Implementación Propuesta

### Hook: useReminders

```typescript
interface ReminderSettings {
  enabled: boolean;
  daysBeforePayment: number; // 1, 2, 3, 7
  notificationTime: string; // "09:00"
}

const useReminders = () => {
  // Verificar permisos
  // Configurar intervalo de check
  // Mostrar notificaciones cuando corresponda
};
```

### Configuración en Settings

- Toggle: "Activar recordatorios"
- Select: "Días antes del pago" (1, 2, 3, 7)
- Disclaimer: "Funciona mientras la app esté abierta"

## Decisión GO/NO-GO

### ✅ GO - Implementar sistema de recordatorios limitado

**Razones**:
1. Mejora UX significativa sin complejidad
2. No requiere backend
3. Funciona razonablemente bien en PWA abierta
4. Preparado para futuro (si se añade backend, fácil de extender)

**Scope**:
- Notification API para alertas inmediatas
- Check periódico mientras app está abierta
- UI de configuración en Settings
- Indicadores visuales en Dashboard

**NO incluir**:
- Web Push (requiere backend)
- Background Sync (soporte limitado)
- Notificaciones programadas a futuro

## Referencias

- [MDN: Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [web.dev: Push Notifications](https://web.dev/push-notifications-overview/)
- [Apple: Web Push in Safari](https://webkit.org/blog/12945/meet-web-push/)
