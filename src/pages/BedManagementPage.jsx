import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const departments = [
  "Emergency",
  "ICU",
  "NICU",
  "HDU",
  "Dialysis",
  "Male Ward",
  "Female Ward",
  "General Ward",
  "General Ward (AC)",
  "Post-Op",
  "1st Floor Private",
  "1st Floor Semi Private",
  "2nd Floor Semi Private",
  "2nd Floor Private",
];

const bedNumbers = {
  "Emergency": ["E-1", "E-2", "E-3", "E-4", "E-5", "E-6", "E-7", "E-8", "E-9"],
  "Dialysis": ["D-1", "D-2", "D-3", "D-4", "D-5"],
  "1st Floor Private": ["P1-102", "P1-103", "P1-104", "P1-105", "P1-106 (Reserved)", "P1-107", "P1-108", "P1-109", "P1-110"],
  "1st Floor Semi Private": ["SP1-111 A", "SP1-111 B", "SP1-112 A", "SP1-112 B", "SP1-113 A", "SP1-113 B"],
  "NICU": ["NICU-1", "NICU-2", "NICU-3", "NICU-4", "NICU-5", "NICU-6", "NICU-7", "NICU-8"],
  "2nd Floor Semi Private": ["SP2-201 A", "SP2-201 B", "SP2-202 A", "SP2-202 B", "SP2-203", "SP2-204", "SP2-205 A", "SP2-205 B", "SP2-211 A", "SP2-211 B", "SP2-212 A", "SP2-212 B", "SP2-213 A", "SP2-213 B", "SP2-214 A", "SP2-214 B", "SP2-215 A", "SP2-215 B", "SP2-216 A", "SP2-216 B"],
  "General Ward": ["GW-206", "GW-207", "GW-208", "GW-209", "GW-210"],
  "General Ward (AC)": ["GWA-220", "GWA-221", "GWA-222", "GWA-223"],
  "2nd Floor Private": ["P2-217", "P2-218", "P2-219"],
  "ICU": ["ICU-1", "ICU-2", "ICU-3", "ICU-4", "ICU-5", "ICU-6", "ICU-7", "ICU-8", "ICU-9"],
  "Post-Op": ["PO-1", "PO-2", "PO-3", "PO-4", "PO-5", "PO-6", "PO-7", "PO-8"],
  "HDU": ["HDU-301", "HDU-302", "HDU-303", "HDU-304", "HDU-305", "HDU-306", "HDU-307", "HDU-308"],
  "Female Ward": ["FW-1", "FW-2", "FW-3", "FW-4", "FW-5", "FW-6", "FW-7", "FW-8"],
  "Male Ward": ["MW-10", "MW-11", "MW-12", "MW-13", "MW-14", "MW-15", "MW-16", "MW-17"],
};



export default function BedAllocationPage() {
  const [uhid, setUhid] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [bed, setBed] = useState("");
  const [allotments, setAllotments] = useState([]);

  const handleAdd = () => {
    if (!uhid || !name || !department || !bed) {
      alert("Please fill all fields");
      return;
    }
    setAllotments((prev) => [
      ...prev,
      { uhid, name, department, bed }
    ]);
    // clear fields
    setUhid("");
    setName("");
    setDepartment("");
    setBed("");
  };

  const handleClear = (index) => {
    const updated = [...allotments];
    updated.splice(index, 1);
    setAllotments(updated);
  };

  const handleChangeBed = (index) => {
    const newBed = prompt("Enter new bed number:");
    if (newBed) {
      setAllotments((prev) =>
        prev.map((a, i) =>
          i === index ? { ...a, bed: newBed } : a
        )
      );
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>
        Bed Allocation
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              label="UHID"
              value={uhid}
              onChange={(e) => setUhid(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Patient Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Department"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setBed(""); // reset bed on dept change
              }}
              fullWidth
            >
              {departments.map((dep) => (
                <MenuItem key={dep} value={dep}>
                  {dep}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Bed Number"
              value={bed}
              onChange={(e) => setBed(e.target.value)}
              fullWidth
              disabled={!department}
            >
              {(bedNumbers[department] || []).map((b) => (
                <MenuItem key={b} value={b}>
                  {b}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button variant="contained" onClick={handleAdd}>
            Allot Bed
          </Button>
        </Box>
      </Paper>

      <Typography variant="h5" mb={1}>
        Allotted Beds
      </Typography>
      {allotments.length === 0 ? (
        <Typography>No beds allotted yet.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>UHID</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Bed Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allotments.map((a, index) => (
              <TableRow key={index}>
                <TableCell>{a.uhid}</TableCell>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.department}</TableCell>
                <TableCell>{a.bed}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleClear(index)}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleChangeBed(index)}
                    sx={{ ml: 1 }}
                  >
                    Change Bed
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}
