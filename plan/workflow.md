# Flujo agéntico por iteraciones

## Preparación

1. Leer el plan maestro, la iteración candidata, el registro reciente y los `AGENTS.md` aplicables.
2. Comprobar rama y estado de Git; preservar cambios ajenos. Trabajar exclusivamente en `int`: actualizar referencias con `git fetch origin` y cambiar a la rama local existente; si solo existe `origin/int`, crear su seguimiento. Si no existe ninguna, crear `int` desde `origin/main`. No resetear ni trasladar cambios ajenos implícitamente: si impiden el cambio seguro de rama, comunicar el conflicto antes de editar. Nunca implementar en `main`.
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
5. Crear obligatoriamente un Conventional Commit en `int` después de cada iteración validada, incluidas las de planificación o documentación. Incluir el plan y el registro de la entrega; revisar los archivos preparados y excluir cambios ajenos. No introducir un hash futuro en el mismo commit ni confirmar trabajo que se sabe roto. Esta autorización es permanente para el flujo: no pedir permiso de nuevo en cada entrega.
6. Hacer push obligatorio a `origin/int`: `git push -u origin int` en la primera publicación y `git push origin int` en las siguientes. Consultar el SHA remoto de `refs/heads/int` y comprobar que coincide con el commit local antes de declarar la entrega publicada. Nunca usar force-push. Si falla el commit, push o la verificación, conservar los cambios, comunicar el paso pendiente y resolverlo antes de acumular otra iteración sin publicar.
7. Comunicar resultado, comprobaciones, limitaciones y punto de continuación.

Estados: `pending` (sin iniciar), `in_progress` (trabajo abierto), `blocked` (dependencia o comprobación requerida no disponible), `validated` (aceptación y comprobaciones requeridas aprobadas). El estado de publicación se registra por separado; una entrega local validada no implica despliegue.

## Integración humana y permisos

El usuario revisa `int` y, cuando lo considera correcto, hace el merge de `int` en `main` y el push de `main`. Los agentes no implementan, hacen commit, merge, push, reset ni rebase sobre `main`. La creación o selección de `int` y su commit/push por iteración quedan autorizados por esta política.

La autorización se limita al remoto configurado del proyecto actual. Al copiar la plantilla, configurar el remoto de destino antes de publicar. No autoriza producción, provisión, cambios de remoto ni automatizaciones. Si un proyecto configura despliegue de integración al publicar `int`, documentar su política específica; esta plantilla no tiene ese despliegue configurado.

## Presupuesto y continuación

Si el usuario solicita varias iteraciones o trabajo desatendido, acordar alcance, condición de parada y reservas antes de ejecutarlo. No copiar umbrales ni lecturas históricas de otro proyecto.

Cuando se gestione presupuesto y exista una herramienta de uso, consultar las dos ventanas disponibles directamente y calcular el restante como `100 - usedPercent`. No pedir lecturas accesibles al usuario, confundir cuota consumida con disponible ni prometer costes exactos. Reservar margen para pruebas, reparaciones y cierre. Si las lecturas necesarias no están disponibles, cerrar el corte coherente y comunicar la limitación antes de iniciar otro dependiente del presupuesto.

Este archivo no autoriza créditos, reinicios, automatizaciones ni continuaciones programadas. Cualquier permiso operativo se limita a la solicitud y al proyecto donde se concedió.

## Interrupciones

Dejar estado exacto, rutas modificadas, comandos ejecutados y pendientes, bloqueo y próximo paso. No marcar `validated` una entrega cuya aceptación está incompleta. Mantener las reglas vigentes aquí y la cronología en el registro; no convertir este protocolo en un historial de sesiones.
