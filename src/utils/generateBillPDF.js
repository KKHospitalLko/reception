import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateBillPDF = (billData) => {
  const doc = new jsPDF("p", "mm", "a4");

  // ---------- HEADER ----------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("City Hospital", 105, 15, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("123 Health Street, Medical City, India", 105, 22, { align: "center" });
  doc.text("Phone: +91 9876543210 | Email: info@cityhospital.com", 105, 28, { align: "center" });

  doc.setDrawColor(100);
  doc.line(10, 32, 200, 32);

  // ---------- BILL TITLE ----------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("FINAL BILL", 105, 40, { align: "center" });

  // ---------- PATIENT DETAILS ----------
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  let y = 50;
  doc.text(`Bill No: ${billData.final_bill_no || ""}`, 14, y);
  doc.text(`Date: ${billData.discharge_date || ""} ${billData.discharge_time || ""}`, 150, y);

  y += 8;
  doc.text(`Patient Name: ${billData.patient_name || ""}`, 14, y);
  doc.text(`UHID: ${billData.patient_uhid || ""}`, 150, y);

  y += 8;
  doc.text(`Reg No: ${billData.patient_regno || ""}`, 14, y);
  doc.text(`Age/Gender: ${billData.age || ""} / ${billData.gender || ""}`, 150, y);

  y += 8;
  doc.text(`Consultant: ${billData.consultant_doctor || ""}`, 14, y);

  y += 8;
  doc.text(`Admission: ${billData.admission_date || ""}`, 14, y);
  doc.text(`Discharge: ${billData.discharge_date || ""}`, 150, y);

  y += 8;
  doc.text(`Room Type: ${billData.room_type || ""}`, 14, y);
  doc.text(`Bed No: ${billData.bed_no || ""}`, 150, y);

  // ---------- CHARGES SUMMARY ----------
  const chargesHead = [["S.No", "Particulars", "Qty", "Rate", "Amount"]];
  const chargesBody =
    billData.charges_summary?.map((item, idx) => [
      idx + 1,
      item.particulars,
      item.quantity,
      item.rate?.toFixed(2),
      item.amount?.toFixed(2),
    ]) || [];

  autoTable(doc, {
    startY: y + 10,
    head: chargesHead,
    body: chargesBody,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    bodyStyles: { textColor: 50 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 14, right: 14 },
  });

  let afterChargesY = doc.lastAutoTable.finalY + 10;

  // ---------- TOTALS ----------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text(`Total Charges: ₹${billData.total_charges || 0}`, 180, afterChargesY, { align: "right" });
  afterChargesY += 6;
  doc.text(`Total Discount: ₹${billData.total_discount || 0}`, 180, afterChargesY, { align: "right" });
  afterChargesY += 6;
  doc.text(`Net Amount: ₹${billData.net_amount || 0}`, 180, afterChargesY, { align: "right" });
  afterChargesY += 6;
  doc.text(`Paid: ₹${billData.total_paid || 0}`, 180, afterChargesY, { align: "right" });
  afterChargesY += 6;
  doc.text(`Balance: ₹${billData.balance || 0}`, 180, afterChargesY, { align: "right" });

  // ---------- TRANSACTION BREAKDOWN ----------
  const txnHead = [["Date", "Transaction No", "Amount"]];
  const txnBody =
    billData.transaction_breakdown?.map((txn) => [
      txn.date,
      txn.transaction_no,
      txn.amount?.toFixed(2),
    ]) || [];

  autoTable(doc, {
    startY: afterChargesY + 10,
    head: txnHead,
    body: txnBody,
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [22, 160, 133], textColor: 255 },
    margin: { left: 14, right: 14 },
  });

  // ---------- FOOTER ----------
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.text("This is a computer generated final bill. No signature required.", 105, 285, { align: "center" });

  // ---------- PREVIEW ----------
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl); // open in new tab for preview
};
