
// jsPDF + autoTable + optional chart images with data validation
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export interface ReportSection {
  type: 'text' | 'table' | 'chart';
  textContent?: string[];
  tableData?: { 
    headers: string[]; 
    rows: string[][];
  };
  chartData?: {
    data: { label: string; value: number }[];
    imageDataUrl?: string;
    imageWidth?: number;
    imageHeight?: number;
  };
}

export interface ReportData { 
  title: string; 
  sections: ReportSection[];
}

export function generatePDFReport(data: ReportData) {
  console.log('🔍 PDF Report data:', data);
  
  const doc = new jsPDF();
  let y = 20;
  
  // Title
  doc.setFontSize(22);
  doc.text(data.title, 20, y);
  y += 15;
  
  // Process sections
  for (const section of data.sections) {
    if (section.type === 'text' && section.textContent) {
      doc.setFontSize(12);
      section.textContent.forEach(line => {
        doc.text(line, 20, y);
        y += 8;
      });
      y += 10;
    } 
    else if (section.type === 'table' && section.tableData) {
      (doc as any).autoTable({
        head: [section.tableData.headers],
        body: section.tableData.rows,
        startY: y,
        margin: { left: 20, right: 20 },
        styles: { fontSize: 10 },
      });
      y = (doc as any).lastAutoTable.finalY + 15;
    } 
    else if (section.type === 'chart' && section.chartData) {
      const chartData = section.chartData;
      if (chartData.imageDataUrl) {
        doc.addImage(
          chartData.imageDataUrl, 
          'PNG', 
          20, 
          y, 
          chartData.imageWidth ?? 150, 
          chartData.imageHeight ?? 80
        );
        y += (chartData.imageHeight ?? 80) + 15;
      } else {
        // Fallback to text representation
        doc.setFontSize(12);
        doc.text('Chart Data:', 20, y);
        y += 8;
        chartData.data.forEach(({ label, value }) => {
          doc.text(`• ${label}: ${value}`, 25, y);
          y += 8;
        });
        y += 10;
      }
    }
    
    // Add new page if needed
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  }
  
  doc.save(`${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  console.log('✅ PDF generated successfully');
}

// Utility function to generate chart image from canvas
export function getChartImageFromCanvas(canvasId: string): string | null {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (canvas) {
    return canvas.toDataURL('image/png');
  }
  return null;
}

// Helper function to format data for PDF tables
export function formatTableData(data: any[], columns: string[]): { headers: string[]; rows: string[][] } {
  return {
    headers: columns,
    rows: data.map(item => 
      columns.map(column => 
        item[column]?.toString() || ''
      )
    )
  };
}
