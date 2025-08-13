/**
 * Returns whether report exports are disabled via feature flag
 */
export function isReportExportDisabled(): boolean {
  return import.meta.env.VITE_DISABLE_REPORT_EXPORTS === 'true';
}
