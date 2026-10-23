# Registro de iteraciones

## 00 — Preparación de la base reutilizable · 2026-10-23

- Estado: `validated`; entrega local.
- Cambios: README ajustado al funcionamiento real; reglas raíz y anidadas para planificación y autenticación; plan reutilizable; ejemplos de pruebas neutrales; paquete identificado como `my-next-template`; Bun como única fuente de instalación; condición `react-server` en bootstrap de índices.
- Limpieza adicional: retirado `package-lock.json`, que describía dependencias antiguas distintas de las actuales. Retirados los cinco SVG sin uso de `create-next-app`, que provocaban errores de accesibilidad en Biome. La búsqueda de referencias confirmó que no los utiliza el código.
- Decisiones: conservar el modelo de autenticación existente, sin adaptador MongoDB. No incorporar funcionalidades de negocio, reglas de navegación del producto anterior, permisos de publicación, reservas de cuota ni automatizaciones de otros proyectos. Los commits requieren autorización de la entrega actual.
- `bun install --frozen-lockfile`: aprobado, sin cambios de dependencias.
- `bun run lint`: aprobado, 28 archivos. La primera pasada detectó los cinco SVG de ejemplo; se corrigió retirando esos recursos sin uso y se repitió el lint.
- `bun run type-check`: aprobado.
- `bun run test`: 9 pruebas aprobadas, 0 fallos, 11 aserciones.
- `bun run build`: aprobado con Next.js 16.4.2/Turbopack; rutas `/`, `/auth/signin` y `/api/auth/[...all]`, más la página de no encontrado y el proxy.
- Módulo de índices ejecutado con `bun --conditions=react-server` y registro vacío: aprobado sin conexión de datos; acredita la resolución de `server-only`, no una provisión MongoDB real.
- Referencias: búsqueda de nombres del dominio anterior en archivos del proyecto, sin coincidencias; enlaces Markdown locales comprobados; `git diff --check` aprobado. La revisión excluye historial Git, dependencias, artefactos generados y archivos privados de entorno.
- Límites: no se ha realizado un login interactivo con Google, una conexión real a MongoDB ni una revisión visual de las pantallas, que no han cambiado. La interfaz inicial sigue teniendo textos mixtos; su idioma se define al personalizar el producto.
- Publicación: commit local solicitado por el usuario tras la validación; sin push ni despliegue solicitados. No se han modificado credenciales ni el repositorio de referencia.
- Siguiente paso: definir el producto de destino en `01` a partir de sus requisitos humanos.
