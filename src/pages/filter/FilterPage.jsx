import React, { useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import Navbar from "../../components/Navbar";
import FilterForm from "./FilterForm";
import DataTable from "./DataTable";
import jsPDF from "jspdf";
import "jspdf-autotable";


export default function FilterPage() {
  const [filters, setFilters] = useState({});
  const [tableData, setTableData] = useState([]);

  // handle search → call backend
  const handleSearch = async (filterValues) => {
    console.log("Searching with filters:", filterValues);
    setFilters(filterValues);

    try {
      const res = await axios.post("/api/filter", filterValues);
      setTableData(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // handle print → export tableData to PDF
  const handlePrint = () => {
    const doc = new jsPDF();
    doc.text("Patient Report", 14, 10);

    const tableColumn = [
      "S.No",
      "Name",
      "UHID",
      "Department",
      "Bed Allocated",
      "Date of Registration",
    ];

    const tableRows = tableData.map((row, index) => [
      index + 1,
      row.name || "-",
      row.uhid || "-",
      row.department || "-",
      row.bedAllocated || "-",
      row.dateOfRegistration || "-",
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("patient-report.pdf");
  };

  return (
    <Card>
      <Navbar />
      <CardContent sx={{ padding: 5 }}>
        <Typography variant="h6" gutterBottom>
          Filter Data
        </Typography>

        {/* Filters */}
        <FilterForm onSearch={handleSearch} onPrint={handlePrint} />

        {/* Table */}
        <DataTable data={tableData} />
      </CardContent>
    </Card>
  );
}
