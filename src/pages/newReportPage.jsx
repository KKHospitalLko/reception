import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";

const NewReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const username = sessionStorage.getItem("username");
  // console.log("Username:", username);
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    name: "",
    gender: "",
    phone: "",
    age: "",
    empanelment: "",
    // bloodGroup: "",
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

  const doctorOptions = [
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

  const titles = ["Mr.", "Ms.", "Mrs.", "Baby"];
  const genders = ["Male", "Female", "Other"];
  const religions = ["Hindu", "Muslim", "Christian", "Other"];
  const maritalStatuses = ["Single", "Married"];

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`${backendUrl}/patient/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        });
        // console.log("Fetched patient data:", res);
        const p = res.data[0]; // taking first record
        setPatient(p);
        setFormData({
          ...formData,
          uhid: p.uhid,
          title: p.title,
          name: p.fullname,
          gender: p.sex,
          phone: p.mobile,
          age: p.age,
          // bloodGroup: p.bloodGroup,
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

  //   const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: typeof value === "string" ? value.split(",") : value,
  //   }));
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = {
        uhid: formData.uhid,
        title: formData.title,
        fullname: formData.name,
        sex: formData.gender,
        mobile: formData.phone,
        dateofreg: "",
        time: "",
        age: Number(formData.age) || 0,
        empanelment: formData.empanelment,
        // bloodGroup: formData.bloodGroup,
        religion: formData.religion,
        // intimationOrExtension: formData.empanelType,
        maritalStatus: formData.maritalStatus,
        fatherHusband: formData.fatherOrHusband,
        doctorIncharge: formData.doctorIncharge,
        regAmount: Number(formData.regAmount) || 0,
        localAddress: {
          address: formData.localAddress,
          city: formData.localCity,
          state: formData.localState,
          country: formData.localCountry,
          zip: formData.localZip,
        },
        permanentAddress: {
          address: formData.permanentAddress,
          city: formData.permanentCity,
          state: formData.permanentState,
          country: formData.permanentCountry,
          zip: formData.permanentZip,
        },
        registered_by: username,
      };

      console.log("Payload to be sent:", payload);
      await axios.put(`${backendUrl}/patient/${formData.uhid}`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
      });
      setLoading(false);
      navigate(`/patient/${formData.uhid}`);
    } catch (error) {
      setLoading(false);
      if (error.response && Array.isArray(error.response.data?.detail)) {
        // Show all validation messages if available
        const messages = error.response.data.detail
          .map((d) => d.msg)
          .join("\n");
        alert(messages);
      } else if (error.response?.data?.detail) {
        // Single validation message
        alert(error.response.data.detail);
      } else {
        console.error("Error submitting form:", error);
        alert("Something went wrong. Please try again.");
      }
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
      <Button
        variant="contained"
        onClick={() => navigate(-1)}
        sx={{
          mb: 2,
          backgroundColor: "#5fc1b2",
          "&:hover": { backgroundColor: "#4da99f" },
        }}
      >
        ← Back
      </Button>
      <Typography variant="h5" mb={2}>
        Create New Report for {patient.fullname}
      </Typography>

      <form onSubmit={handleSubmit}>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        <TextField
          select
          label="Title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          sx={{ flex: "1 1 20%" }}
        >
          {titles.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Full Name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          sx={{ flex: "1 1 20%" }}
        />
        <TextField
          label="Age"
          name="age"
          type="number"
          required
          value={formData.age}
          onChange={handleChange}
          sx={{ flex: "1 1 20%" }}
        />
        <TextField
          select
          label="Gender"
          name="gender"
          required
          value={formData.gender}
          onChange={handleChange}
          sx={{ flex: "1 1 20%" }}
        >
          {genders.map((g) => (
            <MenuItem key={g} value={g}>
              {g}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Row 2: Phone, Blood Group, Religion, Marital Status */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        <TextField
          label="Phone"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          sx={{ flex: "1 1 20%" }}
          fullWidth
        />
        {/* <TextField
          label="Blood Group"
          name="bloodGroup"
          required
          value={formData.bloodGroup}
          onChange={handleChange}
          sx={{ flex: "1 1 20%" }}
          fullWidth
        /> */}
        <TextField
          select
          label="Religion"
          name="religion"
          required
          value={formData.religion}
          onChange={handleChange}
          sx={{ flex: "1 1 20%" }}
          fullWidth
        >
          {religions.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Marital Status"
          name="maritalStatus"
          required
          value={formData.maritalStatus}
          onChange={handleChange}
          sx={{ flex: "1 1 20%" }}
          fullWidth
        >
          {maritalStatuses.map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Row 3: Empanelment, Amount */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <TextField
          select
          label="Empanelment"
          name="empanelment"
          required
          value={formData.empanelment}
          onChange={handleChange}
          sx={{ flex: "1 1 45%" }}
          fullWidth
        >
          {[
            "ECHS",
            "ESIC",
            "CGHS",
            "NR",
            "NER",
            "RDSO",
            "Rail Coach",
            "Insurance",
            "UP Police",
            "Ayushman Bharat",
            "DDU",
            "CMRF",
            "Private",
          ].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Registration Amount"
          name="regAmount"
          required
          value={formData.regAmount}
          onChange={handleChange}
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
        />
        <div />
      </Box>

      {/* Row 4: Father/Husband, Doctor */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <TextField
          label="Father / Husband"
          name="fatherOrHusband"
          required
          value={formData.fatherOrHusband}
          onChange={handleChange}
          sx={{ flex: "1 1 45%" }}
          fullWidth
        />
        <FormControl fullWidth required>
          <InputLabel>Consulting Doctor(s) Incharge</InputLabel>
          <Select
            multiple
            name="doctorIncharge"
            value={formData.doctorIncharge}
            onChange={handleChange}
            input={<OutlinedInput label="Consulting Doctor(s) Incharge" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {doctorOptions.map((doc) => (
              <MenuItem key={doc} value={doc}>
                {doc}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Local Address Section */}
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Local Address
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        <TextField
          label="Address"
          name="localAddress"
          required
          value={formData.localAddress}
          onChange={handleChange}
          sx={{ flex: "1 1 100%" }}
          fullWidth
        />
        <TextField
          label="City"
          name="localCity"
          required
          value={formData.localCity}
          onChange={handleChange}
          sx={{ flex: "1 1 20%" }}
          fullWidth
        />
        <TextField
          label="State"
          name="localState"
          required
          value={formData.localState}
          onChange={handleChange}
          sx={{ flex: "1 1 20%" }}
          fullWidth
        />
        <TextField
          label="Country"
          name="localCountry"
          required
          value={formData.localCountry}
          onChange={handleChange}
          sx={{ flex: "1 1 20%" }}
          fullWidth
        />
        <TextField
          label="ZIP"
          name="localZip"
          required
          value={formData.localZip}
          onChange={handleChange}
          sx={{ flex: "1 1 20%" }}
          fullWidth
        />
      </Box>

      {/* Permanent Address Section */}
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Permanent Address
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        <TextField
          label="Address"
          name="permanentAddress"
          required
          value={formData.permanentAddress}
          onChange={handleChange}
          sx={{ flex: "1 1 100%" }}
          fullWidth
        />
        <TextField
          label="City"
          name="permanentCity"
          required
          value={formData.permanentCity}
          onChange={handleChange}
          sx={{ flex: "1 1 20%" }}
          fullWidth
        />
        <TextField
          label="State"
          name="permanentState"
          required
          value={formData.permanentState}
          onChange={handleChange}
          sx={{ flex: "1 1 20%" }}
          fullWidth
        />
        <TextField
          label="Country"
          name="permanentCountry"
          required
          value={formData.permanentCountry}
          onChange={handleChange}
          sx={{ flex: "1 1 20%" }}
          fullWidth
        />
        <TextField
          label="ZIP"
          name="permanentZip"
          required
          value={formData.permanentZip}
          onChange={handleChange}
          sx={{ flex: "1 1 20%" }}
          fullWidth
        />

        <Button
        type="submit"
          variant="contained"
          // onClick={handleSubmit}
          sx={{
            mb: 2,
            backgroundColor: "#5fc1b2",
            "&:hover": { backgroundColor: "#4da99f" },
          }}
        >
          Save New Report
        </Button>
      </Box>
      </form>

    </Box>
  );
};

export default NewReportPage;
