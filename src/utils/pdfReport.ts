import { jsPDF } from "jspdf";
import "jspdf-autotable";

/**
 * PDF Export:
 * - uses autoTable for tabular data
 * - title header included
 */
export function exportPerformanceReportPDF(data: any[], title: string) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  doc.text(`Total Records: ${data.length}`, 14, 40);

  const tableData = data.map(emp => [
    emp.profiles?.name || 'N/A',
    emp.position || 'N/A',
    emp.departments?.name || 'N/A',
    emp.performance_rating || 0,
    emp.hire_date || 'N/A',
    emp.profiles?.email || 'N/A'
  ]);

  (doc as any).autoTable({
    head: [["Name", "Position", "Department", "Rating", "Hire Date", "Email"]],
    body: tableData,
    startY: 50,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] }, // Blue color
    alternateRowStyles: { fillColor: [248, 250, 252] }, // Light gray
  });

  doc.save(`${title.replace(/\s/g, "-").toLowerCase()}.pdf`);
}