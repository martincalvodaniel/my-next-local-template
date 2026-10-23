# My Next Template

Base reutilizable para webapps con Next.js 16, React 19 y TypeScript. Incluye acceso con Google mediante Better Auth, control por lista de correos, rutas protegidas, una capa MongoDB con conexión compartida y un flujo de desarrollo agéntico por iteraciones.

## Qué incluye realmente

- App Router con Server Components; `src/app/**` contiene las entradas de rutas y layouts.
- Better Auth configurado sin adaptador de base de datos: cookies JWT y estado OAuth en cookies. **MongoDB no persiste usuarios, cuentas ni sesiones de autenticación.** Cambiar este modelo requiere una decisión específica del proyecto.
- Autorización en el layout protegido mediante `requireAuthorizedSession()`. El proxy comprueba la presencia de una cookie como optimización de redirección; no sustituye la autorización de cada operación.
- Driver nativo MongoDB, conexión compartida, registro central de colecciones e índices. Ambos registros están vacíos hasta que una funcionalidad los necesite.
- Tailwind CSS 4, Biome, pruebas con Bun y comprobación de TypeScript. SWR y Zod están instalados para las funcionalidades que los requieran.
- Pantallas iniciales de acceso e inicio. No incluye dominio de negocio, modo offline, sincronización, generación de PDF ni despliegue configurado.

Las versiones exactas están en `package.json` y `bun.lock`. Bun es el gestor de paquetes de este repositorio; mantener un único lockfile evita instalaciones divergentes.

## Arranque local

Requisitos: Bun, una versión de Node compatible con el Next instalado y credenciales OAuth de Google. MongoDB solo es necesario al utilizar la capa de datos o ejecutar el bootstrap de índices.

```bash
bun install --frozen-lockfile
cp .env.example .env.local
openssl rand -base64 32
```

Completa `.env.local` con valores propios de esta aplicación:

| Variable | Uso |
| --- | --- |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Credenciales de un cliente OAuth de tipo web. |
| `BETTER_AUTH_SECRET` | Secreto independiente por aplicación, generado con el comando anterior. |
| `BETTER_AUTH_URL` | Origen de la aplicación; en local, `http://localhost:3000`. |
| `ALLOWED_EMAILS` | Correos permitidos, separados por comas; una lista vacía deniega el acceso. |
| `MONGODB_URI` | URI de MongoDB para las funcionalidades de datos. |
| `MONGODB_DB` | Base independiente por aplicación y entorno; valor de ejemplo: `my-next-template`. |

Configura en Google el origen `http://localhost:3000` y la URI de retorno `http://localhost:3000/api/auth/callback/google`. Añade los orígenes y retornos correspondientes cuando despliegues y configura los usuarios de prueba si la pantalla de consentimiento lo requiere.

```bash
bun run dev
```

Abre [localhost:3000](http://localhost:3000). La ruta `/` requiere sesión y redirige a `/auth/signin`. Las variables de autenticación se leen al cargar su configuración: deben estar disponibles también durante la compilación. Los archivos `.env.local` y demás credenciales quedan fuera de Git; `.env.example` contiene únicamente ejemplos públicos.

## Convertir la plantilla en una aplicación

1. Crea el repositorio de destino y configura su remoto e historial según tus necesidades.
2. Cambia `name` en `package.json` y actualiza `bun.lock` con Bun. Adapta la marca en `src/app/layout.tsx`, `src/app/(dashboard)/page.tsx`, `src/features/auth/components/sign-in-card.tsx` y el favicon. Añade los recursos de marca propios en `public/` cuando los necesites.
3. Define el idioma del producto y alinea `lang` y todos los textos de interfaz. Actualmente `lang` es `es` y las pantallas iniciales combinan textos en inglés y español; no hay un sistema de traducciones.
4. Crea secretos y credenciales OAuth propios. Configura la lista de acceso y una base de datos independiente; no reutilices datos ni credenciales del repositorio de origen.
5. Completa [el plan del producto](plan/master.md) y la iteración `01` en [el orden de entregas](plan/iterations.md) antes de desarrollar funcionalidades.
6. Implementa el dominio bajo `src/features/<feature>/`, valida entradas con esquemas compartidos y registra colecciones e índices junto con las consultas que los necesitan.
7. Configura hosting, variables y verificaciones del entorno de destino. El flujo autoriza commit y push a `origin/int`; el merge y push de `main` corresponden al usuario. Hosting, producción y automatizaciones requieren su configuración y autorización específicas.

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

`bun run test` sustituye el marcador `server-only` únicamente en el entorno de pruebas; no verifica por sí solo las fronteras de Next. La compilación comprueba esas fronteras y descarga las fuentes Geist de Google si no están disponibles en caché. Las pruebas actuales son unitarias: no acreditan un login real con Google ni una conexión real a MongoDB.

```bash
bun run db:ensure-indexes
```

Este comando conecta a la base configurada y aplica los índices registrados. `getDatabase()` también los aplica en el primer acceso de cada proceso. Revisa siempre el entorno de destino; no hay índices de negocio predefinidos ni migraciones destructivas automáticas. El comando usa la condición `react-server` para ejecutar módulos protegidos con `server-only` fuera de Next.

Otros comandos: `bun run lint:fix`, `bun run format`, `bun run test:watch` y `bun run knip` (análisis auxiliar de código sin uso).

## Trabajar con agentes

Empieza por [AGENTS.md](AGENTS.md), [plan/master.md](plan/master.md) y [plan/workflow.md](plan/workflow.md). El flujo define alcance y aceptación antes de editar, entrega cambios pequeños, registra las pruebas y deja el siguiente paso listo para otra sesión. `CLAUDE.md` remite a las mismas reglas.

Ejemplo de petición inicial:

> Lee AGENTS.md y plan/master.md. Quiero crear [producto] para [usuarios]. Concreta el MVP, las decisiones pendientes y las primeras iteraciones. Implementa la primera entrega autorizada y valida su aceptación.

El trabajo es secuencial por defecto. El paralelismo requiere autorización y archivos asignados sin solapamientos. Los agentes trabajan siempre en `int` y cierran cada iteración validada, incluida documentación, con un Conventional Commit y push a `origin/int`, verificando el SHA remoto. Tú revisas `int` y haces el merge y push de `main` cuando lo consideres correcto. Al reutilizar la plantilla, configura primero el remoto del nuevo proyecto. El trabajo desatendido y los despliegues requieren autorización específica.
