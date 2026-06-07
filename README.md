# Sistema de Gestión Hotelera (Hoteles Decameron)

Frontend del sistema de administración de hoteles, hecho con Next.js, TypeScript, Redux Toolkit y Tailwind CSS. Desde acá se administran los hoteles registrados y la configuración de sus habitaciones (tipos, acomodaciones y cantidades).

Este proyecto consume una API hecha en Laravel, así que para que todo funcione necesitas tener el backend corriendo en paralelo.

## Antes de empezar

Necesitas tener instalado:

- Node.js 20 o superior
- npm (viene con Node)
- El backend de este proyecto corriendo y accesible (normalmente en `http://127.0.0.1:8000`)

## Cómo ponerlo a correr

1. Clona el repositorio y entra a la carpeta del proyecto.

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env.local` en la raíz del proyecto (puedes basarte en `.env.example`) y define la URL base de la API del backend:

```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Ajusta el host y el puerto según donde tengas corriendo tu backend.

4. Levanta el servidor de desarrollo:

```bash
npm run dev
```

5. Abre `http://localhost:3000` en el navegador. Si todo está bien configurado y el backend está corriendo, deberías ver el listado de hoteles.

## Otros comandos útiles

- `npm run build` — genera la build de producción.
- `npm run start` — sirve la build de producción (debes correr antes `npm run build`).
- `npm run lint` — corre el linter de Next.js / ESLint.
- `npm run test` — corre toda la suite de pruebas con Vitest una sola vez.
- `npm run test:watch` — corre las pruebas en modo observador, útil mientras se desarrolla.
- `npx tsc --noEmit` — valida que no haya errores de tipos en TypeScript sin generar archivos de salida.

## Sobre el proyecto

La aplicación está construida sobre el App Router de Next.js y usa Redux Toolkit con RTK Query para el manejo de estado y las llamadas a la API (consultas y mutaciones de hoteles y habitaciones). Los estilos se manejan con Tailwind CSS sobre una paleta de colores propia definida en `src/app/globals.css`.

La estructura del código está separada por features: en `src/features` encuentras todo lo relacionado a hoteles y habitaciones (componentes, formularios, validaciones), en `src/components` están las piezas de interfaz reutilizables (botones, modales, layout de la aplicación, etc.) y en `src/lib/api` está la configuración de RTK Query y los endpoints consumidos del backend.

Las pruebas están escritas con Vitest y Testing Library, y viven junto a cada componente (archivos `*.test.tsx`).

## Algo no funciona

Si al abrir la aplicación ves errores de conexión o las páginas se quedan cargando, lo primero que debes revisar es que el backend esté corriendo y que la URL en `NEXT_PUBLIC_API_BASE_URL` apunte correctamente a él. Cualquier cambio que hagas en `.env.local` requiere reiniciar el servidor de desarrollo para que tome efecto.
