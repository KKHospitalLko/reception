import { useState } from "react";
import { useNavigate } from "react-router-dom";
import.meta.env.VITE_BACKEND_URL;
import InputAdornment from "@mui/material/InputAdornment";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  OutlinedInput,
  Chip,
  Box,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import axios from "axios";

const RegistrationForm = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);

  const username = sessionStorage.getItem("username");

  const navigate = useNavigate();

  const handleUHIDSearch = (e) => {
    e.preventDefault();
    if (!searchId) {
      alert("Enter patient ID or number");
      return;
    }
    navigate(`/patient/${searchId}`);
  };

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

  const [formData, setFormData] = useState({
    title: "",
    name: "",
    gender: "",
    phone: "",
    age: "",
    empanelment: "other",
    empanelmentText: "",
    bloodGroup: "",
    religion: "",
    // empanelType: "",
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
    sameAsLocal: false,
  });

  // to auto fill permanent if checked
  const handleCheckbox = (e) => {
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      sameAsLocal: checked,
      permanentAddress: checked ? prev.localAddress : "",
      permanentCity: checked ? prev.localCity : "",
      permanentState: checked ? prev.localState : "",
      permanentCountry: checked ? prev.localCountry : "",
      permanentZip: checked ? prev.localZip : "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        fullname: formData.name,
        sex: formData.gender,
        mobile: formData.phone,
        dateofreg: "",
        time: "",
        age: Number(formData.age) || 0,
        empanelment: formData.empanelment,
        bloodGroup: formData.bloodGroup,
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
          zip: Number(formData.localZip) || 0,
        },
        permanentAddress: {
          address: formData.permanentAddress,
          city: formData.permanentCity,
          state: formData.permanentState,
          country: formData.permanentCountry,
          zip: Number(formData.permanentZip) || 0,
        },
        registered_by: username,
      };

      console.log("Payload to be sent:", payload);
      const response = await axios.post(backendUrl + "/patient", payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
      });
      const savedPatient = response.data;
      setLoading(false);
      // console.log("Response from server:", savedPatient.uhid);
      alert(
        `Patient saved successfully!\n\n` +
          `UHID: ${savedPatient.uhid}\n` +
          `Name: ${savedPatient.fullname}\n` +
          `Reg No: ${savedPatient.regno}\n` +
          `Mobile: ${savedPatient.mobile}`
      );
      navigate(`/patient/${savedPatient.uhid}`);

      // console.log("Response from server:", response.data);
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

  const handleGoHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <Backdrop open={loading} sx={{ color: "#fff", zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        className="bg-[#5fc1b2] text-white p-3 rounded-lg shadow-md"
      >
        Patient Registration Form
      </Typography>

      <Box display="flex" justifyContent="space-between" gap={20} mt={2} p={1}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoHome}
          startIcon={<HomeIcon />}
          sx={{
            mb: 2,
            backgroundColor: "#5fc1b2",
            "&:hover": { backgroundColor: "#4da99f" },
          }}
        >
          Home
        </Button>
        <h2>
          Welcome, <strong>{username}</strong>
        </h2>
      </Box>
      <Box display="flex" justifyContent="end" mr={2}>
        <Box
          component="form"
          onSubmit={handleUHIDSearch}
          display="flex"
          gap={2}
          mt={2}
        >
          <TextField
            label="Patient ID / Phone Number"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <Button
            type="submit" // ✅ Triggers on Enter key press
            variant="contained"
            sx={{
              backgroundColor: "#5fc1b2",
              "&:hover": {
                backgroundColor: "#4da99f",
              },
            }}
          >
            Search
          </Button>
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
          {/* Row 1 */}
          <Box
            display="grid"
            gridTemplateColumns="0.4fr 1.6fr 1fr 1fr"
            gap={2}
            mt={2}
          >
            <FormControl fullWidth required>
              <InputLabel>Title</InputLabel>
              <Select
                name="title"
                value={formData.title}
                label="Title"
                onChange={handleChange}
              >
                <MenuItem value="Mr.">Mr.</MenuItem>
                <MenuItem value="Ms.">Ms.</MenuItem>
                <MenuItem value="Mrs.">Mrs.</MenuItem>
                <MenuItem value="Baby">Baby</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              fullWidth
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                label="Gender"
                onChange={handleChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Row 2 */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(4, 1fr)"
            gap={2}
            mt={2}
          >
            <TextField
              label="Phone Number"
              name="phone"
              type="number"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Blood Group</InputLabel>
              <Select
                name="bloodGroup"
                value={formData.bloodGroup}
                label="Blood Group"
                onChange={handleChange}
              >
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A+">A-</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B+">B-</MenuItem>
                <MenuItem value="O+">O+</MenuItem>
                <MenuItem value="O+">O-</MenuItem>
                <MenuItem value="AB+">AB+</MenuItem>
                <MenuItem value="AB+">AB-</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Religion</InputLabel>
              <Select
                name="religion"
                value={formData.religion}
                label="Religion"
                onChange={handleChange}
              >
                <MenuItem value="Hindu">Hindu</MenuItem>
                <MenuItem value="Muslim">Muslim</MenuItem>
                <MenuItem value="Christian">Christian</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Marital Status</InputLabel>
              <Select
                name="maritalStatus"
                value={formData.maritalStatus}
                label="Marital Status"
                onChange={handleChange}
              >
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Married">Married</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Row 3 */}
          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr 1fr 1fr"
            gap={2}
            mt={2}
          >
            <FormControl fullWidth required>
              <InputLabel>Empanelment</InputLabel>
              <Select
                name="empanelment"
                value={formData.empanelment}
                label="Empanelment"
                onChange={(e) => {
                  handleChange(e);
                  setFormData((prev) => ({
                    ...prev,
                    empanelmentText: e.target.value,
                  }));
                }}
              >
                <MenuItem value="ECHS">ECHS</MenuItem>
                <MenuItem value="ESIC">ESIC</MenuItem>
                <MenuItem value="CGHS">CGHS</MenuItem>
                <MenuItem value="NR">NR</MenuItem>
                <MenuItem value="NER">NER</MenuItem>
                <MenuItem value="RDSO">RDSO</MenuItem>
                <MenuItem value="Rail Coach">Rail Coach</MenuItem>
                <MenuItem value="Insurance">Insurance</MenuItem>
                <MenuItem value="UP Police">UP Police</MenuItem>
                <MenuItem value="Ayushman Bharat">Ayushman Bharat</MenuItem>
                <MenuItem value="DDU">DDU</MenuItem>
                <MenuItem value="CMRF">CMRF</MenuItem>
                <MenuItem value="Private">Private</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Empanelment Detail"
              name="empanelmentText"
              value={formData.empanelmentText}
              onChange={handleChange}
              fullWidth
              required
            />

            {/* <FormControl component="fieldset">
            <RadioGroup
              row
              name="empanelType"
              value={formData.empanelType}
              onChange={handleChange}
            >
              <FormControlLabel
                value="intimation"
                control={<Radio />}
                label="Intimation"
              />
              <FormControlLabel
                value="extention"
                control={<Radio />}
                label="Extention"
              />
            </RadioGroup>
          </FormControl> */}

            <TextField
              label="Registration Amount"
              name="regAmount"
              type="number"
              value={formData.regAmount}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />
            <div />
          </Box>

          {/* Row 4 */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(2, 1fr)"
            gap={2}
            mt={2}
          >
            <TextField
              label="Father's / Husband's Name"
              name="fatherOrHusband"
              value={formData.fatherOrHusband}
              onChange={handleChange}
              fullWidth
              required
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

          {/* Address Sections */}
          <div className="flex justify-center w-full">
            <Typography
              variant="h6"
              marginTop={8}
              marginBottom={1}
              className="bg-[#5fc1b2] text-white p-1 rounded-lg shadow-md mt-2 text-center w-[20%]"
            >
              Address
            </Typography>
          </div>

          {/* Local address */}
          <Typography
            variant="subtitle1"
            sx={{ textDecoration: "underline", textUnderlineOffset: "2px" }}
          >
            Local Address
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns="repeat(4, 1fr)"
            gap={2}
            mt={2}
          >
            {/* Address takes full width by spanning all 4 columns */}
            <TextField
              label="Address"
              name="localAddress"
              value={formData.localAddress}
              onChange={handleChange}
              fullWidth
              required
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              label="City"
              name="localCity"
              value={formData.localCity}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="State"
              name="localState"
              value={formData.localState}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Country"
              name="localCountry"
              value={formData.localCountry}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="ZIP"
              name="localZip"
              type="number"
              value={formData.localZip}
              onChange={handleChange}
              fullWidth
              required
            />
            <div />
            <div />
          </Box>

          {/* Permanent address */}
          <Typography
            variant="subtitle1"
            marginTop={2}
            sx={{ textDecoration: "underline", textUnderlineOffset: "2px" }}
          >
            Permanent Address
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.sameAsLocal}
                onChange={handleCheckbox}
              />
            }
            label="Same as Local"
          />

          <Box
            display="grid"
            gridTemplateColumns="repeat(4, 1fr)"
            gap={2}
            mt={2}
          >
            <TextField
              label="Address"
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleChange}
              fullWidth
              required
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              label="City"
              name="permanentCity"
              value={formData.permanentCity}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="State"
              name="permanentState"
              value={formData.permanentState}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Country"
              name="permanentCountry"
              value={formData.permanentCountry}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="ZIP"
              name="permanentZip"
              type="number"
              value={formData.permanentZip}
              onChange={handleChange}
              fullWidth
              required
            />

            <div />
            <div />
          </Box>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            // onClick={handleSubmit}
            sx={{
              mt: 3,
              backgroundColor: "#5fc1b2",
              "&:hover": {
                backgroundColor: "#4da99f",
              },
            }}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
