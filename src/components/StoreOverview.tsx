interface StoreOverviewProps {
  visitas_ponderadas: number;
  promedio_visitas_mensuales: number;
  visitas_totales_mensuales: number | null;
  visits_m1: number | null;
  visits_m2: number | null;
  visits_m3: number | null;
  fecha_visits_m1: string | null;
  fecha_visits_m2: string | null;
  fecha_visits_m3: string | null;
  traffic_band: string;
  traffic_volatility: string | null;
  traffic_trend: string | null;
  m1_vs_m2_pct: number | null;
  m1_vs_m3_pct: number | null;
  numero_productos: number;
  category: string | null;
  categoria_api_raw: string | null;
  rank_global: number | null;
  tasa_rebote: number | null;
  paginas_por_sesion: number | null;
  duracion_visita_minutos: number | null;
  last_plan_shopify: string | null;
  fecha_creacion_tienda: string | null;
  store_age_band: string | null;
}

function MetricCard({ label, value, mono = false, highlight, sub }: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: "positive" | "negative" | "neutral";
  sub?: string;
}) {
  const highlightClass =
    highlight === "positive" ? "text-emerald-400" :
    highlight === "negative" ? "text-red-400" : "";

  return (
    <div className="bg-card border border-border rounded-lg p-5 space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`text-xl font-semibold ${mono ? "font-mono" : ""} ${highlightClass}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground font-mono">{sub}</p>}
    </div>
  );
}

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

function fmtPct(n: number | null): string {
  if (n === null) return "—";
  return `${n > 0 ? "+" : ""}${n}%`;
}

function pctHighlight(n: number | null): "positive" | "negative" | "neutral" {
  if (n === null) return "neutral";
  return n >= 10 ? "positive" : n < 0 ? "negative" : "neutral";
}

function fmtDate(s: string | null): string {
  if (!s) return "";
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : d.toLocaleDateString("es-ES", { month: "short", year: "numeric", timeZone: "UTC" });
}

const BAND_ORDER = ["<5k", "5k-10k", "10k-20k", "20k-40k", "40k-60k", "60k-100k", "100k-200k", ">200k"];

function bandHighlight(band: string): "positive" | "negative" | "neutral" {
  const idx = BAND_ORDER.indexOf(band);
  if (idx <= 1) return "negative";   // <5k, 5k-10k
  if (idx <= 2) return "neutral";    // 10k-20k
  return "positive";                  // 20k+
}

const VOLATILITY_LABEL: Record<string, string> = {
  stable:   "Estable",
  moderate: "Moderada",
  volatile: "Volátil",
  unknown:  "—",
};

const TREND_LABEL: Record<string, string> = {
  growing:      "Creciendo",
  declining:    "Bajando",
  peak_recent:  "Pico reciente",
  peak_mid:     "Pico intermedio",
  peak_old:     "Pico anterior",
  mixed:        "Mixto",
};

const AGE_BAND_LABEL: Record<string, string> = {
  nueva:    "Nueva (< 18m)",
  joven:    "Joven (18–36m)",
  madura:   "Madura (36–72m)",
  veterana: "Veterana (> 72m)",
};

export function StoreOverview({
  visitas_ponderadas,
  promedio_visitas_mensuales,
  visitas_totales_mensuales,
  visits_m1,
  visits_m2,
  visits_m3,
  fecha_visits_m1,
  fecha_visits_m2,
  fecha_visits_m3,
  traffic_band,
  traffic_volatility,
  traffic_trend,
  m1_vs_m2_pct,
  m1_vs_m3_pct,
  numero_productos,
  category,
  categoria_api_raw,
  rank_global,
  tasa_rebote,
  paginas_por_sesion,
  duracion_visita_minutos,
  last_plan_shopify,
  fecha_creacion_tienda,
  store_age_band,
}: StoreOverviewProps) {
  const volatilityHighlight = traffic_volatility === "stable" ? "positive"
    : traffic_volatility === "volatile" ? "negative"
    : "neutral";

  return (
    <section className="space-y-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <h2 className="text-lg font-semibold">Resumen de la Tienda</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <MetricCard label="Visitas Ponderadas" value={fmt(visitas_ponderadas)} mono />
        <MetricCard label="Banda de Tráfico" value={traffic_band} mono highlight={bandHighlight(traffic_band)} />
        <MetricCard
          label="Volatilidad Tráfico"
          value={traffic_volatility ? (VOLATILITY_LABEL[traffic_volatility] ?? traffic_volatility) : "—"}
          mono
          highlight={volatilityHighlight}
        />

        {/* Monthly visits with dates */}
        <MetricCard
          label="Visitas M1"
          value={visits_m1 !== null ? fmt(visits_m1) : "—"}
          mono
          sub={fmtDate(fecha_visits_m1) || undefined}
        />
        <MetricCard
          label="Visitas M2"
          value={visits_m2 !== null ? fmt(visits_m2) : "—"}
          mono
          sub={fmtDate(fecha_visits_m2) || undefined}
        />
        <MetricCard
          label="Visitas M3"
          value={visits_m3 !== null ? fmt(visits_m3) : "—"}
          mono
          sub={fmtDate(fecha_visits_m3) || undefined}
        />

        {/* Trend signals */}
        <MetricCard
          label="Tendencia (M1 vs M2)"
          value={fmtPct(m1_vs_m2_pct)}
          mono
          highlight={pctHighlight(m1_vs_m2_pct)}
        />
        <MetricCard
          label="Tendencia (M1 vs M3)"
          value={fmtPct(m1_vs_m3_pct)}
          mono
          highlight={pctHighlight(m1_vs_m3_pct)}
        />
        {traffic_trend && (
          <MetricCard
            label="Patrón de Tráfico"
            value={TREND_LABEL[traffic_trend] ?? traffic_trend}
          />
        )}

        <MetricCard label="Visitas Prom. Mensuales" value={fmt(promedio_visitas_mensuales)} mono />
        <MetricCard label="Visitas Totales (3m)" value={visitas_totales_mensuales !== null ? fmt(visitas_totales_mensuales) : "—"} mono />
        <MetricCard label="Productos" value={fmt(numero_productos)} mono />
        <MetricCard label="Categoría" value={category ?? "—"} />
        {categoria_api_raw && <MetricCard label="Categoría Raw" value={categoria_api_raw} />}
        {rank_global ? <MetricCard label="Ranking Global" value={`#${fmt(rank_global)}`} mono /> : null}
        {fecha_creacion_tienda && (
          <MetricCard
            label="Fecha Creación Tienda"
            value={fecha_creacion_tienda.slice(0, 10)}
            mono
            sub={store_age_band ? (AGE_BAND_LABEL[store_age_band] ?? store_age_band) : undefined}
          />
        )}
        {last_plan_shopify && <MetricCard label="Plan Shopify" value={last_plan_shopify} mono />}
      </div>

      {/* Engagement row */}
      {(tasa_rebote !== null || paginas_por_sesion !== null || duracion_visita_minutos !== null) && (
        <>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider pt-2">Engagement</h3>
          <div className="grid grid-cols-3 gap-3">
            {tasa_rebote !== null && (
              <MetricCard label="Tasa de Rebote" value={`${tasa_rebote}%`} mono
                highlight={tasa_rebote < 30 ? "positive" : tasa_rebote > 60 ? "negative" : "neutral"} />
            )}
            {paginas_por_sesion !== null && (
              <MetricCard label="Páginas / Sesión" value={paginas_por_sesion.toFixed(2)} mono />
            )}
            {duracion_visita_minutos !== null && (
              <MetricCard label="Duración Visita (min)" value={duracion_visita_minutos.toFixed(2)} mono />
            )}
          </div>
        </>
      )}
    </section>
  );
}
