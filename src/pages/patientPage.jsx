import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  CircularProgress,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
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
        const res = await axios.get(`${backendUrl}/patient/${id}`); 
        setData(res.data); // you said it's an array of forms
        setLoading(false);
      } catch (err) {
        console.error("Error fetching patient data", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Box mb={2} display="flex" justifyContent="space-between">
        <Button
          onClick={() => navigate(`/registration`)}
          sx={{
            backgroundColor: "#5fc1b2",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#4da99f",
            },
          }}
        >
          ← Back
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate(`/patient/${id}/new`)}
          sx={{
            backgroundColor: "#5fc1b2",
            "&:hover": {
              backgroundColor: "#4da99f",
            },
          }}
        >
          + Add New Report
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Patient Records
      </Typography>
      <Grid container spacing={2}>
        {data.map((item) => (
          <Grid item xs={12} key={item.regno}>
            <Card sx={{ borderRadius: 3, boxShadow: 4, p: 2 }}>
              <CardContent>
                <Box mb={2} borderBottom="1px solid #ccc" pb={1}>
                  <Typography variant="h5" fontWeight="bold">
                    {item.title} {item.fullname}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    UHID: {item.uhid} &nbsp;|&nbsp; Reg No: {item.regno}
                  </Typography>
                </Box>

                <Box display="flex" flexWrap="wrap" gap={4}>
                  <Box flex="1 1 300px">
                    <Typography variant="subtitle1" gutterBottom>
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
                      <strong>Blood Group:</strong> {item.bloodGroup}
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
                  </Box>

                  <Box flex="1 1 300px">
                    <Typography variant="subtitle1" gutterBottom>
                      Registration Details
                    </Typography>
                    <Typography>
                      <strong>Date of Registration:</strong> {item.dateofreg}
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
                      <strong>Intimation/Extension:</strong>{" "}
                      {item.intimationOrExtension}
                    </Typography>
                    <Box mt={1}>
                      <Typography>
                        <strong>Doctor(s) In Charge:</strong>
                      </Typography>
                      {(item.doctorIncharge || []).map((doc) => (
                        <Chip
                          key={doc}
                          label={doc}
                          size="small"
                          sx={{ mr: 0.5, mt: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Local Address
                  </Typography>
                  <Typography>
                    {item.localAddress?.address || ""},{" "}
                    {item.localAddress?.city || ""},{" "}
                    {item.localAddress?.state || ""},{" "}
                    {item.localAddress?.country || ""} -{" "}
                    {item.localAddress?.zip || ""}
                  </Typography>
                </Box>

                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Permanent Address
                  </Typography>
                  <Typography>
                    {item.permanentAddress?.address || ""},{" "}
                    {item.permanentAddress?.city || ""},{" "}
                    {item.permanentAddress?.state || ""},{" "}
                    {item.permanentAddress?.country || ""} -{" "}
                    {item.permanentAddress?.zip || ""}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PatientPage;
