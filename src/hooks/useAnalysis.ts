import { useState, useCallback } from "react";
import { LeadScoreResult } from "@/types/lead-score";

type AnalysisState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: LeadScoreResult }
  | { status: "error"; message: string };

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({ status: "idle" });

  const analyze = useCallback(async (url: string) => {
    setState({ status: "loading" });
    try {
      const params = new URLSearchParams({ url });
      const webhookUrl =
        import.meta.env.VITE_WEBHOOK_URL ??
        "https://n8n.jdanilosalazar.lat/webhook/0eeb2579-6cc3-4c27-80d1-1f5a2b23eb75";
      const response = await fetch(`${webhookUrl}?${params}`);
      if (!response.ok) throw new Error(`El análisis falló (estado ${response.status})`);

      const text = await response.text();
      if (!text.trim()) throw new Error("El webhook devolvió una respuesta vacía.");

      let raw: any;
      try { raw = JSON.parse(text); }
      catch { throw new Error("El webhook no devolvió un JSON válido."); }

      const unwrapped = Array.isArray(raw) ? raw[0] : raw;
      const s = unwrapped?.data ?? unwrapped;

      const data: LeadScoreResult = {
        domain:             s.domain ?? "",
        URL:                s.URL ?? s.url ?? url,
        merchant_name:      s.merchant_name ?? null,
        sitio_title:        s.sitio_title ?? null,
        pais_codigo:        s.pais_codigo ?? null,

        points: s.points ?? 0,
        tier:   s.tier   ?? "Congelado",
        icp_fit: s.icp_fit ?? "Desconocido",

        category:                   s.category ?? null,
        categoria_api_raw:          s.categoria_api_raw ?? null,
        categoria_requiere_revision: s.categoria_requiere_revision ?? false,

        visitas_ponderadas:         s.visitas_ponderadas         ?? 0,
        promedio_visitas_mensuales: s.promedio_visitas_mensuales ?? 0,
        visitas_totales_mensuales:  s.visitas_totales_mensuales  ?? null,
        visits_m1:                  s.visits_m1 ?? null,
        visits_m2:                  s.visits_m2 ?? null,
        visits_m3:                  s.visits_m3 ?? null,
        fecha_visits_m1:            s.fecha_visits_m1 ?? null,
        fecha_visits_m2:            s.fecha_visits_m2 ?? null,
        fecha_visits_m3:            s.fecha_visits_m3 ?? null,
        traffic_band:               s.traffic_band ?? "—",
        traffic_volatility:         s.traffic_volatility ?? null,
        traffic_trend:              s.traffic_trend ?? null,
        m1_vs_m2_pct:               s.m1_vs_m2_pct ?? null,
        m1_vs_m3_pct:               s.m1_vs_m3_pct ?? null,

        tasa_rebote:             s.tasa_rebote             ?? null,
        paginas_por_sesion:      s.paginas_por_sesion      ?? null,
        duracion_visita_segundos: s.duracion_visita_segundos ?? null,
        duracion_visita_minutos: s.duracion_visita_minutos ?? null,

        trafico_direct:         s.trafico_direct         ?? 0,
        trafico_search:         s.trafico_search         ?? 0,
        trafico_referrals:      s.trafico_referrals      ?? 0,
        trafico_paid_referrals: s.trafico_paid_referrals ?? 0,
        trafico_social:         s.trafico_social         ?? 0,
        trafico_mail:           s.trafico_mail           ?? 0,
        traffic_source:         s.traffic_source         ?? null,

        cms_name:              s.cms_name              ?? null,
        cms_confianza:         s.cms_confianza         ?? null,
        cms_source:            s.cms_source            ?? null,
        email_mktg_tool:          s.email_mktg_tool          ?? null,
        email_tool_grupo:         s.email_tool_grupo         ?? 0,
        fuente_herramienta_email: s.fuente_herramienta_email ?? null,
        email_data_confidence:    s.email_data_confidence    ?? "—",
        email_tools_all:          s.email_tools_all          ?? null,
        email_tools_installed_at: s.email_tools_installed_at ?? null,

        numero_productos:     s.numero_productos     ?? 0,
        rank_global:          s.rank_global          ?? null,
        fecha_creacion_tienda: s.fecha_creacion_tienda ?? null,
        store_age_band:       s.store_age_band       ?? null,
        last_plan_shopify:    s.last_plan_shopify    ?? null,
        last_plan_change_at:  s.last_plan_change_at  ?? null,

        fortaleza_1:  s.fortaleza_1  ?? null,
        fortaleza_2:  s.fortaleza_2  ?? null,
        fortaleza_3:  s.fortaleza_3  ?? null,
        fortaleza_4:  s.fortaleza_4  ?? null,
        fortaleza_5:  s.fortaleza_5  ?? null,
        fortaleza_6:  s.fortaleza_6  ?? null,
        fortaleza_7:  s.fortaleza_7  ?? null,
        fortaleza_8:  s.fortaleza_8  ?? null,
        fortaleza_9:  s.fortaleza_9  ?? null,
        fortaleza_10: s.fortaleza_10 ?? null,

        oportunidad_1: s.oportunidad_1 ?? null,
        oportunidad_2: s.oportunidad_2 ?? null,
        oportunidad_3: s.oportunidad_3 ?? null,

        riesgo_1: s.riesgo_1 ?? null,
        riesgo_2: s.riesgo_2 ?? null,
        riesgo_3: s.riesgo_3 ?? null,
        riesgo_4: s.riesgo_4 ?? null,
        riesgo_5: s.riesgo_5 ?? null,

        contact_email_1:   s.contact_email_1   ?? null,
        contact_email_2:   s.contact_email_2   ?? null,
        contact_email_3:   s.contact_email_3   ?? null,
        contact_phone_1:   s.contact_phone_1   ?? null,
        contact_phone_2:   s.contact_phone_2   ?? null,
        contact_linkedin:  s.contact_linkedin  ?? null,
        contact_instagram: s.contact_instagram ?? null,
        contact_whatsapp:  s.contact_whatsapp  ?? null,

        fecha_metricas_trafico: s.fecha_metricas_trafico ?? null,
        fecha_metricas_tienda:  s.fecha_metricas_tienda  ?? null,
        fecha_ultimo_mes:       s.fecha_ultimo_mes       ?? null,
        fecha_calculo:          s.fecha_calculo          ?? new Date().toISOString(),
        version_scoring:        s.version_scoring        ?? "—",
        data_source:            s.data_source            ?? null,
        revision_manual:        s.revision_manual        ?? null,
      };

      setState({ status: "success", data });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "El análisis falló. Intente de nuevo.",
      });
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);
  return { state, analyze, reset };
}
