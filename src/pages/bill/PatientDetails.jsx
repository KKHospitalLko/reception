import React from "react";
import { Typography, Box, Divider } from "@mui/material";

export default function PatientDetails({ patient, beds, todayDate }) {
  return (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>
        Patient Details
      </Typography>
      <Divider />
      <Box mt={2}>
        <Typography><strong>Name:</strong> {patient.name || "-"}</Typography>
        <Typography><strong>UHID:</strong> {patient.uhid || "-"}</Typography>
        <Typography><strong>Bed:</strong> {beds?.bedNumber || "-"}</Typography>
        <Typography><strong>Date:</strong> {todayDate}</Typography>
      </Box>
    </Box>
  );
}
