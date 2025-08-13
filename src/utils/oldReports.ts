// @deprecated Use /export route instead
// This file contains old report generation utilities kept for reference
// All new code should use the /export route instead

export function generatePDFContent(reportData: any): string {
  throw new Error("Deprecated: Use /export route instead");
}

export function generateExcelContent(reportData: any): string {
  throw new Error("Deprecated: Use /export route instead");
}

export function downloadFile(content: string | Blob, filename: string, mimeType: string): boolean {
  throw new Error("Deprecated: Use /export route instead");
}

export function exportPerformanceReportPDF(data: any[], title: string): void {
  throw new Error("Deprecated: Use /export route instead");
}

export function generatePDF(elementId: string, fileName?: string): Promise<void> {
  throw new Error("Deprecated: Use /export route instead");
}
