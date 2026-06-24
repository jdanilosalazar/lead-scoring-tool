# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server at http://[::]:8080
npm run build      # Production build to dist/
npm run lint       # ESLint
npm run test       # Vitest (single run)
npm run test:watch # Vitest watch mode
```

## Architecture

This is a single-page React + TypeScript app (Vite, Tailwind, shadcn-ui) with **no backend**. It calls an external n8n webhook and renders the JSON response as a lead qualification report for SDR teams. The UI is entirely in Spanish.

**Data flow:**
1. User submits a URL on `src/pages/Index.tsx`
2. `src/hooks/useAnalysis.ts` fetches `https://n8n.jdanilosalazar.lat/webhook/...?url=<encoded>` and maps the response to `LeadScoreResult`
3. `src/components/VerdictView.tsx` composes the full report from specialized section components

**Key files:**
- `src/types/lead-score.ts` — the central `LeadScoreResult` interface; all field names mirror n8n webhook output exactly
- `src/hooks/useAnalysis.ts` — webhook call, response parsing, and field mapping (uses `??` fallbacks throughout)
- `src/components/VerdictView.tsx` — top-level report layout; composes all section components
- `tailwind.config.ts` — custom tier color tokens (`tier-hot`, `tier-warm`, `tier-cold`) used throughout

**Component sections rendered in VerdictView:**
`ScoreHero` → `StoreOverview` → `SignalsBreakdown` → `InfrastructureSection` → `TrafficComposition` → `ContactSection` → `TierDefinitions` → `HowItWorks`

## Scoring Model (v4.15+)

The scoring logic lives in the n8n pipeline, not in this frontend. The frontend only displays results. Key thresholds to know when building UI:

- **Gate:** `visitas_ponderadas = m1×0.5 + m2×0.3 + m3×0.2 ≥ 5,000` — stores below this are `DESCARTADO`
- **Tiers:** Caliente ≥20 pts · Tibio ≥16 · Frío ≥10 · Congelado <10
- **ICP values:** `ICP Core`, `ICP Secondary`, `ICP Weak`, `Desconocido`

## Patterns & Conventions

- **Path alias:** `@/*` maps to `src/*`
- **UI components:** All base UI is in `src/components/ui/` (shadcn-ui, do not hand-edit)
- **Styling:** Tailwind only — no separate CSS files except `src/index.css` (global reset + Tailwind layers)
- **State:** No global store; `useAnalysis` manages all async state locally with `useState`
- **TypeScript:** `noImplicitAny` is **off** and `strict` is **off** — types are intentionally loose in some places
