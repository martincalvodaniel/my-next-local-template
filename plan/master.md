# Plan maestro

## Estado actual

Plantilla técnica sin dominio de negocio definido. Incluye Google OAuth con lista de acceso, cookies de sesión, layout protegido y capa MongoDB sin colecciones ni índices de negocio. El inventario y la configuración se describen en [README.md](../README.md).

La autenticación no utiliza un adaptador persistente MongoDB. No existen funcionalidades offline, sincronización, PDF ni despliegue preconfigurado. Estos elementos requieren alcance y decisiones propios si el producto los necesita.

## Definición del próximo producto

Completar al crear una aplicación a partir de esta base:

| Decisión | Estado |
| --- | --- |
| Nombre y objetivo | Pendiente de definición humana |
| Usuarios y problema que resuelve | Pendiente |
| MVP y criterios de éxito | Pendiente |
| Fuera de alcance | Pendiente |
| Idioma de interfaz | Pendiente; la base tiene `lang="es"` y textos mixtos |
| Acceso y roles | Base actual: Google + lista de correos; confirmar adecuación |
| Modelo de datos e invariantes | Pendiente |
| Hosting y entornos | Pendiente; commit/push a `int` autorizado, promoción a `main` reservada al usuario |
| Persistencia de identidad/sesiones | Base actual: sin adaptador persistente; evaluar según requisitos |

## Decisiones de la plantilla

- Mantener el stack y las fronteras server/client establecidos en [AGENTS.md](../AGENTS.md).
- Usar Bun y un único lockfile; no conservar configuraciones de instalación divergentes.
- Organizar las funcionalidades por dominio cuando aparezcan requisitos reales; no crear módulos vacíos como demostración.
- Planificar entregas pequeñas con dependencias, aceptación y evidencias. El orden vive en [iterations.md](iterations.md), el protocolo en [workflow.md](workflow.md) y el historial en [iteration-log.md](iteration-log.md).
- Adaptar las reglas de idioma, navegación y presupuesto al proyecto de destino; no heredar decisiones del producto de origen.
- Trabajar en `int` y cerrar cada iteración validada con commit y push a `origin/int`, incluida documentación; el usuario revisa, fusiona en `main` y publica `main`. Configurar el remoto propio antes de reutilizar este flujo.

## Próximo paso

La preparación de la plantilla se registra como `00`. El siguiente trabajo de producto es `01`: concretar el MVP a partir de una petición humana. No implementar un dominio de ejemplo ni configurar servicios antes de esa definición.
