/**
 * ROI Tracker — Feldhub KI-Agenten
 * Sprint JE: Wert-Berechnung und Reporting für alle Agenten
 */

export interface AgentROISnapshot {
  date: string;                    // ISO date YYYY-MM-DD
  agentId: string;

  // Kosten
  llmCostUsd: number;

  // Output-Metriken
  tasksCompleted: number;
  linesOfCode?: number;
  contentPieces?: number;
  hoursResearched?: number;

  // Zeit-Metriken
  estimatedHoursSaved: number;
  hourlyRateFallback: number;       // Default: 80 EUR

  // Berechneter Wert
  valueCreatedEur: number;
  roiPercent: number;
}

export interface WeeklyROISummary {
  weekStart: string;
  weekEnd: string;
  totalCostUsd: number;
  totalValueEur: number;
  roiPercent: number;
  topAgent: string;
  tasksCompleted: number;
  hoursSaved: number;
  snapshots: AgentROISnapshot[];
}

/**
 * Berechnet ROI-Snapshot für einen Agenten
 */
export function calculateROI(params: {
  agentId: string;
  llmCostUsd: number;
  estimatedHoursSaved: number;
  hourlyRateEur?: number;
  tasksCompleted?: number;
  linesOfCode?: number;
  contentPieces?: number;
}): AgentROISnapshot {
  const {
    agentId,
    llmCostUsd,
    estimatedHoursSaved,
    hourlyRateEur = 80,
    tasksCompleted = 0,
    linesOfCode,
    contentPieces,
  } = params;

  const usdToEur = 0.92; // Approximate
  const llmCostEur = llmCostUsd * usdToEur;
  const valueCreatedEur = estimatedHoursSaved * hourlyRateEur;
  const roiPercent =
    llmCostEur > 0
      ? Math.round(((valueCreatedEur - llmCostEur) / llmCostEur) * 100)
      : 0;

  return {
    date: new Date().toISOString().split('T')[0],
    agentId,
    llmCostUsd,
    tasksCompleted,
    linesOfCode,
    contentPieces,
    estimatedHoursSaved,
    hourlyRateFallback: hourlyRateEur,
    valueCreatedEur: Math.round(valueCreatedEur * 100) / 100,
    roiPercent,
  };
}

/**
 * Aggregiert mehrere Snapshots zu einem wöchentlichen Summary
 */
export function aggregateWeeklyROI(
  snapshots: AgentROISnapshot[],
  weekStart: string,
  weekEnd: string
): WeeklyROISummary {
  const totalCostUsd = snapshots.reduce((s, x) => s + x.llmCostUsd, 0);
  const totalValueEur = snapshots.reduce((s, x) => s + x.valueCreatedEur, 0);
  const totalCostEur = totalCostUsd * 0.92;
  const roiPercent =
    totalCostEur > 0
      ? Math.round(((totalValueEur - totalCostEur) / totalCostEur) * 100)
      : 0;

  const topAgent = snapshots.reduce(
    (best, curr) =>
      curr.roiPercent > (best?.roiPercent ?? 0) ? curr : best,
    snapshots[0]
  )?.agentId ?? 'unknown';

  return {
    weekStart,
    weekEnd,
    totalCostUsd: Math.round(totalCostUsd * 100) / 100,
    totalValueEur: Math.round(totalValueEur * 100) / 100,
    roiPercent,
    topAgent,
    tasksCompleted: snapshots.reduce((s, x) => s + x.tasksCompleted, 0),
    hoursSaved: snapshots.reduce((s, x) => s + x.estimatedHoursSaved, 0),
    snapshots,
  };
}

/**
 * Generiert einen Markdown-Report für Kunden oder interne Nutzung
 */
export function generateROIReport(
  summary: WeeklyROISummary,
  tenantName = 'Koch Aufforstung GmbH'
): string {
  return `# KI-Agenten ROI Report — ${tenantName}
  
**Zeitraum:** ${summary.weekStart} bis ${summary.weekEnd}

## Zusammenfassung

| Kennzahl | Wert |
|----------|------|
| Erledigte Tasks | ${summary.tasksCompleted} |
| Eingesparte Arbeitsstunden | ${summary.hoursSaved}h |
| Erzeugter Wert | €${summary.totalValueEur.toLocaleString('de-DE')} |
| LLM-Kosten | $${summary.totalCostUsd} (~€${(summary.totalCostUsd * 0.92).toFixed(2)}) |
| **ROI** | **${summary.roiPercent.toLocaleString('de-DE')}%** |
| Top-Agent | ${summary.topAgent} |

## Top-Performer

${summary.snapshots
  .sort((a, b) => b.roiPercent - a.roiPercent)
  .slice(0, 3)
  .map(
    (s, i) =>
      `${i + 1}. **${s.agentId}** — ROI: ${s.roiPercent.toLocaleString('de-DE')}% | ${s.tasksCompleted} Tasks | ${s.estimatedHoursSaved}h gespart`
  )
  .join('\n')}

---
*Generiert automatisch durch Feldhub ROI Tracker*
`;
}
