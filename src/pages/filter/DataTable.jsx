import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function DataTable({ data }) {
  const navigate = useNavigate();

  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  const columns = [
    { key: "uhid_regno", label: "UHID / Reg. No" },
    { key: "title_fullname", label: "Patient Name" },
    { key: "dateofreg", label: "Registration Date" },
    { key: "time", label: "Registration Time" },
    { key: "dischargedate", label: "Discharge Date" },
    { key: "dischargetime", label: "Discharge Time" },
    { key: "age", label: "Age" },
    { key: "sex", label: "Sex" },
    { key: "patient_type", label: "Patient Type" },
    { key: "doctorIncharge", label: "Doctor Incharge" },
    { key: "empanelment", label: "Empanelment" },
    { key: "localAddress", label: "Local Address" },
  ];

  const handleRowClick = (row) => {
    // Navigate using UHID (or regno if that's unique)
    navigate(`/patient/${row.uhid}`);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ overflowX: "auto", maxWidth: "100%", maxheight: "60vh" }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#5fc1b2" }}>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow
              key={idx}
              onClick={() => handleRowClick(row)}
              sx={{
                backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f5fafa",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#e0f7f4" },
              }}
            >
              {columns.map((col) => {
                let value;

                switch (col.key) {
                  case "uhid_regno":
                    value = `${row.uhid || ""} / ${row.regno || ""}`;
                    break;
                  case "title_fullname":
                    value = `${row.title || ""} ${row.fullname || ""}`;
                    break;
                  case "localAddress":
                    value =
                      row.localAddress && typeof row.localAddress === "object"
                        ? Object.values(row.localAddress).join(", ")
                        : row.localAddress;
                    break;
                  case "doctorIncharge":
                    value = Array.isArray(row.doctorIncharge)
                      ? row.doctorIncharge.join(", ")
                      : row.doctorIncharge;
                    break;
                  default:
                    value = row[col.key];
                }

                return (
                  <TableCell
                    key={col.key}
                    sx={{
                      whiteSpace: "nowrap",
                      fontSize: "0.95rem",
                    }}
                  >
                    {value}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
