# UniConnect frontend

React/TypeScript application for the public catalogue, student, instructor and administrator pages.

Start from the [root README](../README.md) and use the root setup/development commands. Normal
local startup uses Vite on port 5173 with the API proxy; the hosted build uses the same origin.

| Directory | Contents |
| --- | --- |
| `src/pages/` | Role-specific and public screens. |
| `src/components/` | Shared controls, forms, layouts and course features. |
| `src/hooks/` | API queries, mutations and form workflows. |
| `src/providers/` | Auth, theme and modal state. |
| `src/validations/` | Form schemas. |
| `public/` | Static assets. |
| `screenshots/` | Inherited upstream screenshots; historical illustrations, not current verification. |

Routes start in [src/main.tsx](src/main.tsx).
Read [architecture](../docs/technical/ARCHITECTURE.md) and [website behavior](../docs/product/WEBSITE-GUIDE.md).
Original authors and source are recorded in [credits](../docs/CREDITS.md).
