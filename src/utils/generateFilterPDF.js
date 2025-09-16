// exportToPDF.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateFilterPDF = (data, preview = false) => {
  if (!data || data.length === 0) {
    alert("No data available to export");
    return;
  }

  const doc = new jsPDF("landscape", "pt", "a4"); // landscape to fit more columns

  // Title
  doc.setFontSize(18);
  doc.text("Patient Report", 40, 40);

  // Print date/time
  const printDate = new Date().toLocaleString();
  doc.setFontSize(10);
  doc.text(`Printed on: ${printDate}`, 40, 60);

  // Define headers (merged + others)
  const headers = [[
    "UHID / Reg. No",
    "Name",
    "Registration Date & Time",
    "Discharge Date & Time",
    "Age",
    "Sex",
    "Patient Type",
    "Doctor Incharge",
    "Empanelment",
    "Local Address"
  ]];

  // Map body rows
  const body = data.map((row) => [
    `${row.uhid || ""} / ${row.regno || ""}`,
    `${row.title || ""} ${row.fullname || ""}`,
    `${row.dateofreg || ""} ${row.time || ""}`,
    `${row.dischargedate || ""} ${row.dischargetime || ""}`,
    row.age || "",
    row.sex || "",
    row.patient_type || "",
    Array.isArray(row.doctorIncharge) ? row.doctorIncharge.join(", ") : row.doctorIncharge || "",
    row.empanelment || "",
    row.localAddress
      ? `${row.localAddress.address || ""}, ${row.localAddress.city || ""}, ${row.localAddress.state || ""}, ${row.localAddress.country || ""} - ${row.localAddress.zip || ""}`
      : "",
  ]);

  // AutoTable
  autoTable(doc, {
    startY: 80,
    head: headers,
    body: body,
    styles: {
      fontSize: 9,
      cellPadding: 5,
      valign: "middle",
    },
    headStyles: {
      fillColor: [95, 193, 178],
      textColor: 255,
      halign: "center",
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 65 },   // UHID / Reg
      1: { cellWidth: 75 },  // Name
      2: { cellWidth: 70 },  // Reg Date
      3: { cellWidth: 70 },  // Discharge Date
      4: { cellWidth: 40 },  // age
      5: { cellWidth: 40 },  // gender
      6: { cellWidth: 55 },  // type
      7: { cellWidth: 100 },  // Doctor Incharge
      8: { cellWidth: 80 },  // Department
      9: { cellWidth: 150 },  // Address
    },
    alternateRowStyles: { fillColor: [245, 250, 250] },
    tableWidth: "wrap",
    didDrawCell: (data) => {
      // allow wrapping for long content
      data.cell.styles.valign = "top";
    },
  });

  // Save / Preview
  if (preview) {
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);
  } else {
    doc.save("patient_report.pdf");
  }
};
