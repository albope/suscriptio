# Changelog

Todos los cambios notables en este proyecto seran documentados en este archivo.

El formato esta basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

## [1.0.0] - 2026-01-08

### Added
- **Mejoras visuales y nuevas funcionalidades** (4ef2a2b)
  - Integracion con Supabase (backend + auth)
  - Sistema de autenticacion (login/registro)
  - Sincronizacion de datos con la nube
  - Modal de migracion para datos locales existentes
  - Rutas protegidas
  - Contexto de autenticacion (AuthContext)
  - Hook useSupabaseSubscriptions para sync
  - Paginas Login y Register
  - Componente ProtectedRoute
  - Cliente Supabase configurado

### Changed
- Store actualizado para soportar sync con backend
- Rutas actualizadas con proteccion de auth

## [0.1.0] - 2024-12-29

### Added
- **MVP Completo** (bfbd2bb)
  - Setup React 19 + TypeScript + Vite
  - Tema oscuro futurista con acentos cyan/purple
  - Componentes UI con glassmorphism
  - Dashboard con resumen de gastos
  - Metricas clave (suscripciones activas, mas cara)
  - Desglose por categoria con grafico de barras
  - CRUD completo de suscripciones
  - Persistencia con localStorage
  - Diseno responsive con navegacion movil
  - Soporte i18n (Espanol)
  - Logo y favicon personalizados
  - Configuracion PWA (instalable)

### Components Created
- Dashboard: SpendOverview, UpcomingPayments, CategoryBreakdown, KeyMetrics
- Subscriptions: SubscriptionList, SubscriptionCard, SubscriptionForm, SubscriptionModal, EmptyState, DeleteConfirmModal
- Layout: AppLayout, Header, MobileNav
- UI: Button, Input, Select, Modal, Badge

### Technical
- Zustand store con persistencia localStorage
- React Router para navegacion
- Recharts para visualizacion
- react-i18next para internacionalizacion
- date-fns para manejo de fechas
- vite-plugin-pwa para PWA

## [0.0.1] - 2024-12-29

### Added
- **Setup inicial** (3c11f03)
  - Documentacion PSB workflow
  - CLAUDE.md con instrucciones del proyecto
  - Estructura de carpeta docs/

---

## Leyenda

- **Added**: Nuevas funcionalidades
- **Changed**: Cambios en funcionalidades existentes
- **Deprecated**: Funcionalidades que seran eliminadas
- **Removed**: Funcionalidades eliminadas
- **Fixed**: Correcciones de bugs
- **Security**: Mejoras de seguridad
