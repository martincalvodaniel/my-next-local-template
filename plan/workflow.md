# Flujo agéntico por iteraciones

## Preparación

1. Leer el plan maestro, la iteración candidata, el registro reciente y los `AGENTS.md` aplicables.
2. Comprobar rama y estado de Git; preservar cambios ajenos.
3. Definir objetivo, `target_paths`, dependencias, aceptación y validación en `iterations.md`. Dividir el trabajo si no permite una entrega coherente.
4. Leer la guía relevante del Next instalado antes de escribir código. Resolver elecciones rutinarias dentro del alcance; registrar dudas materiales y avanzar en el trabajo independiente.

## Ejecución

Trabajar secuencialmente por defecto. La delegación solo se activa con autorización aplicable, contratos claros y archivos disjuntos; asignar un responsable de integración. No revertir cambios de otros agentes o del usuario.

Continuar hasta satisfacer la petición autorizada. Una nueva instrucción humana puede ajustar el alcance: actualizar aceptación y dependencias sin perder trabajo válido. Una iteración pendiente del plan no equivale por sí sola a autorización para iniciar nuevas funcionalidades o trabajo desatendido.

Los cambios de arquitectura, dependencias base o seguridad requieren una decisión humana concreta. Preparar antes la evidencia y las alternativas que puedan analizarse sin esa decisión. No pedir permiso repetidamente para una acción ya autorizada.

## Validación y cierre

1. Comprobar aceptación. Para código/configuración: `bun run lint`, `bun run type-check`, pruebas pertinentes con `bun run test` y `bun run build`. Añadir interacción y revisión visual si cambia la UI.
2. Para documentación exclusivamente: comprobar enlaces locales, consistencia y `git diff --check`. No crear pruebas que solo reproduzcan texto.
3. Diferenciar pruebas unitarias, integración, interacción, QA visual y despliegue. Registrar skips, fallos y restricciones; una prueba simulada no acredita un servicio real.
4. Revisar el diff y ausencia de secretos o cambios ajenos. Actualizar `iterations.md` y `iteration-log.md` con evidencias y siguiente paso.
5. Si hay autorización de commit para esta entrega, crear un Conventional Commit en la rama actual y verificar su resultado. No introducir un hash futuro en el mismo commit. Sin esa autorización, dejar los cambios preparados para revisión.
6. Hacer push, merge, despliegue o provisión solo dentro de una autorización vigente del proyecto. Si se publica código, verificar el resultado remoto correspondiente; no asumir éxito a partir del comando local.
7. Comunicar resultado, comprobaciones, limitaciones y punto de continuación.

Estados: `pending` (sin iniciar), `in_progress` (trabajo abierto), `blocked` (dependencia o comprobación requerida no disponible), `validated` (aceptación y comprobaciones requeridas aprobadas). El estado de publicación se registra por separado; una entrega local validada no implica despliegue.

## Presupuesto y continuación

Si el usuario solicita varias iteraciones o trabajo desatendido, acordar alcance, condición de parada y reservas antes de ejecutarlo. No copiar umbrales ni lecturas históricas de otro proyecto.

Cuando se gestione presupuesto y exista una herramienta de uso, consultar las dos ventanas disponibles directamente y calcular el restante como `100 - usedPercent`. No pedir lecturas accesibles al usuario, confundir cuota consumida con disponible ni prometer costes exactos. Reservar margen para pruebas, reparaciones y cierre. Si las lecturas necesarias no están disponibles, cerrar el corte coherente y comunicar la limitación antes de iniciar otro dependiente del presupuesto.

Este archivo no autoriza créditos, reinicios, automatizaciones ni continuaciones programadas. Cualquier permiso operativo se limita a la solicitud y al proyecto donde se concedió.

## Interrupciones

Dejar estado exacto, rutas modificadas, comandos ejecutados y pendientes, bloqueo y próximo paso. No marcar `validated` una entrega cuya aceptación está incompleta. Mantener las reglas vigentes aquí y la cronología en el registro; no convertir este protocolo en un historial de sesiones.
