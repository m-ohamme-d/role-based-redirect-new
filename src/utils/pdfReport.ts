import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";

/**
 * HTML-capture PDF with pagination and scale improvements
 */
export async function generatePDF(
  elementId: string,
  fileName = "report.pdf"
) {
  const container = document.getElementById(elementId);
  if (!container) throw new Error(`Element #${elementId} not found.`);
  container.style.display = "block";
  await new Promise(res => setTimeout(res, 500));
  const canvas = await html2canvas(container, {
    useCORS: true,
    allowTaint: true,
    logging: true,
    scrollY: -window.scrollY,
    scale: 2, // Higher quality
  });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p","mm","a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
  // Multi-page logic
  const pageHeight = pdf.internal.pageSize.getHeight();
  let heightLeft = pdfHeight;
  let position = 0;
  
  pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
  heightLeft -= pageHeight;
  
  while (heightLeft >= 0) {
    position = heightLeft - pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;
  }
  
  pdf.save(fileName);
}

/**
 * Enhanced data-only PDF with improved pagination and quality
 */
export function exportPerformanceReportPDF(data: any[], title: string, scale = 1.2) {
  console.log('🔍 PDF Generation Debug - Title:', title);
  console.log('🔍 PDF Generation Debug - Data length:', data?.length);
  console.log('🔍 PDF Generation Debug - Sample data:', data?.[0]);
  
  if (!data || data.length === 0) {
    console.error('❌ No data provided for PDF generation');
    return;
  }

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  doc.text(`Total Records: ${data.length}`, 14, 40);

  const tableData = data.map(emp => {
    console.log('🔍 Processing employee:', emp);
    return [
      emp.profiles?.name || 'N/A',
      emp.position || 'N/A',
      emp.departments?.name || 'N/A',
      emp.performance_rating || 0,
      emp.hire_date || 'N/A',
      emp.profiles?.email || 'N/A'
    ];
  });

  console.log('🔍 Table data prepared:', tableData);

  (doc as any).autoTable({
    head: [["Name", "Position", "Department", "Rating", "Hire Date", "Email"]],
    body: tableData,
    startY: 50,
    styles: { 
      fontSize: 8 * scale,
      cellPadding: 3,
    },
    headStyles: { 
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    theme: 'striped',
    pageBreak: 'auto',
    showHead: 'everyPage'
  });

  const filename = `${title.replace(/\s/g, "-").toLowerCase()}.pdf`;
  console.log('🔍 Saving PDF with filename:', filename);
  doc.save(filename);
  console.log('✅ PDF saved successfully');
}