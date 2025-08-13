// src/lib/downloads.ts
export function goToExport(
  navigate: (path: string, opts?: any) => void,
  rows: any[],
  meta?: { type?: string; role?: string; filters?: Record<string, any> }
) {
  const qs = new URLSearchParams({
    type: meta?.type ?? "",
    role: meta?.role ?? "",
    departmentId: meta?.filters?.departmentId ?? "",
    dateFrom: meta?.filters?.dateFrom ?? "",
    dateTo: meta?.filters?.dateTo ?? "",
  }).toString();

  navigate(`/export?${qs}`, { state: { rows, meta } });
}
