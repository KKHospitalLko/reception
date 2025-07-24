import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  CircularProgress,
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Container,
  Paper
} from "@mui/material";

const PatientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

 useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/patient/${id}`, {
        headers: {
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
      });
      // console.log("Fetched patient data:", res);
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching patient data", err);
      setLoading(false);

      // If 404, show alert and go back
      if (err.response && err.response.status === 404) {
        alert("Patient not found. Redirecting to registration.");
        navigate("/registration");
      }
    }
  };

  fetchData();
}, [id, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
  <Box py={4}>
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
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
          sx={{ backgroundColor: "#43a047", "&:hover": { backgroundColor: "#2e7d32" } }}
        >
          + Add New Report
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom fontWeight="bold">
        Patient Records
      </Typography>

      <Grid container spacing={3}>
        {data.map((item) => (
          <Grid item xs={12} key={item.regno}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Box borderBottom="1px solid #ccc" pb={2} mb={2}>
                <Typography variant="h6">
                  {item.title} {item.fullname}
                </Typography>
                <Typography color="text.secondary">
                  UHID: {item.uhid} | Reg No: {item.regno}
                </Typography>
                <Typography color="text.secondary">
                  Registered by: {item.registered_by}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Personal Information
                  </Typography>
                  <Typography><strong>Age:</strong> {item.age}</Typography>
                  <Typography><strong>Sex:</strong> {item.sex}</Typography>
                  <Typography><strong>Mobile:</strong> {item.mobile}</Typography>
                  <Typography><strong>Blood Group:</strong> {item.bloodGroup}</Typography>
                  <Typography><strong>Religion:</strong> {item.religion}</Typography>
                  <Typography><strong>Marital Status:</strong> {item.maritalStatus}</Typography>
                  <Typography><strong>Father/Husband:</strong> {item.fatherHusband}</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Registration Details
                  </Typography>
                  <Typography><strong>Date:</strong> {item.dateofreg}</Typography>
                  <Typography><strong>Time:</strong> {item.time}</Typography>
                  <Typography><strong>Reg Amount:</strong> ₹{item.regAmount}</Typography>
                  <Typography><strong>Empanelment:</strong> {item.empanelment}</Typography>
                  {/* <Typography><strong>Intimation/Extension:</strong> {item.intimationOrExtension}</Typography> */}
                  <Typography><strong>Doctor(s):</strong></Typography>
                  <Box mt={1}>
                    {(item.doctorIncharge || []).map((doc) => (
                      <Chip key={doc} label={doc} size="small" sx={{ mr: 0.5, mt: 0.5 }} />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Local Address
                  </Typography>
                  <Typography>
                    {item.localAddress?.address}, {item.localAddress?.city}, {item.localAddress?.state}, {item.localAddress?.country} - {item.localAddress?.zip}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Permanent Address
                  </Typography>
                  <Typography>
                    {item.permanentAddress?.address}, {item.permanentAddress?.city}, {item.permanentAddress?.state}, {item.permanentAddress?.country} - {item.permanentAddress?.zip}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

};

export default PatientPage;
