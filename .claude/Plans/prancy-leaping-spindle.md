# Plan de Funcionalidades - Suscriptio

## ✅ PROGRESO DEL PROYECTO

### Sesión 1: Sistema de Feedback + Export/Import - COMPLETADA ✅
**Fecha**: 08/01/2026
**Estado**: Todas las tareas implementadas y verificadas

**Implementado**:
- ✅ Sistema de toasts con Sonner (tema oscuro)
- ✅ Toasts en CRUD (crear, editar, eliminar)
- ✅ Undo en eliminación (5 segundos para deshacer)
- ✅ Export JSON con metadata versionada
- ✅ Import JSON con modal de confirmación (Reemplazar/Añadir)
- ✅ Página Settings creada (`/settings`)
- ✅ Enlaces en Header y MobileNav

**Archivos creados**:
- `src/utils/exportImport.ts`
- `src/pages/Settings.tsx`

**Archivos modificados**:
- `package.json` (sonner)
- `src/App.tsx`
- `src/locales/es/translation.json`
- `src/store/subscriptionStore.ts`
- `src/components/subscriptions/SubscriptionModal.tsx`
- `src/components/subscriptions/SubscriptionList.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/MobileNav.tsx`

---

### Sesión 2: Mejoras UX Dashboard + Estados Vacíos - COMPLETADA ✅
**Fecha**: 08/01/2026
**Estado**: 3 de 4 tareas completadas (Tarea 2.4 pospuesta)

**Implementado**:
- ✅ EmptyState atractivo para Dashboard con animación pulse-glow
- ✅ Métrica "Costo promedio por suscripción"
- ✅ Contador "X mensuales · Y anuales" en suscripciones activas
- ⏸️ Indicador de tendencia mensual (pospuesto - requiere histórico)

**Archivos creados**:
- `src/components/dashboard/DashboardEmptyState.tsx`

**Archivos modificados**:
- `src/components/dashboard/Dashboard.tsx`
- `src/components/dashboard/KeyMetrics.tsx`
- `src/store/subscriptionStore.ts`
- `src/hooks/useSubscriptions.ts`
- `src/locales/es/translation.json`

---

## Paso 0 — Resumen Arquitectura Actual

### Stack Confirmado
React 19 + TypeScript + Vite 7 + Tailwind v4 + Zustand 5 + Recharts + react-i18next + VitePWA + Supabase (opcional)

### Estructura Principal
```
src/
├── components/
│   ├── dashboard/     → SpendOverview, KeyMetrics, UpcomingPayments, CategoryBreakdown
│   ├── subscriptions/ → List, Card, Form, Modal, DeleteConfirmModal, EmptyState
│   ├── layout/        → AppLayout, Header, MobileNav
│   └── ui/            → Button, Input, Select, Modal, Badge
├── store/             → subscriptionStore.ts (Zustand + persist middleware)
├── hooks/             → useSubscriptions, useSupabaseSubscriptions, useAutoAdvanceDates
├── utils/             → calculations.ts, validation.ts, dateUtils.ts
├── types/             → subscription.ts (interfaces, enums)
└── locales/           → es/translation.json (solo español)
```

### Puntos Calientes (zonas más tocadas)
1. **subscriptionStore.ts** - Cualquier cambio de modelo/queries
2. **SubscriptionList.tsx** - Filtros, búsqueda, ordenación
3. **SubscriptionForm.tsx** - Nuevos campos, validaciones
4. **Dashboard.tsx** y sub-componentes - Nuevas métricas
5. **types/subscription.ts** - Cambios de modelo
6. **locales/es/translation.json** - Todas las nuevas strings

### Persistencia Actual
- Key localStorage: `subscriptions-storage`
- Estructura: `{ state: { subscriptions: [...] }, version: 0 }`
- Sin versionado de schema implementado (version siempre 0)

### Gaps Identificados
- Sin sistema de toasts/notificaciones no intrusivas
- Sin export/import de datos
- Sin soporte multi-moneda real (hardcoded EUR)
- Sin tests
- Sin CI/CD

---

## A) Backlog Priorizado

### P0 - Muy Alta Prioridad (Quick wins + valor inmediato)

| ID | Descripción | Valor | Complejidad | Dependencias |
|----|-------------|-------|-------------|--------------|
| P0-1 | Sistema de toasts/notificaciones | Feedback inmediato al usuario en acciones CRUD | S | Ninguna |
| P0-2 | Undo en eliminación | Evitar pérdida accidental de datos | S | P0-1 |
| P0-3 | Export JSON (backup) | Resguardo de datos del usuario | S | Ninguna |
| P0-4 | Import JSON (restore) | Recuperar datos de backup | S | P0-3 |
| P0-5 | Confirmación al crear/editar | UX: feedback de éxito | S | P0-1 |
| P0-6 | Mejorar estados vacíos | UX: guiar al usuario cuando no hay datos | S | Ninguna |

### P1 - Media Prioridad (Mejoras sustanciales)

| ID | Descripción | Valor | Complejidad | Dependencias |
|----|-------------|-------|-------------|--------------|
| P1-1 | Multi-moneda básica | Soportar USD, EUR, MXN, etc. con selector | M | Migración schema |
| P1-2 | Nuevas métricas dashboard | Costo promedio, tendencia, top categorías | M | Ninguna |
| P1-3 | Vista calendario/timeline | Visualizar pagos en timeline | M | Ninguna |
| P1-4 | Export CSV | Exportar para Excel/Sheets | S | P0-3 |
| P1-5 | Filtros avanzados en lista | Por categoría, rango de precio, rango de fechas | M | Ninguna |
| P1-6 | Sistema de tags/etiquetas | Clasificación flexible además de categorías | M | Migración schema |
| P1-7 | Recordatorios locales (PWA) | Notificaciones de pagos próximos | L | Investigación previa |

### P2 - Nice to Have

| ID | Descripción | Valor | Complejidad | Dependencias |
|----|-------------|-------|-------------|--------------|
| P2-1 | Tema claro/oscuro toggle | Preferencia visual | M | Ninguna |
| P2-2 | Idioma inglés (i18n) | Ampliar audiencia | M | Ninguna |
| P2-3 | Setup ESLint + Prettier | Calidad de código | S | Ninguna |
| P2-4 | Tests unitarios básicos | Confiabilidad en utils | M | P2-3 |
| P2-5 | CI básico (GitHub Actions) | Automatización build/lint | S | P2-3 |
| P2-6 | Accesibilidad (a11y) | Navegación teclado, ARIA labels | M | Ninguna |
| P2-7 | Ordenación persistente | Recordar preferencia de orden | S | Ninguna |

---

## B) Plan por Sesiones

---

### ✅ Sesión 1: Sistema de Feedback + Export/Import - COMPLETADA
**Objetivo**: Implementar toasts y backup/restore de datos
**Estado**: ✅ Implementada el 08/01/2026

#### Tarea 1.1: Instalar y configurar Sonner (toasts) ✅
- **Qué**: Agregar librería Sonner para notificaciones toast
- **Por qué**: Feedback no intrusivo en acciones CRUD, mejor UX
- **Criterios de aceptación**:
  - [x] `npm install sonner` ejecutado
  - [x] `<Toaster />` agregado en App.tsx
  - [x] Configuración de tema oscuro (acorde al diseño)
  - [x] Toast de prueba funciona
- **Archivos**: `package.json`, `src/App.tsx`
- **Edge cases**: Ninguno significativo
- **Verificación**: ✅ App compila, Toaster configurado con tema oscuro

#### Tarea 1.2: Toasts en operaciones CRUD ✅
- **Qué**: Mostrar toasts al crear, editar, eliminar suscripciones
- **Por qué**: Usuario sabe que su acción tuvo efecto
- **Criterios de aceptación**:
  - [x] Toast "Suscripción creada" al agregar
  - [x] Toast "Suscripción actualizada" al editar
  - [x] Toast "Suscripción eliminada" al borrar
  - [x] Todos los mensajes en español (i18n)
- **Archivos**: `src/components/subscriptions/SubscriptionModal.tsx`, `src/components/subscriptions/SubscriptionList.tsx`, `src/locales/es/translation.json`
- **Edge cases**: Error en operación → toast de error (implementado con try/catch)
- **Verificación**: ✅ Implementado con async/await para esperar operación antes de mostrar toast

#### Tarea 1.3: Export JSON (backup) ✅
- **Qué**: Botón para descargar todas las suscripciones como JSON
- **Por qué**: Usuario puede respaldar sus datos
- **Criterios de aceptación**:
  - [x] Botón "Exportar" visible en Settings
  - [x] Click descarga archivo `suscriptio-backup-YYYY-MM-DD.json`
  - [x] JSON incluye array de suscripciones + metadata (version, fecha)
  - [x] Toast confirmando descarga
- **Archivos**: Nuevo `src/utils/exportImport.ts`, `src/pages/Settings.tsx`
- **Edge cases**: Sin suscripciones → toast warning (implementado)
- **Verificación**: ✅ Export funcional con metadata versionada

#### Tarea 1.4: Import JSON (restore) ✅
- **Qué**: Botón para cargar backup JSON y restaurar datos
- **Por qué**: Recuperar datos de backup o migrar entre dispositivos
- **Criterios de aceptación**:
  - [x] Botón "Importar" junto a Exportar
  - [x] Input file acepta solo .json
  - [x] Validación de estructura del JSON
  - [x] Modal de confirmación antes de sobrescribir
  - [x] Opción: "Reemplazar todo" vs "Agregar a existentes"
  - [x] Toast de éxito/error
- **Archivos**: `src/utils/exportImport.ts`, `src/pages/Settings.tsx`, Modal en Settings
- **Edge cases**: JSON inválido → toast error (implementado con validación)
- **Verificación**: ✅ Import con validación y dos modos (replace/add)

#### Tarea 1.5: Undo en eliminación ✅
- **Qué**: Toast con botón "Deshacer" al eliminar suscripción
- **Por qué**: Evitar pérdida accidental, patrón UX común
- **Criterios de aceptación**:
  - [x] Al eliminar, toast dura 5 segundos con botón "Deshacer"
  - [x] Click en Deshacer restaura la suscripción
  - [x] Si no se deshace, eliminación es permanente (timeout de 5s)
- **Archivos**: `SubscriptionList.tsx`, `subscriptionStore.ts` (métodos undoDelete, variables fuera del store)
- **Edge cases**: Usuario navega durante el toast → timeout limpia estado
- **Verificación**: ✅ Undo funciona con estado temporal y timeout

**Resultado sesión 1**: ✅ Sistema de feedback completo + usuarios pueden respaldar y restaurar sus datos

---

### ✅ Sesión 2: Mejoras UX Dashboard + Estados Vacíos - COMPLETADA
**Fecha**: 08/01/2026
**Objetivo**: Pulir experiencia visual y estados edge del dashboard
**Estado**: ✅ Implementada (3 de 4 tareas - Tarea 2.4 pospuesta)

#### Tarea 2.1: Mejorar EmptyState del Dashboard ✅
- **Qué**: Estado vacío atractivo cuando no hay suscripciones
- **Por qué**: Guiar al usuario nuevo, no pantalla "rota"
- **Criterios de aceptación**:
  - [x] Ilustración/icono agradable con animación pulse-glow
  - [x] Mensaje claro "Aún no tienes suscripciones"
  - [x] CTA "Agregar primera suscripción"
  - [x] Animación sutil
- **Archivos**: `src/components/dashboard/Dashboard.tsx`, `src/components/dashboard/DashboardEmptyState.tsx` (nuevo)
- **Edge cases**: Ninguno
- **Verificación**: ✅ Implementado con componente dedicado y animaciones

#### Tarea 2.2: Métricas adicionales - Costo promedio por suscripción ✅
- **Qué**: Nueva tarjeta "Costo promedio" en KeyMetrics
- **Por qué**: Dato útil para entender gasto típico
- **Criterios de aceptación**:
  - [x] Nueva métrica calculada: total mensual / cantidad activas
  - [x] Mostrar en KeyMetrics con icono apropiado (barras verdes)
  - [x] Formato moneda consistente
- **Archivos**: `src/store/subscriptionStore.ts`, `src/components/dashboard/KeyMetrics.tsx`, `src/hooks/useSubscriptions.ts`, traducciones
- **Edge cases**: 0 suscripciones → mostrar €0.00
- **Verificación**: ✅ Implementado con nueva tarjeta en grid 2x2

#### Tarea 2.3: Métricas adicionales - Suscripciones por frecuencia ✅
- **Qué**: Mostrar cuántas son mensuales vs anuales
- **Por qué**: Visibilidad de distribución de pagos
- **Criterios de aceptación**:
  - [x] Contador "X mensuales · Y anuales" en tarjeta de suscripciones activas
  - [x] Texto adicional en subtítulo de la métrica
- **Archivos**: `subscriptionStore.ts` (nuevo getter), `KeyMetrics.tsx`, `useSubscriptions.ts`
- **Edge cases**: Manejo correcto de singular/plural
- **Verificación**: ✅ Implementado en subtítulo de "Suscripciones activas"

#### Tarea 2.4: Indicador de tendencia mensual ⏸️
- **Estado**: POSPUESTA para sesión futura
- **Razón**: Requiere implementar histórico de datos y migración de schema, más complejo de lo previsto
- **Planificado para**: Sesión posterior (requiere versioning de datos)

**Resultado sesión 2**: ✅ Dashboard más informativo con 3 nuevas métricas:
- EmptyState atractivo y funcional
- Costo promedio por suscripción
- Contador de suscripciones por frecuencia (mensuales/anuales)

**Archivos modificados**:
- `src/components/dashboard/Dashboard.tsx`
- `src/components/dashboard/KeyMetrics.tsx`
- `src/store/subscriptionStore.ts`
- `src/hooks/useSubscriptions.ts`
- `src/locales/es/translation.json`

**Archivos creados**:
- `src/components/dashboard/DashboardEmptyState.tsx`

---

---

### Sesión 3: Multi-moneda Básica
**Objetivo**: Permitir seleccionar moneda por suscripción y mostrar totales en moneda preferida

#### Tarea 3.1: Definir lista de monedas soportadas
- **Qué**: Crear constante con monedas: EUR, USD, MXN, GBP, etc.
- **Por qué**: Base para selector y formateo
- **Criterios de aceptación**:
  - [ ] Array de objetos {code, symbol, name}
  - [ ] Al menos 5 monedas comunes
  - [ ] Exportado desde types o constants
- **Archivos**: Nuevo `src/constants/currencies.ts` o en `types/`
- **Edge cases**: Ninguno
- **Verificación**: Importar y usar en consola

#### Tarea 3.2: Selector de moneda en formulario
- **Qué**: Dropdown para elegir moneda al crear/editar suscripción
- **Por qué**: Usuario tiene suscripciones en diferentes monedas
- **Criterios de aceptación**:
  - [ ] Select con monedas disponibles
  - [ ] Valor por defecto: EUR (o última usada)
  - [ ] Muestra símbolo + código (€ EUR)
- **Archivos**: `SubscriptionForm.tsx`, traducciones
- **Edge cases**: Ninguno
- **Verificación**: Crear suscripción con USD, verificar que se guarda

#### Tarea 3.3: Migración de datos existentes
- **Qué**: Asegurar que suscripciones sin currency explícito tengan 'EUR'
- **Por qué**: Compatibilidad con datos existentes
- **Criterios de aceptación**:
  - [ ] Al cargar store, migrar suscripciones sin currency
  - [ ] Incrementar version del schema a 1
  - [ ] Log de migración en consola (dev)
- **Archivos**: `subscriptionStore.ts` (onRehydrateStorage o migrate)
- **Edge cases**: Datos ya migrados no se tocan
- **Verificación**: Con datos viejos en localStorage, recargar y verificar migración

#### Tarea 3.4: Moneda preferida del usuario (settings)
- **Qué**: Configuración de moneda principal para mostrar totales
- **Por qué**: Usuario quiere ver totales en su moneda local
- **Criterios de aceptación**:
  - [ ] Nuevo store o extensión del existente para settings
  - [ ] Selector de moneda preferida
  - [ ] Persistido en localStorage
- **Archivos**: Nuevo `src/store/settingsStore.ts`, UI de settings
- **Edge cases**: Primera vez → default EUR
- **Verificación**: Cambiar moneda preferida, verificar persistencia

#### Tarea 3.5: Mostrar totales filtrados por moneda preferida
- **Qué**: Dashboard muestra totales solo de la moneda preferida, con disclaimer para otras
- **Por qué**: Claridad en métricas sin necesidad de conversión
- **Criterios de aceptación**:
  - [ ] Filtrar cálculos por moneda preferida del usuario
  - [ ] Mostrar disclaimer "Mostrando solo suscripciones en EUR" si hay otras monedas
  - [ ] Indicador de cuántas suscripciones en otras monedas hay
  - [ ] Sin API de conversión por ahora
- **Archivos**: `SpendOverview.tsx`, `calculations.ts`, `subscriptionStore.ts`
- **Edge cases**: Todas las suscripciones en moneda diferente a preferida → warning prominente
- **Verificación**: Suscripciones en EUR y USD con preferida EUR, ver disclaimer y totales correctos

**Resultado sesión 3**: Soporte básico multi-moneda sin conversión automática

---

### Sesión 4: Filtros Avanzados + Ordenación Mejorada
**Objetivo**: Búsqueda y filtrado potente en lista de suscripciones

#### Tarea 4.1: Filtro por categoría (multi-select)
- **Qué**: Poder filtrar por una o varias categorías
- **Por qué**: Encontrar suscripciones específicas rápidamente
- **Criterios de aceptación**:
  - [ ] Dropdown/chips de categorías
  - [ ] Multi-selección
  - [ ] Limpiar filtros fácilmente
- **Archivos**: `SubscriptionList.tsx`, posible nuevo componente FilterBar
- **Edge cases**: Sin categoría asignada → opción "Sin categoría"
- **Verificación**: Filtrar por Streaming + Gaming, verificar resultados

#### Tarea 4.2: Filtro por rango de precio
- **Qué**: Slider o inputs min/max para filtrar por costo
- **Por qué**: Encontrar suscripciones caras/baratas
- **Criterios de aceptación**:
  - [ ] Inputs numéricos o slider dual
  - [ ] Filtrado en tiempo real
  - [ ] Reset a valores por defecto
- **Archivos**: `SubscriptionList.tsx`, FilterBar
- **Edge cases**: Max < Min → ignorar o mostrar error
- **Verificación**: Filtrar €5-€15, verificar resultados

#### Tarea 4.3: Filtro por rango de fechas (próximo pago)
- **Qué**: Filtrar suscripciones que vencen en rango de fechas
- **Por qué**: Ver qué pagos vienen en los próximos N días
- **Criterios de aceptación**:
  - [ ] Date pickers para desde/hasta
  - [ ] Presets: "Próximos 7 días", "Este mes", "Próximos 30 días"
- **Archivos**: `SubscriptionList.tsx`, FilterBar
- **Edge cases**: Fecha pasada en "desde" → incluir atrasados
- **Verificación**: Filtrar próxima semana, verificar resultados

#### Tarea 4.4: Persistir preferencias de filtro/orden
- **Qué**: Recordar último filtro/orden usado
- **Por qué**: No tener que reconfigurar cada vez
- **Criterios de aceptación**:
  - [ ] Guardar en localStorage (separado del store principal)
  - [ ] Restaurar al cargar página
  - [ ] Botón "Limpiar filtros" resetea a default
- **Archivos**: `SubscriptionList.tsx`, posible `useFilterPreferences` hook
- **Edge cases**: Datos corruptos → usar defaults
- **Verificación**: Filtrar, recargar página, verificar que filtros persisten

**Resultado sesión 4**: Sistema de filtrado potente y persistente

---

### Sesión 5: Vista Calendario/Timeline
**Objetivo**: Visualización temporal de pagos próximos

#### Tarea 5.1: Componente Timeline básico
- **Qué**: Vista de línea temporal con pagos próximos
- **Por qué**: Visualizar distribución de pagos en el tiempo
- **Criterios de aceptación**:
  - [ ] Muestra próximos 30-60 días
  - [ ] Cada pago como punto/tarjeta en la línea
  - [ ] Scroll horizontal o vertical
- **Archivos**: Nuevo `src/components/dashboard/PaymentTimeline.tsx`
- **Edge cases**: Sin pagos próximos → mensaje vacío
- **Verificación**: Con varias suscripciones, ver timeline

#### Tarea 5.2: Interacción en Timeline
- **Qué**: Click en pago abre detalle/edición
- **Por qué**: Navegación rápida desde timeline
- **Criterios de aceptación**:
  - [ ] Hover muestra tooltip con nombre + monto
  - [ ] Click abre modal de edición
- **Archivos**: `PaymentTimeline.tsx`
- **Edge cases**: Múltiples pagos mismo día → apilar o expandir
- **Verificación**: Hover y click en pagos del timeline

#### Tarea 5.3: Vista mes calendario (opcional)
- **Qué**: Calendario mensual con días marcados
- **Por qué**: Alternativa visual al timeline
- **Criterios de aceptación**:
  - [ ] Grid de calendario del mes actual
  - [ ] Días con pago tienen indicador
  - [ ] Navegación mes anterior/siguiente
- **Archivos**: Nuevo `src/components/dashboard/CalendarView.tsx`
- **Edge cases**: Mes sin pagos → calendario vacío con mensaje
- **Verificación**: Navegar meses, ver indicadores

#### Tarea 5.4: Toggle Timeline/Calendario en Dashboard
- **Qué**: Permitir cambiar entre vistas
- **Por qué**: Usuario elige visualización preferida
- **Criterios de aceptación**:
  - [ ] Tabs o toggle switch
  - [ ] Recordar preferencia
- **Archivos**: `Dashboard.tsx`
- **Edge cases**: Ninguno
- **Verificación**: Cambiar vista, recargar, verificar persistencia

**Resultado sesión 5**: Nueva forma de visualizar pagos temporalmente

---

### Sesión 6: Sistema de Tags/Etiquetas
**Objetivo**: Clasificación flexible adicional a categorías

#### Tarea 6.1: Modelo de datos para tags
- **Qué**: Agregar campo `tags: string[]` a Subscription
- **Por qué**: Permite clasificación flexible definida por usuario
- **Criterios de aceptación**:
  - [ ] Nuevo campo opcional en interface
  - [ ] Migración para suscripciones existentes (tags: [])
  - [ ] Schema version bump
- **Archivos**: `types/subscription.ts`, `subscriptionStore.ts`
- **Edge cases**: Datos existentes sin tags
- **Verificación**: Recargar con datos viejos, verificar migración

#### Tarea 6.2: Input de tags en formulario
- **Qué**: Campo para agregar/quitar tags al crear/editar
- **Por qué**: Usuario define sus propias etiquetas
- **Criterios de aceptación**:
  - [ ] Input con chips/badges para tags existentes
  - [ ] Autocompletado con tags usados previamente
  - [ ] Agregar nuevo tag con Enter o coma
  - [ ] Quitar tag con click en X
- **Archivos**: `SubscriptionForm.tsx`, posible nuevo `TagInput.tsx`
- **Edge cases**: Tag duplicado → ignorar, tag vacío → ignorar
- **Verificación**: Agregar tags, quitar, guardar, verificar persistencia

#### Tarea 6.3: Filtro por tags
- **Qué**: Filtrar lista de suscripciones por tags
- **Por qué**: Encontrar suscripciones por clasificación personalizada
- **Criterios de aceptación**:
  - [ ] Multi-select de tags existentes
  - [ ] Filtro AND u OR (configurable o default OR)
- **Archivos**: `SubscriptionList.tsx`, FilterBar
- **Edge cases**: Tag eliminado de todas las suscripciones → no aparece en filtro
- **Verificación**: Filtrar por tag, verificar resultados

#### Tarea 6.4: Mostrar tags en SubscriptionCard
- **Qué**: Visualizar tags asignados en cada tarjeta
- **Por qué**: Identificar clasificación rápidamente
- **Criterios de aceptación**:
  - [ ] Chips pequeños debajo del nombre o junto a categoría
  - [ ] Máximo 3 visibles + "+N más" si hay más
  - [ ] Colores consistentes o hash-based
- **Archivos**: `SubscriptionCard.tsx`
- **Edge cases**: Sin tags → no mostrar nada
- **Verificación**: Suscripción con 5 tags, ver truncamiento

**Resultado sesión 6**: Sistema de tags completamente funcional

---

### ✅ Sesión 7: Calidad de Código + CI Básico - COMPLETADA
**Fecha**: 29/01/2026
**Objetivo**: Establecer estándares de código y automatización
**Estado**: ✅ Implementada

#### Tarea 7.1: Configurar ESLint ✅
- **Qué**: Setup ESLint con reglas para React + TypeScript
- **Por qué**: Detectar errores y mantener consistencia
- **Criterios de aceptación**:
  - [x] `npm install eslint @eslint/js typescript-eslint eslint-plugin-react-hooks`
  - [x] Archivo `eslint.config.js` configurado (flat config)
  - [x] Script `npm run lint` funciona
  - [x] Cero errores críticos (13 warnings aceptables)
- **Archivos**: `package.json`, `eslint.config.js`
- **Verificación**: ✅ `npm run lint` pasa con 0 errores

#### Tarea 7.2: Configurar Prettier ✅
- **Qué**: Formateo automático de código
- **Por qué**: Consistencia de estilo sin discusiones
- **Criterios de aceptación**:
  - [x] `npm install prettier eslint-config-prettier`
  - [x] Archivo `.prettierrc` con config básica
  - [x] Script `npm run format` y `npm run format:check`
  - [x] Integración con ESLint (eslint-config-prettier)
- **Archivos**: `package.json`, `.prettierrc`, `.prettierignore`
- **Verificación**: ✅ `npm run format` formatea archivos correctamente

#### Tarea 7.3: Tests unitarios para utils ✅
- **Qué**: Tests para calculations.ts, dateUtils.ts, validation.ts
- **Por qué**: Confianza en lógica crítica de cálculos
- **Criterios de aceptación**:
  - [x] Setup Vitest en `vite.config.ts`
  - [x] Tests para normalizeToMonthly, normalizeToYearly, formatCurrency
  - [x] Tests para formatDate, getDaysUntilPayment, advancePaymentDate
  - [x] Tests para validateSubscriptionForm (todos los campos)
  - [x] Script `npm run test` y `npm run test:watch`
- **Archivos**: `vite.config.ts`, `src/utils/*.test.ts`
- **Edge cases**: Fechas edge (fin de mes, año bisiesto) cubiertos
- **Verificación**: ✅ 64 tests pasando

#### Tarea 7.4: GitHub Actions - CI básico ✅
- **Qué**: Workflow que ejecuta lint + test + build en PRs
- **Por qué**: Validación automática antes de merge
- **Criterios de aceptación**:
  - [x] Archivo `.github/workflows/ci.yml`
  - [x] Jobs: lint, test, build (build depende de lint y test)
  - [x] Ejecuta en push a main/master y PRs
  - [ ] Badge de status en README (pendiente para próxima sesión)
- **Archivos**: `.github/workflows/ci.yml`
- **Verificación**: ✅ Workflow configurado, listo para activarse en push

**Resultado sesión 7**: ✅ Pipeline de calidad establecido
- ESLint con reglas para React + TypeScript
- Prettier con eslint-config-prettier
- 64 tests unitarios para utils
- GitHub Actions CI con lint, test y build

**Archivos creados**:
- `eslint.config.js`
- `.prettierrc`
- `.prettierignore`
- `src/utils/calculations.test.ts`
- `src/utils/dateUtils.test.ts`
- `src/utils/validation.test.ts`
- `.github/workflows/ci.yml`

**Archivos modificados**:
- `package.json` (scripts y dependencias)
- `vite.config.ts` (configuración Vitest)

---

### ✅ Sesión 8: Export CSV + Mejoras Analíticas - COMPLETADA
**Fecha**: 29/01/2026
**Objetivo**: Exportación para spreadsheets y métricas avanzadas
**Estado**: ✅ Implementada

#### Tarea 8.1: Export CSV ✅
- **Qué**: Descargar suscripciones en formato CSV
- **Por qué**: Abrir en Excel/Google Sheets para análisis
- **Criterios de aceptación**:
  - [x] Botón "Exportar CSV" junto a JSON
  - [x] Columnas: nombre, costo, moneda, frecuencia, próximo pago, estado, categoría, etiquetas, notas, URL
  - [x] Encoding UTF-8 con BOM para Excel
  - [x] Nombre archivo: `suscriptio-YYYY-MM-DD.csv`
- **Archivos**: `src/utils/exportImport.ts`, `src/pages/Settings.tsx`
- **Edge cases**: Campos con comas → escapado con comillas
- **Verificación**: ✅ Exporta correctamente con encoding UTF-8 BOM

#### Tarea 8.2: Métrica - Top 3 categorías por gasto ✅
- **Qué**: Mostrar las 3 categorías con mayor gasto mensual
- **Por qué**: Identificar dónde va más dinero
- **Criterios de aceptación**:
  - [x] Lista ordenada de categorías por gasto
  - [x] Mostrar nombre + monto + porcentaje del total
  - [x] Máximo 3, con colores distintivos por categoría
- **Archivos**: Nuevo `src/components/dashboard/TopCategories.tsx`, `src/hooks/useSubscriptions.ts`, `Dashboard.tsx`
- **Edge cases**: Menos de 3 categorías → muestra las que hay
- **Verificación**: ✅ Componente implementado con diseño consistente

#### Tarea 8.3: Métrica - Proyección anual detallada ✅
- **Qué**: Desglose de gasto anual por mes (considerando frecuencias)
- **Por qué**: Ver distribución real de pagos anuales en el año
- **Criterios de aceptación**:
  - [x] Gráfico de barras apiladas con 12 meses
  - [x] Pagos anuales aparecen solo en su mes correspondiente (color naranja)
  - [x] Pagos mensuales distribuidos uniformemente (color cyan)
  - [x] Tooltip detallado con desglose
  - [x] Total proyectado visible
- **Archivos**: Nuevo `src/components/dashboard/AnnualProjection.tsx`, `Dashboard.tsx`
- **Edge cases**: Suscripción anual detecta el mes correcto
- **Verificación**: ✅ Gráfico Recharts con barras apiladas funcionando

**Resultado sesión 8**: ✅ Exportación versátil + insights analíticos mejorados

**Archivos creados**:
- `src/components/dashboard/TopCategories.tsx`
- `src/components/dashboard/AnnualProjection.tsx`

**Archivos modificados**:
- `src/utils/exportImport.ts` (función exportToCsv)
- `src/pages/Settings.tsx` (botones JSON/CSV)
- `src/hooks/useSubscriptions.ts` (topCategories)
- `src/components/dashboard/Dashboard.tsx` (integración componentes)
- `src/locales/es/translation.json` (traducciones)

---

### ✅ Sesión 9: Accesibilidad + Notificaciones PWA - COMPLETADA
**Fecha**: 29/01/2026
**Objetivo**: Mejorar accesibilidad y explorar notificaciones locales
**Estado**: ✅ Implementada

#### Tarea 9.1: Audit de accesibilidad ✅
- **Qué**: Revisar y corregir issues de a11y
- **Por qué**: App usable por todos
- **Criterios de aceptación**:
  - [x] Audit completo del codebase (análisis de componentes UI)
  - [x] ARIA labels en elementos interactivos
  - [x] Labels vinculadas a inputs con htmlFor y useId
  - [x] Errores con role="alert" y aria-describedby
- **Archivos**: Componentes UI corregidos
- **Verificación**: ✅ Componentes UI accesibles con ARIA correctos

#### Tarea 9.2: Navegación completa por teclado ✅
- **Qué**: Tab order lógico, Enter/Space activan elementos
- **Por qué**: Usuarios que no usan mouse
- **Criterios de aceptación**:
  - [x] Todos los botones accesibles con Tab
  - [x] Modales atrapan focus (focus trap implementado)
  - [x] Escape cierra modales
  - [x] Skip link al contenido principal
  - [x] SubscriptionCard navegable con teclado (role="button", tabIndex)
  - [x] aria-current="page" en navegación
- **Archivos**: `Modal.tsx`, `AppLayout.tsx`, `Header.tsx`, `MobileNav.tsx`, `SubscriptionCard.tsx`, `DeleteConfirmModal.tsx`
- **Verificación**: ✅ Focus trap funcional, skip link implementado

#### Tarea 9.3: Investigar notificaciones PWA ✅
- **Qué**: Documentar posibilidades y limitaciones de notificaciones locales
- **Por qué**: Recordatorios de pagos próximos
- **Criterios de aceptación**:
  - [x] Documento con findings: Notification API, Service Worker, limitaciones iOS
  - [x] Análisis de Web Push API vs Notification API
  - [x] Decisión GO para implementación limitada
- **Archivos**: `docs/pwa-notifications-research.md`
- **Verificación**: ✅ Documento completo con recomendación

#### Tarea 9.4: Recordatorios locales ✅
- **Qué**: Sistema de recordatorios usando Notification API
- **Por qué**: Usuario no olvida pagos
- **Criterios de aceptación**:
  - [x] Pedir permiso de notificaciones
  - [x] Configurar días antes del pago para recordar (1, 2, 3, 7 días)
  - [x] Notificación local cuando la app está abierta
  - [x] UI de configuración en Settings
  - [x] Disclaimer claro sobre limitaciones
- **Archivos**: `src/store/reminderStore.ts`, `src/hooks/useReminders.ts`, `src/pages/Settings.tsx`
- **Verificación**: ✅ Sistema completo implementado con toggle, selector de días y disclaimer

**Resultado sesión 9**: ✅ App accesible + sistema de recordatorios implementado

**Archivos creados**:
- `src/store/reminderStore.ts`
- `src/hooks/useReminders.ts`
- `docs/pwa-notifications-research.md`

**Archivos modificados**:
- `src/components/ui/Input.tsx` (htmlFor, aria-*, useId)
- `src/components/ui/Select.tsx` (htmlFor, aria-*, useId)
- `src/components/ui/Modal.tsx` (focus trap, role="dialog", aria-modal, aria-labelledby)
- `src/components/layout/AppLayout.tsx` (skip-to-content link, aria-hidden)
- `src/components/layout/Header.tsx` (aria-current="page", aria-hidden en SVGs)
- `src/components/layout/MobileNav.tsx` (aria-current="page", aria-hidden en SVGs)
- `src/components/subscriptions/SubscriptionCard.tsx` (role="button", tabIndex, keyboard handlers)
- `src/components/subscriptions/DeleteConfirmModal.tsx` (focus trap, role="alertdialog")
- `src/pages/Settings.tsx` (sección de recordatorios)
- `src/locales/es/translation.json` (traducciones de nav y reminders)

---

### ✅ Sesión 10: Pulido Final + i18n Inglés - COMPLETADA
**Fecha**: 30/01/2026
**Objetivo**: Preparar para release público
**Estado**: ✅ Implementada

#### Tarea 10.1: Agregar idioma inglés ✅
- **Qué**: Traducir toda la app a inglés
- **Por qué**: Ampliar audiencia internacional
- **Criterios de aceptación**:
  - [x] Archivo `locales/en/translation.json` completo
  - [x] Selector de idioma en settings
  - [x] Persistir preferencia en settingsStore
  - [x] Todas las strings usando i18n (corregidos textos hardcoded)
- **Archivos**: `locales/en/translation.json`, `src/config/i18n.ts`, `src/store/settingsStore.ts`, `src/pages/Settings.tsx`
- **Verificación**: ✅ Cambio de idioma funciona correctamente

#### Tarea 10.2: Revisar responsive mobile ✅
- **Qué**: Verificar y corregir issues en móvil
- **Por qué**: PWA debe ser mobile-first
- **Criterios de aceptación**:
  - [x] Grid con `minmax(min(100%, 400px), 1fr)` para viewports pequeños
  - [x] Textos hardcoded traducidos (EmptyState, Modal, CategoryBreakdown, etc.)
  - [x] Modales con `maxHeight: 85vh` y scroll
- **Archivos**: `Dashboard.tsx`, `SubscriptionList.tsx`, `Modal.tsx`, `EmptyState.tsx`, `CategoryBreakdown.tsx`
- **Verificación**: ✅ Responsive en 375px y 390px

#### Tarea 10.3: Optimización de bundle ✅
- **Qué**: Analizar y reducir tamaño de bundle
- **Por qué**: Mejor performance, especialmente móvil
- **Criterios de aceptación**:
  - [x] Lazy loading de rutas con React.lazy() y Suspense
  - [x] Manual chunks para vendors (react, router, charts, i18n, utils)
  - [x] Bundle principal: 394KB (114KB gzipped) - antes 1051KB (298KB gzipped)
  - [x] Recharts separado como chunk independiente (362KB)
- **Archivos**: `src/App.tsx`, `vite.config.ts`
- **Verificación**: ✅ Build exitoso con code splitting

#### Tarea 10.4: README actualizado ✅
- **Qué**: Documentar todas las features implementadas
- **Por qué**: Onboarding de nuevos usuarios/contribuidores
- **Criterios de aceptación**:
  - [x] Lista completa de features organizadas por categoría
  - [x] Tech stack actualizado
  - [x] Instrucciones de desarrollo
  - [x] Estructura del proyecto
  - [x] Tabla de scripts disponibles
- **Archivos**: `README.md`
- **Verificación**: ✅ README completo y actualizado

**Resultado sesión 10**: ✅ App lista para release público

**Archivos creados**:
- `src/locales/en/translation.json`

**Archivos modificados**:
- `src/config/i18n.ts` (soporte inglés + detección de idioma)
- `src/store/settingsStore.ts` (language + setLanguage)
- `src/pages/Settings.tsx` (selector de idioma)
- `src/locales/es/translation.json` (nuevas keys)
- `src/App.tsx` (lazy loading de rutas)
- `vite.config.ts` (manual chunks)
- `src/components/dashboard/Dashboard.tsx` (responsive fix)
- `src/components/subscriptions/SubscriptionList.tsx` (traducciones)
- `src/components/subscriptions/EmptyState.tsx` (traducciones)
- `src/components/subscriptions/SubscriptionModal.tsx` (traducciones)
- `src/components/dashboard/CategoryBreakdown.tsx` (traducciones)
- `src/components/ui/Modal.tsx` (traducciones)
- `README.md` (documentación completa)

---

## C) Primera Sesión Sugerida (Detalle Implementación)

### Sesión 1: Sistema de Feedback + Export/Import

Esta sesión es la más rentable porque:
1. **Quick win**: Toasts mejoran UX inmediatamente con poco código
2. **Alto valor**: Export/Import da tranquilidad al usuario sobre sus datos
3. **Bajo riesgo**: No modifica modelo de datos ni rompe funcionalidad existente
4. **Fundacional**: Toasts se reutilizarán en todas las features futuras

---

#### Paso 1.1: Instalar Sonner

```bash
npm install sonner
```

Modificar `src/App.tsx`:
```tsx
import { Toaster } from 'sonner'

// Dentro del return, después de Routes:
<Toaster
  position="bottom-right"
  toastOptions={{
    style: {
      background: '#111111',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#fff',
    },
  }}
/>
```

**Verificar**: App carga sin errores, Toaster invisible hasta que se llame

---

#### Paso 1.2: Agregar traducciones para toasts

En `src/locales/es/translation.json`, agregar:
```json
{
  "toasts": {
    "subscriptionCreated": "Suscripción creada correctamente",
    "subscriptionUpdated": "Suscripción actualizada",
    "subscriptionDeleted": "Suscripción eliminada",
    "undo": "Deshacer",
    "undoSuccess": "Suscripción restaurada",
    "exportSuccess": "Backup descargado correctamente",
    "importSuccess": "Datos importados correctamente",
    "importError": "Error al importar: archivo inválido"
  }
}
```

---

#### Paso 1.3: Integrar toasts en CRUD

En `src/components/subscriptions/SubscriptionModal.tsx`:
```tsx
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

// En handleSubmit después de addSubscription/updateSubscription:
toast.success(isEditing ? t('toasts.subscriptionUpdated') : t('toasts.subscriptionCreated'))
```

En `src/components/subscriptions/SubscriptionList.tsx`:
```tsx
// En handleDelete después de deleteSubscription:
toast.success(t('toasts.subscriptionDeleted'))
```

---

#### Paso 1.4: Crear utilidades de export/import

Crear `src/utils/exportImport.ts`:
```tsx
import type { Subscription } from '../types/subscription'

interface BackupData {
  version: number
  exportedAt: string
  subscriptions: Subscription[]
}

export function exportToJson(subscriptions: Subscription[]): void {
  const data: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    subscriptions,
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `suscriptio-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function validateBackupFile(data: unknown): data is BackupData {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  return (
    typeof d.version === 'number' &&
    typeof d.exportedAt === 'string' &&
    Array.isArray(d.subscriptions)
  )
}

export async function importFromJson(file: File): Promise<Subscription[]> {
  const text = await file.text()
  const data = JSON.parse(text)

  if (!validateBackupFile(data)) {
    throw new Error('Invalid backup file format')
  }

  return data.subscriptions
}
```

---

#### Paso 1.5: Crear página Settings con Export/Import

Crear nueva ruta `/settings` con página de configuración:
- Nueva página `src/pages/Settings.tsx`
- Sección "Datos" con botones Export/Import
- Ícono de descarga → `exportToJson(subscriptions)`
- Ícono de subida → input file hidden + `importFromJson()`
- Agregar enlace a Settings en MobileNav y Header

Modal de confirmación para import:
- "¿Reemplazar datos existentes o agregar a los actuales?"
- Opciones: "Reemplazar todo" / "Agregar" / "Cancelar"

---

#### Paso 1.6: Implementar Undo en eliminación

Modificar `subscriptionStore.ts`:
```tsx
// Nuevo estado temporal para undo
let deletedSubscription: Subscription | null = null
let undoTimeout: NodeJS.Timeout | null = null

// Modificar deleteSubscription para soft delete con undo
deleteSubscription: (id) => {
  const sub = get().subscriptions.find(s => s.id === id)
  if (sub) {
    deletedSubscription = sub
    // ... eliminar del store

    // Auto-confirmar después de 5 segundos
    undoTimeout = setTimeout(() => {
      deletedSubscription = null
    }, 5000)
  }
}

// Nuevo método
undoDelete: () => {
  if (deletedSubscription && undoTimeout) {
    clearTimeout(undoTimeout)
    // Restaurar al store
    set(state => ({ subscriptions: [...state.subscriptions, deletedSubscription!] }))
    deletedSubscription = null
  }
}
```

En el toast de eliminación:
```tsx
toast.success(t('toasts.subscriptionDeleted'), {
  action: {
    label: t('toasts.undo'),
    onClick: () => {
      undoDelete()
      toast.success(t('toasts.undoSuccess'))
    },
  },
  duration: 5000,
})
```

---

### Resultado Final Sesión 1

Al completar esta sesión tendrás:
- Sistema de toasts funcionando para todas las operaciones
- Export JSON con estructura versionada
- Import JSON con validación y opciones
- Undo en eliminación (5 segundos para deshacer)
- Base sólida para feedback en features futuras

**Archivos modificados/creados**:
1. `package.json` (nueva dependencia sonner)
2. `src/App.tsx` (Toaster + nueva ruta /settings)
3. `src/locales/es/translation.json` (nuevas strings)
4. `src/utils/exportImport.ts` (nuevo)
5. `src/pages/Settings.tsx` (nuevo - página de configuración)
6. `src/components/subscriptions/SubscriptionModal.tsx` (toasts)
7. `src/components/subscriptions/SubscriptionList.tsx` (toasts + undo)
8. `src/store/subscriptionStore.ts` (undoDelete)
9. `src/components/layout/Header.tsx` (enlace a Settings)
10. `src/components/layout/MobileNav.tsx` (enlace a Settings)

---

## Notas Finales

- Cada sesión está diseñada para 2-4 horas de trabajo
- PRs pequeños: idealmente 1 PR por tarea o 1 PR por sesión
- El orden de sesiones puede ajustarse según prioridades del negocio
- Sesiones 7+ son mejoras de calidad que pueden paralelizarse o postponerse

**Esperando tu "GO sesión 1" para comenzar implementación.**
