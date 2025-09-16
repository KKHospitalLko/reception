import React, { useState } from "react";
import { Box, TextField, MenuItem, Button, Grid } from "@mui/material";

const patientTypes = [
  { value: "All", label: "All" },
  { value: "OPD", label: "OPD" },
  { value: "IPD", label: "IPD" },
  { value: "DAYCARE", label: "Daycare" },
];

const doctorOptions = [
  "All",
  "Dr. Dhirendra Pratap",
  "Dr. Sunita Singh",
  "Dr. Anita Singh",
  "Dr. Sameer Beg",
  "Dr. Rajiv Rastogi",
  "Dr. S.N.S. Yadav",
  "Dr. P.K. Mishra",
  "Dr. Shilpi Sahai",
  "Dr. Manish Tandon",
  "Dr. Govind Pratap Singh",
  "Dr. A.K. Srivastava",
  "Dr. Apoorva Kumar",
  "Dr. Lokesh Kumar",
  "Dr. Mohammad Suhel",
  "Dr. Vinay Kumar Gupta",
  "Dr. B.N. Singh",
  "Dr. Ruby Singh",
  "Dr. Ahmad Ayaz",
];

const departmentOptions = [
  "All",
  "Ayushman Bharat (cash)",
  "Ayushman Bharat (cashless)",
  "CGHS (cash)",
  "CGHS (cashless)",
  "CMRF (cash)",
  "CMRF (cashless)",
  "DDU (cash)",
  "DDU (cashless)",
  "ECHS (cash)",
  "ECHS (cashless)",
  "ESIC (cash)",
  "ESIC (cashless)",
  "Insurance (cash)",
  "Insurance (cashless)",
  "NER (cash)",
  "NER (cashless)",
  "NR (cash)",
  "NR (cashless)",
  "Private (cash)",
  "Private (cashless)",
  "Rail Coach (cash)",
  "Rail Coach (cashless)",
  "RDSO (cash)",
  "RDSO (cashless)",
  "UP Police (cash)",
  "UP Police (cashless)",
];

export default function FilterForm({ onSearch, onPrint }) {
  const [formValues, setFormValues] = useState({
    date_from: "",
    date_to: "",
    patient_type: "",
    doctor_wise: "",
    empanelment : "",
  });

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSearch(formValues);
  };

  return (
    <Box mb={3} px={4}>
      {" "}
      {/* padding on left/right */}
      {/* Row 1: Start & End Date */}
      <Box display="flex" gap={2} mb={2}>
        <Box flex={1}>
          <TextField
            type="date"
            label="From Date"
            name="date_from"
            value={formValues.date_from}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ width: "100%" }}
          />
        </Box>

        <Box flex={1}>
          <TextField
            type="date"
            label="To Date"
            name="date_to"
            value={formValues.date_to}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ width: "100%" }}
          />
        </Box>
      </Box>
      {/* Row 2: Dropdowns */}
      <Box display="flex" gap={2} mb={2}>
        <Box flex={1}>
          <TextField
            select
            label="Patient Type"
            name="patient_type"
            value={formValues.patient_type}
            onChange={handleChange}
            sx={{ width: "100%" }}
          >
            {patientTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box flex={1}>
          <TextField
            select
            label="Doctor"
            name="doctor_wise"
            value={formValues.doctor_wise}
            onChange={handleChange}
            sx={{ width: "100%" }}
          >
            {doctorOptions.map((doc) => (
              <MenuItem key={doc} value={doc}>
                {doc}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box flex={1}>
          <TextField
            select
            label="Empanelment"
            name="empanelment"
            value={formValues.empanelment }
            onChange={handleChange}
            sx={{ width: "100%" }}
          >
            {departmentOptions.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
      {/* Buttons */}
      <Box mt={2} display="flex" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSearch(formValues)}
        >
          Search
        </Button>
        <Button variant="outlined" color="secondary" onClick={onPrint}>
          Print
        </Button>
      </Box>
    </Box>
  );
}
