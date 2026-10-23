# My Next Template

Base reutilizable para webapps con Next.js 16, React 19 y TypeScript. Incluye acceso con Google mediante Better Auth, administradores definidos por entorno y usuarios autorizados en MongoDB, rutas protegidas, una capa MongoDB con conexión compartida y un flujo de desarrollo agéntico por iteraciones.

## Qué incluye realmente

- App Router con Server Components; `src/app/**` contiene las entradas de rutas y layouts.
- Better Auth configurado sin adaptador de base de datos: cookies JWT y estado OAuth en cookies. **MongoDB no persiste identidades, cuentas ni sesiones de Better Auth; sí persiste los permisos de acceso normales.** Cambiar este modelo requiere una decisión específica del proyecto.
- Autorización en el layout protegido mediante `requireAuthorizedSession()`. El proxy comprueba la presencia de una cookie como optimización de redirección; no sustituye la autorización de cada operación.
- Driver nativo MongoDB, conexión compartida, registro central de colecciones e índices. La colección `user_access` registra los usuarios normales autorizados y tiene un índice único por correo normalizado.
- Tailwind CSS 4, Biome, pruebas con Bun y comprobación de TypeScript. SWR y Zod están instalados para las funcionalidades que los requieran.
- Pantallas iniciales de acceso e inicio. No incluye dominio de negocio, modo offline, sincronización, generación de PDF ni despliegue configurado.

Las versiones exactas están en `package.json` y `bun.lock`. Bun es el gestor de paquetes de este repositorio; mantener un único lockfile evita instalaciones divergentes.

## Arranque local

Requisitos: Bun, una versión de Node compatible con el Next instalado y credenciales OAuth de Google. MongoDB es necesario para gestionar usuarios normales y comprobar su acceso.

```bash
bun install --frozen-lockfile
cp .env.example .env.local
openssl rand -base64 32
```

Completa `.env.local` con valores propios de esta aplicación:

| Variable                                    | Uso                                                                                                                                     |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Credenciales de un cliente OAuth de tipo web.                                                                                           |
| `BETTER_AUTH_SECRET`                        | Secreto independiente por aplicación, generado con el comando anterior.                                                                 |
| `BETTER_AUTH_URL`                           | Origen de la aplicación; en local, `http://localhost:3000`.                                                                             |
| `ALLOWED_EMAILS`                            | Correos de administradores, separados por comas. Los usuarios normales se gestionan en `/admin`; no reciben permisos de administración. |
| `MONGODB_URI`                               | URI de MongoDB para permisos de usuarios y demás datos de la aplicación.                                                                |
| `MONGODB_DB`                                | Base independiente por aplicación y entorno; valor de ejemplo: `my-next-template`.                                                      |

Configura en Google el origen `http://localhost:3000` y la URI de retorno `http://localhost:3000/api/auth/callback/google`. Añade los orígenes y retornos correspondientes cuando despliegues y configura los usuarios de prueba si la pantalla de consentimiento lo requiere.

```bash
bun run dev
```

Abre [localhost:3000](http://localhost:3000). La ruta `/` requiere sesión y redirige a `/auth/signin`. Las variables de autenticación se leen al cargar su configuración: deben estar disponibles también durante la compilación. Los archivos `.env.local` y demás credenciales quedan fuera de Git; `.env.example` contiene únicamente ejemplos públicos.

## Convertir la plantilla en una aplicación

1. Crea el repositorio de destino y configura su remoto e historial según tus necesidades.
2. Cambia `name` en `package.json` y actualiza `bun.lock` con Bun. Adapta la marca en `src/app/layout.tsx`, `src/features/home/components/home-screen.tsx`, `src/features/auth/components/sign-in-card.tsx` y el favicon. Añade los recursos de marca propios en `public/` cuando los necesites.
3. Define el idioma del producto y alinea `lang` y todos los textos de interfaz. Actualmente `lang` es `es` y las pantallas iniciales combinan textos en inglés y español; no hay un sistema de traducciones.
4. Crea secretos y credenciales OAuth propios. Configura al menos un administrador en `ALLOWED_EMAILS` y una base de datos independiente; no reutilices datos ni credenciales del repositorio de origen.
5. Completa [el plan del producto](plan/master.md) y la iteración `01` en [el orden de entregas](plan/iterations.md) antes de desarrollar funcionalidades.
6. Implementa el dominio bajo `src/features/<feature>/`, valida entradas con esquemas compartidos y registra colecciones e índices junto con las consultas que los necesitan.
7. Configura hosting, variables y verificaciones del entorno de destino. El flujo autoriza commit y push a `origin/int`; el merge y push de `main` corresponden al usuario. Hosting, producción y automatizaciones requieren su configuración y autorización específicas.

## Administración y acceso

`ALLOWED_EMAILS` determina exclusivamente los administradores. Estos pueden entrar en `/admin` desde el enlace del inicio y conceder o revocar acceso a otros correos de Google. Los usuarios normales se guardan en `user_access`, no pueden administrar el sitio y no pueden promoverse mediante campos enviados por el navegador.

Los correos se recortan y convierten a minúsculas; las altas repetidas son idempotentes. La lista se pagina de 50 en 50. Los administradores no se modifican desde esta lista: se gestionan cambiando `ALLOWED_EMAILS` en el entorno y reiniciando/desplegando la aplicación según el hosting.

La sesión debe pertenecer a un correo verificado por el proveedor. Cada petición protegida consulta el permiso actual del usuario normal; la revocación afecta al siguiente acceso al servidor aunque conserve cookies válidas. No borra la identidad de Google, cierra las cookies en otros dispositivos ni interrumpe una petición ya en curso. El contenido ya mostrado en una pestaña puede seguir visible hasta navegar o recargar.

Una lista vacía de administradores impide administrar, aunque los usuarios previamente autorizados en MongoDB conservan su acceso normal. Los administradores se resuelven antes de consultar MongoDB; la pantalla de gestión y los usuarios normales sí dependen de la base de datos. Una incidencia de MongoDB no concede acceso por defecto.

## Organización

```text
plan/                  Objetivo, decisiones, iteraciones y evidencias
src/app/               Páginas, layouts y route handlers
src/features/          Componentes, hooks y acciones por dominio
src/components/        Componentes genéricos reutilizables
src/config/            Acceso a variables de entorno
src/lib/auth/          Configuración, cliente y autorización
src/lib/db/            Conexión, colecciones e índices de MongoDB
scripts/               Operaciones explícitas de mantenimiento
test/                  Preparación del entorno de pruebas
```

Crea `src/schemas/` y `src/types/` cuando sean necesarios; deben ser importables desde cliente y servidor. El soporte PDF es una extensión futura, no una dependencia instalada.

## Validación y mantenimiento

```bash
bun run lint
bun run type-check
bun run test
bun run build
```

`bun run test` sustituye el marcador `server-only` únicamente en el entorno de pruebas; no verifica por sí solo las fronteras de Next. La compilación comprueba esas fronteras y descarga las fuentes Geist de Google si no están disponibles en caché. La suite habitual es unitaria. Las comprobaciones opt-in de Mongo y del Next compilado se describen a continuación; no acreditan un login real con Google.

```bash
bun run db:ensure-indexes
```

Este comando conecta a la base configurada y aplica los índices registrados. `getDatabase()` también los aplica en el primer acceso de cada proceso. Revisa siempre el entorno de destino; se registra `email_unique` sobre `user_access.email`, sin migraciones destructivas automáticas. El comando usa la condición `react-server` para ejecutar módulos protegidos con `server-only` fuera de Next.

Otros comandos: `bun run lint:fix`, `bun run format`, `bun run test:watch` y `bun run knip` (análisis auxiliar de código sin uso).

## Pruebas de acceso con recursos aislados

- `src/lib/db/user-access.integration.ts`: ejecutar explícitamente con `bun --no-env-file --conditions=react-server src/lib/db/user-access.integration.ts`, proporcionando `MONGODB_URI` de un MongoDB desechable en `127.0.0.1:<puerto>` y `MONGODB_DB=template_access_test_<identificador>`. Comprueba concurrencia, reconexión, revocación, paginación e índice. Usa una base nueva por ejecución y elimina únicamente los recursos de prueba al terminar.
- `test/access-http.ts`: ejecutar con `bun --no-env-file --conditions=react-server test/access-http.ts` contra un `next start` compilado y aislado. Ambos procesos deben compartir las variables de prueba: base/origen loopback, secreto aleatorio exclusivo, credenciales Google ficticias y `ALLOWED_EMAILS=admin@example.com`. Crea cookies firmadas de prueba y verifica las rutas y Server Actions reales sin llamar a Google. Nunca ejecutarlo contra una aplicación o base de usuario.

Las dos entradas rechazan destinos que no cumplan sus guardias de aislamiento y no forman parte de `bun run test`. Se necesita aportar las variables al proceso explícitamente: `--no-env-file` evita cargar credenciales locales. Estas pruebas no hacen limpieza destructiva automática; elimina el contenedor o base desechable que hayas creado.

## Trabajar con agentes

Empieza por [AGENTS.md](AGENTS.md), [plan/master.md](plan/master.md) y [plan/workflow.md](plan/workflow.md). El flujo define alcance y aceptación antes de editar, entrega cambios pequeños, registra las pruebas y deja el siguiente paso listo para otra sesión. `CLAUDE.md` remite a las mismas reglas.

Ejemplo de petición inicial:

> Lee AGENTS.md y plan/master.md. Quiero crear [producto] para [usuarios]. Concreta el MVP, las decisiones pendientes y las primeras iteraciones. Implementa la primera entrega autorizada y valida su aceptación.

El trabajo es secuencial por defecto. El paralelismo requiere autorización y archivos asignados sin solapamientos. Los agentes trabajan siempre en `int` y cierran cada iteración validada, incluida documentación, con un Conventional Commit y push a `origin/int`, verificando el SHA remoto. Tú revisas `int` y haces el merge y push de `main` cuando lo consideres correcto. Al reutilizar la plantilla, configura primero el remoto del nuevo proyecto. El trabajo desatendido y los despliegues requieren autorización específica.
