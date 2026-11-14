# AGENTS.md

Reglas para agentes que trabajan en este frontend (React + Vite).

## Stack

- React 19 (componentes funcionales + hooks)
- Vite + TypeScript (ESM)
- Lint: `oxlint` (`pnpm lint`)
- Estilos: CSS por archivo / módulo existente; no introducir CSS-in-JS sin pedirlo

No agregar librerías nuevas si el stack actual alcanza. Preferir APIs nativas y el código existente.

## Arquitectura feature-based

Organizar el código por **feature** (capacidad de negocio), no por tipo de archivo global.

```
src/
  features/
    <feature>/
      <Feature>Page.tsx      # pantalla / entrada de la feature
      <Component>.tsx        # UI propia de la feature
      use<Something>.ts      # hooks de la feature
      <feature>.api.ts       # llamadas HTTP específicas (si aplica)
      types.ts               # tipos solo de la feature (si aplica)
  components/                # UI reutilizable entre features
  lib/ o utilidades raíz     # helpers compartidos (format, cart, etc.)
  api.ts                     # cliente HTTP / tipos compartidos con la API
  App.tsx
  main.tsx
```

### Reglas

- Código de un dominio vive en `src/features/<feature>/`.
- `src/components/` solo para piezas genéricas sin lógica de negocio de una feature.
- No crear carpetas globales `hooks/`, `services/`, `types/` para lógica de una feature: colocalizarlas dentro de esa feature.
- `App.tsx` orquesta layout/estado global y monta features; no acumular UI de negocio ahí.
- Preferir imports directos al archivo (con extensión `.ts` / `.tsx`); evitar barrels (`index.ts`) salvo que ya existan y aporten valor claro.
- Una feature no debe importar internals privados de otra; compartir vía `components/`, `api.ts` o utilidades comunes.

### Ejemplo

```
# ✅ GOOD
src/features/catalog/CatalogPage.tsx
src/features/catalog/ProductCard.tsx
src/features/cart/CartSheet.tsx
src/features/cart/useCart.ts

# ❌ BAD
src/components/ProductCard.tsx        # es del catálogo, no genérico
src/hooks/useCart.ts                  # va en features/cart/
```

## Convenciones React + Vite

- TypeScript estricto; tipar props y respuestas de API.
- Hooks personalizados con prefijo `use`.
- Abortar fetches con `AbortController` en efectos que lo necesiten.
- Variables de entorno solo con prefijo `VITE_`; documentar en `.env.example`.
- No commitear secretos ni `.env` / `.env.local`.
- Mantener componentes enfocados; extraer subcomponentes o hooks dentro de la misma feature.
- Textos de UI en español, coherentes con el resto de la app.

## Al cambiar código

- Seguir el estilo y nombres del código vecino.
- No refactorizar fuera del alcance del pedido.
- Tras cambios sustanciales, verificar con `pnpm lint` y `pnpm build` si el cambio lo amerita.
