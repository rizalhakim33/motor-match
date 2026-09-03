import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SizingResult, MotorCatalogEntry, FullSizingResult, MechanismType } from '@/types';
import { GainResult } from './gainCalculator';
import { BrandGain } from './gainDialects';

interface PdfExportData {
  result: SizingResult;
  mechanismType: MechanismType;
  selectedMotor?: MotorCatalogEntry | null;
  fullSizing?: FullSizingResult | null;
  gains?: GainResult | null;
  brandDialects?: BrandGain[];
  projectName?: string;
}

/**
 * Generate a professional PDF report for motor sizing results
 */
export function exportSizingPdf(data: PdfExportData): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper: add new page if needed
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Helper: draw section header
  const drawHeader = (text: string) => {
    checkPageBreak(20);
    doc.setFillColor(41, 98, 255);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin + 3, y + 5.5);
    doc.setTextColor(0, 0, 0);
    y += 12;
  };

  // Helper: draw key-value pair
  const drawKV = (key: string, value: string, bold = false) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(key, margin + 2, y);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.text(value, margin + 60, y);
    y += 5;
  };

  // === TITLE ===
  doc.setFillColor(25, 118, 210);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('MOTOR MATCH', margin, 15);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Sizing Report', margin, 23);
  doc.setFontSize(9);
  doc.text(
    `Generated: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}` +
    (data.projectName ? ` | Project: ${data.projectName}` : ''),
    margin,
    30
  );
  doc.setTextColor(0, 0, 0);
  y = 42;

  // === RECOMMENDATION ===
  drawHeader('REKOMENDASI MOTOR');
  const typeLabels: Record<string, string> = {
    servo: 'SERVO MOTOR',
    stepper: 'STEPPER MOTOR',
    induction: 'INDUKSI + VFD'
  };
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(typeLabels[data.result.recommendedType] || data.result.recommendedType.toUpperCase(), margin + 2, y);
  y += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const reasonLines = doc.splitTextToSize(data.result.recommendationReason, contentWidth - 4);
  doc.text(reasonLines, margin + 2, y);
  y += reasonLines.length * 4 + 4;

  // === SIZING SUMMARY ===
  drawHeader('RINGKASAN SIZING');
  const summaryData = [
    ['Parameter', 'Nilai', 'Satuan'],
    ['Mekanisme', data.mechanismType, ''],
    ['Torsi Beban (TL)', data.result.loadTorque.toFixed(4), 'N·m'],
    ['Torsi RMS (Trms)', data.result.rmsTorque.toFixed(4), 'N·m'],
    ['Inersia Beban (JL)', data.result.loadInertia.toExponential(3), 'kg·m²'],
    ['Kecepatan Motor', data.result.motorSpeed.toFixed(0), 'rpm'],
    ['Daya yang Diperlukan', data.result.requiredPower.toFixed(1), 'Watt'],
  ];
  autoTable(doc, {
    startY: y,
    head: [summaryData[0]],
    body: summaryData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [41, 98, 255], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    columnStyles: { 1: { fontStyle: 'bold' } },
    margin: { left: margin, right: margin },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // === SELECTED MOTOR + FULL SIZING ===
  if (data.selectedMotor && data.fullSizing) {
    drawHeader(`MOTOR TERPILIH: ${data.selectedMotor.brand} ${data.selectedMotor.model}`);

    const motorData = [
      ['Parameter', 'Nilai', 'Satuan'],
      ['Merek', data.selectedMotor.brand, ''],
      ['Model', data.selectedMotor.model, ''],
      ['Daya Rated', `${data.selectedMotor.ratedPower}`, 'Watt'],
      ['Torsi Rated', data.selectedMotor.ratedTorque.toFixed(4), 'N·m'],
      ['Torsi Max', data.selectedMotor.maxTorque.toFixed(4), 'N·m'],
      ['Kecepatan Rated', `${data.selectedMotor.ratedSpeed}`, 'rpm'],
      ['Inersia Rotor (JM)', data.selectedMotor.rotorInertia.toExponential(3), 'kg·m²'],
      ['Brake', data.selectedMotor.brakeAvailable ? 'Ya' : 'Tidak', ''],
    ];
    autoTable(doc, {
      startY: y,
      head: [motorData[0]],
      body: motorData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [41, 98, 255], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 1: { fontStyle: 'bold' } },
      margin: { left: margin, right: margin },
    });
    y = (doc as any).lastAutoTable.finalY + 6;

    // Full Sizing Results
    drawHeader('FULL SIZING (4-Phase RMS)');
    const fs = data.fullSizing;
    const fullSizingData = [
      ['Parameter', 'Nilai', 'Status'],
      ['Rasio Inersia (JL/JM)', fs.actualInertiaRatio.toFixed(1), fs.inertiaRatioSatisfied ? 'OK' : 'WARNING'],
      ['Torsi Akselerasi (TA)', fs.actualAccelerationTorque.toFixed(4) + ' N·m', ''],
      ['Peak Torque', fs.actualPeakTorque.toFixed(4) + ' N·m', fs.peakTorqueSatisfied ? 'OK' : 'EXCEEDS'],
      ['RMS Torque', fs.actualRmsTorque.toFixed(4) + ' N·m', fs.dutyCycleSatisfied ? 'OK' : 'EXCEEDS'],
      ['Duty Cycle', fs.dutyCycleSatisfied ? 'PASS' : 'FAIL', ''],
    ];
    autoTable(doc, {
      startY: y,
      head: [fullSizingData[0]],
      body: fullSizingData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [41, 98, 255], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      margin: { left: margin, right: margin },
      didParseCell: function (hookData) {
        if (hookData.column.index === 2) {
          const val = String(hookData.cell.raw);
          if (val === 'OK' || val === 'PASS') {
            hookData.cell.styles.textColor = [34, 139, 34];
            hookData.cell.styles.fontStyle = 'bold';
          } else if (val === 'WARNING' || val === 'EXCEEDS' || val === 'FAIL') {
            hookData.cell.styles.textColor = [220, 53, 69];
            hookData.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });
    y = (doc as any).lastAutoTable.finalY + 6;

    if (fs.recommendedGearRatio) {
      checkPageBreak(10);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`Rekomendasi: Gear ratio ${fs.recommendedGearRatio}:1`, margin + 2, y);
      y += 5;
    }
  }

  // === CANDIDATE MOTORS TABLE ===
  if (data.result.candidateMotors && data.result.candidateMotors.length > 0) {
    checkPageBreak(40);
    drawHeader(`KANDIDAT MOTOR (${data.result.candidateMotors.length} motor)`);

    const candidateRows = data.result.candidateMotors.slice(0, 8).map((m: MotorCatalogEntry) => [
      m.brand,
      m.model,
      `${m.ratedPower}W`,
      m.ratedTorque.toFixed(3),
      m.maxTorque.toFixed(3),
      `${m.ratedSpeed}`,
      m.rotorInertia.toExponential(2),
      m.brakeAvailable ? 'Ya' : '-',
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Merek', 'Model', 'Daya', 'Trated', 'Tmax', 'N', 'Inertia', 'Brake']],
      body: candidateRows,
      theme: 'grid',
      headStyles: { fillColor: [41, 98, 255], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 35 },
        2: { cellWidth: 15 },
        3: { cellWidth: 18 },
        4: { cellWidth: 18 },
        5: { cellWidth: 15 },
        6: { cellWidth: 25 },
        7: { cellWidth: 12 },
      }
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // === GAIN CALCULATOR ===
  if (data.brandDialects && data.brandDialects.length > 0) {
    checkPageBreak(50);
    drawHeader('STARTING-POINT GAIN (Servo)');

    const gainRows = data.brandDialects.map((bg: BrandGain) => [
      `${bg.brand}\n${bg.series}`,
      `${bg.speedGainName}\n${bg.speedGainValue}`,
      `${bg.integralTimeName}\n${bg.integralTimeValue}`,
      `${bg.positionGainName}\n${bg.positionGainValue}`,
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Merek', 'Speed Gain', 'Integral Time', 'Position Gain']],
      body: gainRows,
      theme: 'grid',
      headStyles: { fillColor: [123, 31, 162], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 45 },
        2: { cellWidth: 45 },
        3: { cellWidth: 45 },
      }
    });
    y = (doc as any).lastAutoTable.finalY + 5;

    checkPageBreak(8);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(
      'Catatan: Nilai bersifat starting-point. Verifikasi dan fine-tuning tetap perlu dilakukan di lapangan.',
      margin + 2, y
    );
    doc.setTextColor(0, 0, 0);
    y += 8;
  }

  // === CANDIDATE MOTORS (page 2 if needed) ===
  if (data.result.candidateMotors && data.result.candidateMotors.length > 0 && !data.selectedMotor) {
    checkPageBreak(40);
    drawHeader(`KANDIDAT MOTOR (${data.result.candidateMotors.length} motor)`);

    const candidateRows = data.result.candidateMotors.slice(0, 8).map((m: MotorCatalogEntry) => [
      m.brand,
      m.model,
      `${m.ratedPower}W`,
      m.ratedTorque.toFixed(3),
      m.maxTorque.toFixed(3),
      `${m.ratedSpeed}`,
      m.rotorInertia.toExponential(2),
      m.brakeAvailable ? 'Ya' : '-',
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Merek', 'Model', 'Daya', 'Trated', 'Tmax', 'N', 'Inertia', 'Brake']],
      body: candidateRows,
      theme: 'grid',
      headStyles: { fillColor: [41, 98, 255], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: margin, right: margin },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // === DISCLAIMER ===
  checkPageBreak(20);
  doc.setFillColor(255, 243, 205);
  doc.roundedRect(margin, y, contentWidth, 15, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DISCLAIMER', margin + 3, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(
    'Nilai dalam laporan ini bersifat estimasi berdasarkan data katalog dan formula standar industri.',
    margin + 3, y + 9
  );
  doc.text(
    'Verifikasi dan fine-tuning tetap diperlukan di lapangan sesuai kondisi aktual aplikasi.',
    margin + 3, y + 13
  );

  // === FOOTER ===
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`MotorMatch Sizing Report`, margin, pageHeight - 8);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 8);
  }

  // Save
  const filename = `MotorMatch_${data.mechanismType.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
