import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { Loan } from '../types';
import { Wallet } from 'lucide-react';

interface PaymentScheduleItem {
  paymentDate: Date;
  amount: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  status: string;
}

export const exportRepaymentSchedule = (loan: Loan, schedule: PaymentScheduleItem[]) => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Add company logo
  const logoSize = 20;
  doc.setFillColor(79, 70, 229); // indigo-600
  doc.rect(20, 10, logoSize, logoSize, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('LM', 25, 23);

  // Add company name
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.text('LoanManager', 45, 25);

  // Add loan details
  doc.setFontSize(12);
  doc.text(`Loan Name: ${loan.name}`, 20, 45);
  doc.text(`Principal Amount: $${loan.amount.toFixed(2)}`, 20, 55);
  doc.text(`Interest Rate: ${loan.interestrate}%`, 20, 65);
  doc.text(`Term: ${loan.term} months`, 20, 75);
  doc.text(`Monthly Payment: $${loan.monthlyinstallment.toFixed(2)}`, 20, 85);

  // Add disclaimer
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    'Disclaimer: These calculations are estimates only. Actual bank calculations may vary due to different interest rate computation methods.',
    20, 100, { maxWidth: 170 }
  );

  // Prepare table data
  const tableData = schedule.map(payment => [
    format(payment.paymentDate, 'MMM dd, yyyy'),
    `$${payment.amount.toFixed(2)}`,
    `$${payment.principal.toFixed(2)}`,
    `$${payment.interest.toFixed(2)}`,
    `$${payment.remainingBalance.toFixed(2)}`,
    payment.status.charAt(0).toUpperCase() + payment.status.slice(1)
  ]);

  // Add table
  autoTable(doc, {
    startY: 110,
    head: [['Payment Date', 'Amount', 'Principal', 'Interest', 'Remaining Balance', 'Status']],
    body: tableData,
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 30 },
      5: { cellWidth: 25 }
    },
    margin: { top: 110 },
    didDrawPage: (data) => {
      // Add page number at the bottom
      const pageNumber = doc.getNumberOfPages();
      doc.setFontSize(10);
      doc.text(
        `Page ${pageNumber}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
  });

  // Save the PDF
  doc.save(`${loan.name.replace(/\s+/g, '_')}_repayment_schedule.pdf`);
};