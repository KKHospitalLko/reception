import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LogoBase64 } from "./Logo";

export const generateBillPDF = (billData, preview = false) => {
  console.log("Generating Bill PDF with data:", billData);

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Safe defaults
  const chargesSummary = Array.isArray(billData[0].charges_summary)
    ? billData[0].charges_summary
    : [];
  const transactions = Array.isArray(billData[0].transaction_breakdown)
    ? billData[0].transaction_breakdown
    : [];

  // const username = sessionStorage.getItem("username") || "Unknown";

  const now = new Date();
  const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const rawTime = now.toTimeString().split(" ")[0]; // HH:MM:SS
  const [hours, minutes, seconds] = rawTime.split(":");
  const hh = parseInt(hours);
  const ampm = hh >= 12 ? "PM" : "AM";
  const formattedHour = hh % 12 || 12;
  const currentTime = `${formattedHour}:${minutes}:${seconds} ${ampm}`;

  // ---------------- HEADER ----------------
  doc.addImage(LogoBase64, "PNG", pageWidth - 40, 15, 20, 20);

  doc.setFontSize(16);
  doc.setTextColor(204, 0, 0);
  doc.text("K.K. HOSPITAL, LUCKNOW", 20, 15);

  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(
    "Address: 87/88, Nabiullah Road, Opp. SSP Office, River Bank Colony, Lucknow",
    20,
    21
  );
  doc.text("Phone: 0522-2619049/50 & 2231932", 20, 26);
  doc.text(
    "Email: kkhospitallko1991@gmail.com, contact@kkhospitallucknow.com",
    20,
    31
  );
  doc.text("GSTIN: 09AAATK4016C2ZZ, Registration Number: 0915700003", 20, 37);
  doc.text(
    "___________________________________________________________________________________",
    20,
    40
  );

  doc.setFontSize(13);
  doc.setTextColor(33, 150, 243);
  doc.text("FINAL BILL SUMMARY", 75, 55);

  // ---------------- PATIENT DETAILS ----------------
  const patient = billData[0]; // for shorter reference

  const patientRows = [
    ["Bill No.", patient.final_bill_no || "-"],
    ["UHID", patient.patient_uhid || "-"],
    ["Registration No.", patient.patient_regno || "-"],
    ["Patient Name", patient.patient_name || "-"],
    ["Age / Gender", `${patient.age || "-"} / ${patient.gender || "-"}`],
    ["Consultant Doctor(s)", patient.consultant_doctor || "-"],
    ["Room", `${patient.room_type || "-"} (${patient.bed_no || "-"})`],
    ["Admission Date", patient.admission_date || "-"],
    ["Admission Time", patient.admission_time || "-"],
    ["Registration Amount", "Rs. " + (patient.reg_amount || "-")],
  ];

  // hide discharge date and time if empty
  if (patient.discharge_date !== "") {
    patientRows.splice(9, 0, ["Discharge Date", patient.discharge_date || "-"]);
    patientRows.splice(10, 0, [
      "Discharge Time",
      patient.discharge_time || "-",
    ]);
  }

  autoTable(doc, {
    startY: 65,
    theme: "grid",
    head: [["Patient Details", "Information"]],
    body: patientRows,
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  });

  // ---------------- CHARGES SUMMARY ----------------
  const charges = chargesSummary.length
    ? chargesSummary.map((item, i) => [
        i + 1,
        item.particulars || "-",
        item.quantity || "-",
        item.rate || "-",
        item.amount || "-",
      ])
    : [["-", "No charges found", "-", "-", "-"]];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    theme: "grid",
    head: [["S.No.", "Particulars", "Qty", "Rate", "Amount (in Rs.)"]],
    body: charges,
    headStyles: { fillColor: [41, 128, 185] },
  });

  // ---------------- DISCOUNTS & TOTALS ----------------
  const discountPercent = billData[0].total_discount?.discount_percent || "0";
  const discountRupee = billData[0].total_discount?.discount_rupee || "0";
  const discountType = billData[0].total_discount?.discount_type || "amount";

  const totals = [
    ["Total Charges", billData[0].total_charges || 0],
    [
      "Discount",
      discountType === "percentage"
        ? `${discountRupee} (${discountPercent})`
        : `${discountRupee}`,
    ],
    ["Net Amount", billData[0].net_amount || 0],
    ["Total Paid", billData[0].total_paid || 0],
    ["Balance", billData[0].balance || 0],
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    theme: "grid",
    head: [["Summary", "Amount (in Rs.)"]],
    body: totals,
    columnStyles: {
      0: { cellWidth: 80, fontStyle: "bold" },
      1: { halign: "left" },
    },
  });

  // ---------------- TRANSACTIONS ----------------
  if (transactions.length > 0) {
    const transactionRows = transactions.map((t, i) => [
      i + 1,
      t.transaction_no || "-",
      t.date || "-",
      t.amount || "-",
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      theme: "grid",
      head: [["S.No.", "Transaction No", "Date", "Amount (in Rs.)"]],
      body: transactionRows,
      headStyles: { fillColor: [46, 204, 113] },
    });
  }

  // ---------------- FOOTER ----------------
  const baseY = doc.lastAutoTable.finalY + 15;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);

  doc.text("Declaration:", 14, baseY);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    "This is a computer-generated bill. Please retain this for your records.",
    14,
    baseY + 5
  );

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Authorized Signatory:", 14, baseY + 20);
  doc.setFont("helvetica", "normal");
  doc.text("_______________________", 14, baseY + 30);
  if (
    patient.empanelment &&
    patient.empanelment.toLowerCase().includes("cashless")
  ) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Patient / Attendee Sign:", 130, baseY + 20);

    doc.setFont("helvetica", "normal");
    doc.text("_______________________", 130, baseY + 30);
  }

  // Only show Date/Time if NOT cashless
  if (!billData[0].empanelment?.toLowerCase().includes("cashless")) {
    doc.setFont("helvetica", "bold");
    doc.text("Bill Generated Date:", 14, baseY + 40);
    doc.setFont("helvetica", "normal");
    doc.text(currentDate, 60, baseY + 40);

    doc.setFont("helvetica", "bold");
    doc.text("Bill Generated Time:", 14, baseY + 50);
    doc.setFont("helvetica", "normal");
    doc.text(currentTime, 60, baseY + 50);
  }

  doc.setFontSize(8);
  doc.setFont("helvetica", "italic", "bold");
  doc.text("Note: Payments are accepted at reception only", 14, baseY + 65);

  // ---------------- OUTPUT ----------------
  if (preview) {
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);
  } else {
    doc.save(`bill_${billData[0].final_bill_no || "NA"}.pdf`);
  }
};
