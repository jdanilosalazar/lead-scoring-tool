# Probance Lead Scoring Tool — Frontend

**Live tool:** https://leadscoringtool.lovable.app/

![Lead Scoring Tool screenshot](screenshot.png)

React + TypeScript frontend for the Probance Lead Scoring Tool. Takes a store URL, calls an n8n webhook that runs the normalization and scoring pipeline, and displays the full scored lead report for the SDR team.

Built with Vite, React, TypeScript, shadcn-ui, and Tailwind CSS.

---

## What it displays

Given a scored lead from the n8n pipeline (scoring v4.15), the frontend shows:

- **Score hero** — points, tier badge (Caliente / Tibio / Frío / Congelado / Descartado), ICP fit, country, revision manual warning
- **Resumen de la tienda** — weighted visits (`visitas_ponderadas`), monthly visits M1/M2/M3 with their dates, traffic band, volatility, trend pattern, M1 vs M2 and M1 vs M3 % changes, store creation date with age band, products, category, engagement metrics
- **Señales** — up to 10 strengths, 3 opportunities, 5 risks (plain-text, SDR-ready)
- **Infraestructura y Stack** — CMS, email marketing tool and group, all detected tools, data source, scoring version
- **Fechas** — email tool install dates, traffic metrics date, store metrics date
- **Composición de tráfico** — channel breakdown (direct, search, social, email, referrals, paid) with M1 vs M3 quarter trend
- **Contacto** — emails, phones, LinkedIn, Instagram, WhatsApp
- **Definiciones de nivel** — tier thresholds reference
- **¿Cómo funciona este score?** — collapsible explanation of all scoring signals, tiers, ICP classification, and the traffic gate

---

## Scoring model (v4.15)

**Gate:** `visitas_ponderadas = m1×0.5 + m2×0.3 + m3×0.2 ≥ 5,000`

| Tier | Threshold |
|---|---|
| Caliente | ≥ 20 pts |
| Tibio | ≥ 16 pts |
| Frío | ≥ 10 pts |
| Congelado | < 10 pts |
| DESCARTADO | No traffic / weighted visits < 5k |

| Signal | Max pts |
|---|---|
| Traffic volume (7 tiers) | +7 |
| Email marketing stack (groups 1–5) | +4 |
| Catalog size (7 tiers) | +5 / -1 |
| Store age | +3 |
| Traffic growth — M1 vs M3 (quarter) | +3 / -3 |
| Social traffic % | +3 |
| Bounce rate | +2 |
| Pages per session | +2 |
| Platform migration < 12 months | +2 |
| CMS (Shopify / WooCommerce / PrestaShop) | +1 |
| Search traffic % | +1 |
| Direct traffic % | +1 |
| Visit duration > 1 min | +1 |
| Paid traffic % (high) | -2 |

---

## Architecture

```
src/
  types/lead-score.ts       — LeadScoreResult interface (mirrors n8n scoring output)
  hooks/useAnalysis.ts      — fetch + field mapping from webhook response
  components/
    VerdictView.tsx          — main layout, composes all sections
    ScoreHero.tsx            — score, tier, ICP badge, progress bar
    StoreOverview.tsx        — traffic metrics, monthly visits with dates, engagement
    SignalsBreakdown.tsx     — fortalezas, oportunidades, riesgos
    InfrastructureSection.tsx — CMS, email stack, dates box
    TrafficComposition.tsx   — channel bar chart, M1 vs M3 trend
    ContactSection.tsx       — contact details
    TierDefinitions.tsx      — tier reference table
    HowItWorks.tsx           — collapsible scoring explainer
```

The webhook (`useAnalysis.ts`) hits the n8n production endpoint and expects the scoring node output directly. Field names match the scoring script v4.15 output exactly.

---

## Local development

```sh
git clone https://github.com/jdanilosalazar/leadscoringtool.git
cd leadscoringtool
npm install
npm run dev
```

Requires Node.js ≥ 18.
