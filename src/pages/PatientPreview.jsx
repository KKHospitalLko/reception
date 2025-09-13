import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { generatePatientPDF } from "../utils/generatePatientPDF.js";
import Navbar from "../components/Navbar";
import axios from "axios";
import {
  CircularProgress,
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Container,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";

const PatientPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Modal state
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientType, setPatientType] = useState("");

  // Snackbar state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backendUrl}/patient/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        });
        // Ensure data is always an array
        const result = Array.isArray(res.data) ? res.data : [res.data];
        setData(result);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching patient data", err);
        setLoading(false);

        if (err.response && err.response.status === 404) {
          showToast("Patient not found. Redirecting...", "error");
          setTimeout(() => navigate("/registration"), 1500);
        } else {
          showToast("Failed to fetch patient data", "error");
        }
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleOpen = (patient) => {
    setSelectedPatient(patient);
    setPatientType(patient.patient_type); // prefill current type
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPatient(null);
    setPatientType("");
  };

  const handleSubmit = async () => {
    if (!selectedPatient) return;
    try {
      const res = await axios.patch(
        `${backendUrl}/patient/change/${selectedPatient.uhid}`,
        { patient_type: patientType },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      );

      console.log("Update response:", res.data);
      // update state locally
      setData((prev) =>
        prev.map((p) =>
          p.uhid === selectedPatient.uhid
            ? { ...p, patient_type: patientType }
            : p
        )
      );

      showToast("Patient type updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 100);
      handleClose();
    } catch (err) {
      console.error("Error updating patient type", err);
      showToast("Failed to update patient type", "error");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box py={4}>
        <Container maxWidth="lg">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Button
              variant="contained"
              onClick={() => navigate(`/registration`)}
              sx={{
                mb: 2,
                backgroundColor: "#5fc1b2",
                "&:hover": { backgroundColor: "#4da99f" },
              }}
            >
              ← Back
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate(`/patient/${id}/new`)}
              sx={{
                backgroundColor: "#43a047",
                "&:hover": { backgroundColor: "#2e7d32" },
              }}
            >
              + Add New Report
            </Button>
          </Box>

          <Typography variant="h4" gutterBottom fontWeight="bold">
            Patient Records
          </Typography>

          <Grid container spacing={3}>
            {data.map((item, index) => (
              <Grid item xs={12} key={item.regno}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                  <Box
                    borderBottom="1px solid #ccc"
                    pb={2}
                    mb={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="h6">
                        {item.title} {item.fullname}
                      </Typography>
                      <Typography color="text.secondary">
                        UHID: {item.uhid} | Reg No: {item.regno} | Patient Type:{" "}
                        {item.patient_type}
                      </Typography>
                      <Typography color="text.secondary">
                        Registered by: {item.registered_by}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      {index === 0 && (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleOpen(item)}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => generatePatientPDF(item, true)}
                      >
                        Print
                      </Button>
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    {/* --- Personal Information --- */}
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                      >
                        Personal Information
                      </Typography>
                      <Typography>
                        <strong>Age:</strong> {item.age}
                      </Typography>
                      <Typography>
                        <strong>Sex:</strong> {item.sex}
                      </Typography>
                      <Typography>
                        <strong>Mobile:</strong> {item.mobile}
                      </Typography>
                      <Typography>
                        <strong>Aadhaar:</strong> {item.adhaar_no}
                      </Typography>
                      <Typography>
                        <strong>Religion:</strong> {item.religion}
                      </Typography>
                      <Typography>
                        <strong>Marital Status:</strong> {item.maritalStatus}
                      </Typography>
                      <Typography>
                        <strong>Father/Husband:</strong> {item.fatherHusband}
                      </Typography>
                    </Grid>

                    {/* --- Registration Details --- */}
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                      >
                        Registration Details
                      </Typography>
                      <Typography>
                        <strong>Date:</strong> {item.dateofreg}
                      </Typography>
                      <Typography>
                        <strong>Time:</strong> {item.time}
                      </Typography>
                      <Typography>
                        <strong>Reg Amount:</strong> ₹{item.regAmount}
                      </Typography>
                      <Typography>
                        <strong>Empanelment:</strong> {item.empanelment}
                      </Typography>
                      <Typography>
                        <strong>Doctor(s):</strong>
                      </Typography>
                      <Box mt={1}>
                        {(item.doctorIncharge || []).map((doc) => (
                          <Chip
                            key={doc}
                            label={doc}
                            size="small"
                            sx={{ mr: 0.5, mt: 0.5 }}
                          />
                        ))}
                      </Box>
                    </Grid>

                    {/* --- Addresses --- */}
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                      >
                        Local Address
                      </Typography>
                      <Typography>
                        {item.localAddress?.address}, {item.localAddress?.city},{" "}
                        {item.localAddress?.state}, {item.localAddress?.country}{" "}
                        - {item.localAddress?.zip}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                      >
                        Permanent Address
                      </Typography>
                      <Typography>
                        {item.permanentAddress?.address},{" "}
                        {item.permanentAddress?.city},{" "}
                        {item.permanentAddress?.state},{" "}
                        {item.permanentAddress?.country} -{" "}
                        {item.permanentAddress?.zip}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* --- Edit Modal --- */}
          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>Edit Patient Type</DialogTitle>
            <DialogContent>
              <RadioGroup
                value={patientType}
                onChange={(e) => setPatientType(e.target.value)}
              >
                <FormControlLabel value="OPD" control={<Radio />} label="OPD" />
                <FormControlLabel value="IPD" control={<Radio />} label="IPD" />
                <FormControlLabel
                  value="DAYCARE"
                  control={<Radio />}
                  label="Daycare"
                />
              </RadioGroup>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ backgroundColor: "#43a047" }}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* --- Snackbar --- */}
          <Snackbar
            open={toast.open}
            autoHideDuration={3000}
            onClose={() => setToast({ ...toast, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              severity={toast.severity}
              onClose={() => setToast({ ...toast, open: false })}
              sx={{ width: "100%" }}
            >
              {toast.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </>
  );
};

export default PatientPreview;
