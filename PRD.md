# PRD: Gestión de Órdenes de Pago a Proveedores

## Contexto
En Ginko construimos interfaces para banca empresarial. Los usuarios consumen estas interfaces desde escritorio, tabletas y dispositivos móviles, por lo cual la responsividad y la calidad de la experiencia son críticas. Esta prueba simula la construcción de una vista de gestión de pagos a proveedores. No buscamos una solución completa de producción, buscamos observar cómo abordas el problema desde cero, cómo organizas el proyecto, cómo tomas decisiones de diseño y cómo documentas tu trabajo.

Tienes el fin de semana completo. La prioridad no es completar el máximo de funcionalidades posibles, sino entregar un trabajo sólido en lo que decidas abarcar. Es preferible un alcance acotado y bien hecho a un alcance amplio y descuidado.

Importante. El próximo martes, miércoles o jueves tendremos una entrevista técnica donde sustentaras tu solución y se te pedirá hacer ajustes de código en vivo sobre tu propio entregable. Esto significa que necesitas conocer a fondo lo que entregas.

## Stack tecnico requerido
- Vue 3 con Composition API.
- Vite como bundler.
- Pinia para manejo de estado global.
- Vue Router.
- Fetch nativo para consumo de API (no Axios).
- Pruebas con Vitest y Vue Test Utils.
- Tailwind 4 para styling.
- Nuxt UI v4 (en su versión para Vue) para componentes de UI.
- No usar TypeScript ni TanStack Query. En su lugar, usar un composable `use-fetch` creado previamente.

## Dominio funcional
La aplicación gestiona órdenes de pago a proveedores. Cada orden tiene los siguientes atributos:
- Identificador único.
- Nombre del proveedor.
- Monto en pesos colombianos.
- Concepto.
- Fecha de creación.
- Estado: BORRADOR, APROBADA, RECHAZADA o PAGADA.

## Funcionalidades a desarrollar
Las funcionalidades se presentan en orden de prioridad. Si el tiempo no alcanza, prioriza las primeras y deja documentado en el README lo que no completaste.

### Bloque 1. Vista de listado de ordenes (prioridad alta)
1. Listar órdenes desde el mock de API.
2. En escritorio mostrar tabla con todos los atributos. En móvil mostrar tarjetas apiladas.
3. El estado debe representarse con un indicador visual de color distinto por cada valor.
4. Manejar tres estados de la vista: cargando, error, vacío. Cada uno con su propio mensaje claro al usuario.
5. Implementar paginación del lado del cliente o servidor (a tu elección, documentar en README).

### Bloque 2. Filtros (prioridad alta)
6. Filtro por estado con opciones: todos, BORRADOR, APROBADA, RECHAZADA, PAGADA.
7. Filtro de búsqueda por nombre de proveedor.
8. Los filtros se combinan en AND.
9. El estado de los filtros debe reflejarse en la URL como query parameters, de modo que al recargar la página se conserven.

### Bloque 3. Formulario de creación (prioridad alta)
10. Vista con formulario para crear una nueva orden.
11. Validaciones de cliente: proveedor requerido, monto requerido y mayor que cero, concepto requerido con máximo doscientos cincuenta caracteres y contador visible.
12. Mostrar mensajes de error a nivel de cada campo.
13. Botón de envío deshabilitado mientras el formulario es inválido o está en proceso de envío.
14. Tras crear exitosamente, redirigir al listado y mostrar la nueva orden sin recargar la página completa.

### Bloque 4. Detalle y transicion de estado (prioridad alta)
15. Al hacer clic en una orden del listado, navegar a una vista de detalle.
16. Mostrar toda la información de la orden.
17. Permitir transicionar el estado según reglas: BORRADOR a APROBADA, BORRADOR a RECHAZADA, APROBADA a PAGADA. Mostrar solo las acciones permitidas según el estado actual.
18. Mostrar confirmación al usuario antes de transicionar.
19. Manejar el caso de error si la API falla en la transicion.

### Bloque 5. Calidad transversal (prioridad alta)
20. Componentes pequeños y con responsabilidad clara.
21. Uso consciente de estado local frente a Pinia. Documentar en README la decisión.
22. Diseño responsivo en al menos tres breakpoints (mobile, tablet, desktop).
23. Pruebas unitarias sobre al menos dos componentes significativos.

### Bloque 6. Funcionalidades adicionales (prioridad media)
Estas funcionalidades suman pero no son obligatorias.
- Composable propio para consumo de la API con manejo unificado de loading y error.
- Optimistic updates al transicionar el estado de una orden.
- Atajos de teclado para acciones frecuentes.
- Modo oscuro.
- Animaciones suaves en transiciones de estado del listado.

## Entregables
- Repositorio público o accesible en GitHub, GitLab o Bitbucket. Si es privado, otorgar acceso de lectura al correo que aparece en el correo de invitación.
- Código fuente completo con historial de commits visible.
- Archivo README en la raíz con: descripción del proyecto, requisitos previos, instrucciones para ejecutar la aplicación y el mock de API, instrucciones para ejecutar las pruebas, decisiones de diseño con justificación, y una sección titulada Pendientes con lo que no alcanzó a completar y por qué.
- Capturas de pantalla o GIF cortos de las vistas principales en mobile y desktop. Es opcional pero suma.

## Reglas de la prueba
- Esta es una prueba individual. El código debe ser tuyo.
- Puedes consultar documentación oficial, libros y artículos públicos.
- Puedes usar herramientas de asistencia que normalmente uses en tu trabajo (incluyendo asistentes de IA), pero recuerda que en la entrevista técnica se te pedirá modificar y explicar el código en vivo, sin asistencia. Si no entiendes tu propio código, será evidente.
- Está prohibido copiar fragmentos significativos de repositorios públicos sin modificación ni atribución. Esto se detecta fácilmente y resulta en descalificación inmediata.
- Si encuentras ambiguedad en el enunciado, toma la decisión que consideres más razonable y documentala en el README.

## Fecha y forma de entrega
Enviar la URL del repositorio al correo desde el cual recibiste el enunciado, antes del domingo 24 de mayo a las 11:59 PM hora de Colombia. Entregas posteriores no podrán ser consideradas en el proceso.

Si el repositorio es privado, incluir en el correo de entrega los usuarios a los que se les debe otorgar acceso de lectura.

## Criterios de evaluación
La evaluación considera cinco dimensiones.
1. **Cumplimiento funcional**: La solución hace lo que el enunciado pide y maneja los casos válidos e invalidos previsibles.
2. **Criterio de componentización**: Componentes pequeños, props y eventos bien definidos, decisiones razonables sobre estado local frente a global, uso de composables.
3. **Calidad de código**: Legibilidad, nombramiento, uso idiomático de Composition API, consistencia, ausencia de código muerto.
4. **Experiencia de usuario**: Estados de carga, error y vacío bien resueltos. Responsividad cuidada. Feedback inmediato al usuario.
5. **Madurez de entrega**: README claro, documentación de decisiones, calidad de commits, facilidad de ejecutar el proyecto siguiendo solo el README.

## Qué se valora especialmente
- Decidir conscientemente qué dejar fuera del alcance y comunicarlo.
- Componentes pequeños, con responsabilidad única y reutilizables.
- Manejo limpio de los tres estados (cargando, error, vacío).
- Uso correcto de la reactividad de Vue 3.
- Separación entre lógica de vista y lógica de dominio.
- README que permita a otra persona ejecutar el proyecto sin asistencia.

## Qué no se valora
- Diseño visual elaborado. Se valora limpieza, no estilo.
- Cantidad de tareas completadas si la calidad es baja.
- Bibliotecas opcionales sin justificación en el README.
- Optimizaciones prematuras.
- Documentación excesivamente larga sin sustancia.

## Sustentación en la entrevista técnica
Entre el martes 26 y el jueves 28 de mayo se realizará la entrevista técnica. En ella
revisaremos juntos tu entregable y se te pedirá.
- Explicar las decisiones de diseño que tomaste.
- Modificar código en vivo sobre tu propio entregable, en respuesta a un cambio de requerimiento que se te planteará durante la sesión.
- Identificar las debilidades de tu solución y proponer cómo las mejorarías si tuvieras más tiempo.
Por eso es fundamental que conozcas tu código a fondo. Una entrega impecable que el candidato no puede explicar ni modificar es una entrega descartada.

---
## Alcance entregado en esta implementación
Basado en la prioridad y el tiempo limitado, se decidió entregar los siguientes bloques completamente:
- **Bloque 1**: Vista de listado de órdenes (tabla en escritorio, tarjetas en móvil, indicadores de estado por color, estados de carga/error/vacío, paginación del lado del cliente).
- **Bloque 2**: Filtros por estado y búsqueda por proveedor, combinados en AND, con sincronización a query params de la URL.
- **Bloque 3**: Formulario de creación con validaciones en tiempo real, mensajes de error por campo, botón de envío deshabilitado cuando inválido o en envío, redirección tras creación exitosa.
- **Bloque 4**: Vista de detalle de orden, transiciones de estado permitidas (BORRADOR→APROBADA, BORRADOR→RECHAZADA, APROBADA→PAGADA), confirmación antes de transicionar, manejo de errores de API.
- **Bloque 5**: Componentes pequeños y con responsabilidad clara, uso consciente de estado local (formulario UI temporal) frente a Pinia (filtros, paginación, selección), diseño responsivo en tres breakpoints (mobile <640px, tablet 640-1023px, desktop ≥1024px), pruebas unitarias y pruebas de integración sobre el formulario de creación.

## Decisiones de diseño y arquitectura
- **Arquitectura basada en módulos**: Cada dominio es un módulo bajo `src/modules/`. El módulo de gestión de órdenes de pago está en `src/modules/payment-order-management/`.
- **Separación de capas API** (inspirada en api-architecture): 
  - Cliente: `src/modules/_core/api/clients/client-fetch.js` (wrapper de fetch nativo).
  - Proveedor: `src/modules/payment-order-management/api/providers/provider-orders.js` (llamadas HTTP a `/mock/orders.json`, cacheo en memoria y persistencia en localStorage).
  - Servicios: `src/modules/payment-order-management/api/services/service-orders.js` (capa de paso con inyección de dependencias, preparada para validación Zod futura).
  - Composables: `src/modules/payment-order-management/api/composables/use-*.js` (encapsulan `useFetch` para consultas y `useMutation` para escritura, con meta para toasts automáticos).
- **Estado global con Pinia**: Solo se usa para estado UI (filtros, paginación, orden seleccionada). El estado del servidor se maneja mediante `useFetch` (caché en Map, control de carreras con AbortController, staleTime).
- **Componentes globales (ABCD+L)**: Sistema propio de 5 categorías con prefijos obligatorios — Atom (A), Base (B), Composite (C), Design (D), Layout (L) — que garantiza que la responsabilidad de cada componente sea predecible solo por su nombre. Los componentes core nunca contienen lógica de negocio.
  - 10 componentes core: ACardInner, BBadge, BCard, BModal, CBadgeStatus, CModalDanger, DActionButtons, DCardHeader, LHeader, LFooter.
- **Componentes de módulo**: Secciones (orquestadores con datos), Formulario inteligente (validación y envío), Campos tontos (solo enlazan modelo), Tabla responsiva, Tarjeta móvil.
- **Responsividad**: Diseño con Tailwind 4 y Nuxt UI v4, doble render en `SectionOrderList.vue` (tabla ≥lg, grid de tarjetas <lg). Tres breakpoints: mobile (<640px), tablet (640-1023px), desktop (≥1024px).
- **Estilos**: Tailwind 4 para layout y responsividad, Nuxt UI v4 para componentes preconstruidos (tabla, tarjeta, botón, input, modal, esqueleto, etc.). Modo oscuro mediante `UColorModeSwitch`.
- **Pruebas**: 
  - Integración: formulario de creación (13 tests: reglas de validación Zod, comportamiento de envío, emisión de eventos, manejo de errores de API).
  - Infraestructura: `package.json`, `vitest.config.js` para ejecutar pruebas con `vitest`.

## Pendientes (no alcanzado por prioridad o tiempo)
- **Optimistic updates** al transicionar estado (no se implementaron por tiempo; además es un patrón que no he practicado recientemente).
- **Atajos de teclado** para acciones frecuentes (Enter para submit, Escape para cancelar). Nuxt UI lo facilita pero quedaron fuera del alcance.
- **Editar órdenes en borrador** (solo se implementó creación y transiciones de estado).
- **Eliminar órdenes** (el provider tiene `deleteOrder` pero no se expuso en la UI).
- **Paginación del lado del servidor** (se implementó del lado del cliente por simplicidad, ya que los datos mock son estáticos).
- **Endpoint real de API** (se usó mock JSON estático servido por Vite, con persistencia en localStorage para mutaciones durante la sesión).
- **Tests de extremo a extremo** (se hicieron unitarios e integración, pero no E2E).

## Instrucciones para ejecutar
1. Clonar el repositorio.
2. Instalar dependencias: `npm install`.
3. Iniciar el mock de API (se sirve estáticamente desde `/mock/orders.json` mediante Vite): `npm run dev`.
4. Abrir en el navegador la URL que muestra Vite (por defecto http://localhost:5173).
5. Ejecutar pruebas: `npm test` (o `vitest`).

## Decisión sobre state local vs Pinia
- **Pinia** se usa exclusivamente para estado que necesita ser compartido entre vistas y persistir durante la navegación: filtros de lista, paginación y la orden actualmente seleccionada (para detalle). Este estado es de UI y no representa datos del servidor.
- **Estado local** (con `ref` o `defineModel`) se usa en componentes que son autónomos y cuyo estado no necesita ser compartido: campos del formulario temporal, estado de carga de mutaciones internas, estado abierto/cerrado de diálogos modales, etc.
Esta separación sigue la estrategia de `state-management-strategy`: Pinia para estado global de UI, `useFetch` (o `useMutation`) para estado del servidor.

---
*PRD generado como parte del proceso de desarrollo dirigido por especificaciones (SDD) para asegurar alineación con requisitos y trazabilidad.*