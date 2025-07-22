import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import.meta.env.VITE_BACKEND_URL;
import InputAdornment from "@mui/material/InputAdornment";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  OutlinedInput,
  Chip,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import axios from "axios";

const RegistrationForm = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [searchId, setSearchId] = useState("");
  const location = useLocation();

  const username = localStorage.getItem("username");

  const navigate = useNavigate();

  const handleUHIDSearch = () => {
    if (!searchId) {
      alert("Enter patient ID or number");
      return;
    }
    // navigate to patient details page
    navigate(`/patient/${searchId}`);
  };

  // const [patientData, setPatientData] = useState(null);

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

  // example generated fields
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    gender: "",
    phone: "",
    // date: new Date().toLocaleDateString(),
    // time: new Date().toLocaleTimeString(),
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
    // refDoctor: "",
    // telephone: "",
    // purpose: "",
    // notes: "",
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

  const handleSubmit = async () => {
    try {
      const payload = {
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
        // intimationOrExtension: formData.empanelType,
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
        registered_by: username,
      };

      console.log("Payload to be sent:", payload);
      const response = await axios.post(backendUrl + "/patient", payload, {
      headers: {
        "x-api-key": import.meta.env.VITE_API_KEY,
        
      },
    });
      const savedPatient = response.data;

      alert(
        `Patient saved successfully!\n\n` +
          `UHID: ${savedPatient.uhid}\n` +
          `Name: ${savedPatient.fullname}\n` +
          `Reg No: ${savedPatient.regno}\n` +
          `Mobile: ${savedPatient.mobile}`
      );

      console.log("Response from server:", response.data);
    } catch (error) {
      if (error.response.status === 400) {
        alert(error.response.data.detail || "Failed to save patient data");
      } else {
        console.error("Error submitting form:", error);
        alert("Something went wrong!");
      }
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

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

      <Box display="flex" justifyContent="space-between"  gap={20} mt={2} p={1}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoHome}
        startIcon={<HomeIcon />}
      >
        Home
      </Button>
      <h2>Welcome, <strong>{username}</strong></h2>
      </Box>
      <Box display="flex" justifyContent="end" mr={2}>
        <Box display="flex" gap={2} mt={2}>
          <TextField
            label="Patient ID or Number"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleUHIDSearch}
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

      <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Row 1 */}
        {/* <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
          <TextField label="UHID" value={formData.uhid} disabled fullWidth />
          <TextField
            label="Reg No."
            value={formData.regNo}
            disabled
            fullWidth
          />
          <TextField label="Date" value={formData.date} disabled fullWidth />
          <TextField label="Time" value={formData.time} disabled fullWidth />
        </Box> */}

        {/* Row 2 */}
        <Box
          display="grid"
          gridTemplateColumns="0.4fr 1.6fr 1fr 1fr"
          gap={2}
          mt={2}
        >
          <FormControl fullWidth>
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
          />

          <TextField
            label="Age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            fullWidth
          />

          <FormControl fullWidth>
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

        {/* Row 3 */}
        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2} mt={2}>
          <TextField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth>
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
          <FormControl fullWidth>
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
          <FormControl fullWidth>
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

        {/* Row 4 */}
        <Box
          display="grid"
          gridTemplateColumns="1fr 1fr 1fr 1fr"
          gap={2}
          mt={2}
        >
          <FormControl fullWidth>
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
            value={formData.regAmount}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
          />
          <div />
        </Box>

        {/* Row 5 */}
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} mt={2}>
          <TextField
            label="Father's / Husband's Name"
            name="fatherOrHusband"
            value={formData.fatherOrHusband}
            onChange={handleChange}
            fullWidth
          />

          <FormControl fullWidth>
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

        {/* Row 6 */}
        {/* <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2} mt={2}>
          <TextField
            label="Reference Doctor Name"
            name="refDoctor"
            value={formData.refDoctor}
            onChange={handleChange}
            fullWidth
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            label="Telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Registration Amount"
            name="regAmount"
            value={formData.regAmount}
            onChange={handleChange}
            fullWidth
          />
        </Box> */}

        {/* Row 7 */}
        {/* <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} mt={2}>
          <TextField
            label="Purpose of Visit"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            fullWidth
          />
        </Box> */}

        {/* <div className="h-0.5 bg-[#5fc1b2] mt-5"></div> */}

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
        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2} mt={2}>
          {/* Address takes full width by spanning all 4 columns */}
          <TextField
            label="Address"
            name="localAddress"
            value={formData.localAddress}
            onChange={handleChange}
            fullWidth
            sx={{ gridColumn: "span 4" }}
          />

          {/* City 1/4 */}
          <TextField
            label="City"
            name="localCity"
            value={formData.localCity}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="State"
            name="localState"
            value={formData.localState}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Country"
            name="localCountry"
            value={formData.localCountry}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="ZIP"
            name="localZip"
            value={formData.localZip}
            onChange={handleChange}
            fullWidth
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

        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2} mt={2}>
          {/* Address takes full width */}
          <TextField
            label="Address"
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleChange}
            fullWidth
            sx={{ gridColumn: "span 4" }}
          />

          {/* City 1/4 */}
          <TextField
            label="City"
            name="permanentCity"
            value={formData.permanentCity}
            onChange={handleChange}
            fullWidth
          />

          {/* ZIP 1/4 */}

          <TextField
            label="State"
            name="permanentState"
            value={formData.permanentState}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Country"
            name="permanentCountry"
            value={formData.permanentCountry}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="ZIP"
            name="permanentZip"
            value={formData.permanentZip}
            onChange={handleChange}
            fullWidth
          />

          <div />
          <div />
        </Box>

        {/* Submit */}
        <Button
          variant="contained"
          onClick={handleSubmit}
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
    </div>
  );
};

export default RegistrationForm;
