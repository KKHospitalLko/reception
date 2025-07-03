import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  MenuItem
} from "@mui/material";

const NewReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    name: "",
    gender: "",
    phone: "",
    age: "",
    empanelment: "",
    bloodGroup: "",
    religion: "",
    empanelType: "",
    maritalStatus: "",
    fatherOrHusband: "",
    doctorIncharge: [],
    regAmount: "",
    localAddress: "",
    localCity: "",
    localState: "",
    localCountry: "",
    localZip: "",
    permanentAddress: "",
    permanentCity: "",
    permanentState: "",
    permanentCountry: "",
    permanentZip: "",
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`${backendUrl}/patient/${id}`);
        const p = res.data[0]; // taking first record
        setPatient(p);
        console.log("Fetched patient data:", p);
        setFormData({
          ...formData,
          uhid: p.uhid,
          title: p.title,
          name: p.fullname,
          gender: p.sex,
          phone: p.mobile,
          age: p.age,
          bloodGroup: p.bloodGroup,
          empanelment: p.empanelment,
          empanelType: p.intimationOrExtension,
          regAmount: p.regAmount || "",
          religion: p.religion,
          maritalStatus: p.maritalStatus,
          fatherOrHusband: p.fatherHusband,
          doctorIncharge: p.doctorIncharge || [],
          localAddress: p.localAddress?.address || "",
          localCity: p.localAddress?.city || "",
          localState: p.localAddress?.state || "",
          localCountry: p.localAddress?.country || "",
          localZip: p.localAddress?.zip || "",
          permanentAddress: p.permanentAddress?.address || "",
          permanentCity: p.permanentAddress?.city || "",
          permanentState: p.permanentAddress?.state || "",
          permanentCountry: p.permanentAddress?.country || "",
          permanentZip: p.permanentAddress?.zip || "",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        uhid: formData.uhid,
        title: formData.title,
        fullname: formData.name,
        sex: formData.gender,
        mobile: formData.phone || 0,
        dateofreg: "",
        time: "",
        age: formData.age || 0,
        empanelment: formData.empanelment,
        bloodGroup: formData.bloodGroup,
        religion: formData.religion,
        intimationOrExtension: formData.empanelType,
        maritalStatus: formData.maritalStatus,
        fatherHusband: formData.fatherOrHusband,
        doctorIncharge: formData.doctorIncharge,
        regAmount: formData.regAmount || 0,
        localAddress: {
          address: formData.localAddress,
          city: formData.localCity,
          state: formData.localState,
          country: formData.localCountry,
          zip: formData.localZip || 0,
        },
        permanentAddress: {
          address: formData.permanentAddress,
          city: formData.permanentCity,
          state: formData.permanentState,
          country: formData.permanentCountry,
          zip: formData.permanentZip || 0,
        },
      };

      await axios.put(`${backendUrl}/patient/${formData.uhid}`, payload);
      alert("New report saved!");
      navigate(`/patient/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save new report");
    }
  };

  if (loading) {
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        ← Back
      </Button>
      <Typography variant="h5" mb={2}>
        Create New Report for {patient.fullname}
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {/* All fields here */}
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        />
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <TextField
          label="Age"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
        <TextField
          label="Empanelment"
          name="empanelment"
          value={formData.empanelment}
          onChange={handleChange}
        />
        <TextField
          label="Blood Group"
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
        />
        <TextField
          label="Religion"
          name="religion"
          value={formData.religion}
          onChange={handleChange}
        />
        <TextField
          label="Intimation / Extension"
          name="empanelType"
          value={formData.empanelType}
          onChange={handleChange}
        />
        <TextField
          label="Marital Status"
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={handleChange}
        />
        <TextField
          label="Father / Husband"
          name="fatherOrHusband"
          value={formData.fatherOrHusband}
          onChange={handleChange}
        />
        <TextField
          label="Doctor Incharge (comma separated)"
          name="doctorIncharge"
          value={formData.doctorIncharge.join(", ")}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              doctorIncharge: e.target.value.split(",").map((s) => s.trim()),
            }))
          }
        />
        <TextField
          label="Registration Amount"
          name="regAmount"
          value={formData.regAmount}
          onChange={handleChange}
        />

        {/* Local address */}
        <Typography variant="h6" mt={2}>Local Address</Typography>
        <TextField
          label="Address"
          name="localAddress"
          value={formData.localAddress}
          onChange={handleChange}
        />
        <TextField
          label="City"
          name="localCity"
          value={formData.localCity}
          onChange={handleChange}
        />
        <TextField
          label="State"
          name="localState"
          value={formData.localState}
          onChange={handleChange}
        />
        <TextField
          label="Country"
          name="localCountry"
          value={formData.localCountry}
          onChange={handleChange}
        />
        <TextField
          label="ZIP"
          name="localZip"
          value={formData.localZip}
          onChange={handleChange}
        />

        {/* Permanent address */}
        <Typography variant="h6" mt={2}>Permanent Address</Typography>
        <TextField
          label="Address"
          name="permanentAddress"
          value={formData.permanentAddress}
          onChange={handleChange}
        />
        <TextField
          label="City"
          name="permanentCity"
          value={formData.permanentCity}
          onChange={handleChange}
        />
        <TextField
          label="State"
          name="permanentState"
          value={formData.permanentState}
          onChange={handleChange}
        />
        <TextField
          label="Country"
          name="permanentCountry"
          value={formData.permanentCountry}
          onChange={handleChange}
        />
        <TextField
          label="ZIP"
          name="permanentZip"
          value={formData.permanentZip}
          onChange={handleChange}
        />

        <Button variant="contained" onClick={handleSubmit}>
          Save New Report
        </Button>
      </Box>
    </Box>
  );
};

export default NewReportPage;
