# Iteraciones

El estado de aceptación es independiente de commit, publicación y despliegue. Consultar [workflow.md](workflow.md).

## 00 — Preparar la plantilla reutilizable

- Estado: `validated`.
- Objetivo: neutralizar referencias heredadas, documentar la base real y preparar un flujo agéntico reutilizable.
- `target_paths`: `README.md`, `AGENTS.md`, `plan/**`, `src/lib/auth/AGENTS.md`, `src/lib/auth/callback-url.test.ts`, `src/lib/db/ensure-indexes.test.ts`, `package.json`, `bun.lock`, `package-lock.json` (retirada), `public/*.svg` (retirada de ejemplos sin uso).
- Dependencias: inventario del repositorio y revisión de las convenciones de referencia.
- Aceptación: ejemplos sin dominio heredado; un solo lockfile; comando de índices compatible con `server-only`; documentación que distinga capacidades presentes y extensiones futuras; reglas de entrega sin permisos heredados.
- Validación: búsqueda de referencias, enlaces locales, `git diff --check`, lint, tipos, suite unitaria y build. Resultados en [iteration-log.md](iteration-log.md).

## 01 — Definir el producto de destino

- Estado: `pending`; requiere una petición de producto.
- Objetivo: concretar usuarios, problema, MVP, idioma, acceso, datos y criterios de éxito.
- `target_paths`: `plan/master.md`, `plan/iterations.md`, `plan/iteration-log.md`; añadir otras rutas solo si la petición incluye personalización técnica.
- Dependencias: cierre de `00` y requisitos humanos del nuevo producto.
- Aceptación: alcance y exclusiones explícitos, decisiones pendientes identificadas y primeras entregas ordenadas por dependencia con aceptación verificable.
- Validación: consistencia, enlaces locales y `git diff --check`; aplicar validación de código si la petición amplía el alcance.

Las siguientes iteraciones se definen a partir del producto real. No hay una hoja de ruta de funcionalidades implícita en la plantilla.

## 00a — Establecer integración agéntica en int

- Estado: `validated`.
- Objetivo: aplicar la instrucción humana de trabajar siempre en `int` y cerrar cada iteración con commit/push, reservando la promoción a `main` al usuario.
- `target_paths`: `AGENTS.md`, `README.md`, `plan/{AGENTS,master,workflow,iterations,iteration-log}.md`.
- Dependencias: `00` y autorización humana explícita de este flujo.
- Aceptación: regla consistente en todos los documentos vigentes; documentación incluida en el cierre obligatorio; verificación del SHA remoto; recuperación explícita ante fallo; `main` exclusivamente humano.
- Validación: enlaces locales, consistencia de reglas y `git diff --check`. Sin cambios de código que requieran repetir la suite.
- Publicación: commit y push de esta entrega en `int`; resultado y SHA comunicados al cierre.
