import React, { useState } from "react";
import { Box } from "@mui/material";
import {
  Grid,
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
} from "@mui/material";

const RegistrationForm = () => {
  // example generated fields
  const [formData, setFormData] = useState({
    uhid: "UHID12345",
    regNo: "REG2025001",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    title: "",
    name: "",
    age: "",
    gender: "",
    phone: "",
    bloodGroup: "",
    religion: "",
    maritalStatus: "",
    empanelment: "",
    empanelmentText: "",
    empanelType: "intimation",
    fatherOrHusband: "",
    doctorIncharge: "",
    refDoctor: "",
    telephone: "",
    regAmount: "",
    purpose: "",
    notes: "",
    localAddress: "",
    localCity: "",
    localZip: "",
    permanentAddress: "",
    permanentCity: "",
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
      permanentZip: checked ? prev.localZip : "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", formData);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Patient Registration Form
      </Typography>

      <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Row 1 */}
        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
          <TextField label="UHID" value={formData.uhid} disabled fullWidth />
          <TextField
            label="Reg No."
            value={formData.regNo}
            disabled
            fullWidth
          />
          <TextField label="Date" value={formData.date} disabled fullWidth />
          <TextField label="Time" value={formData.time} disabled fullWidth />
        </Box>

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
              <MenuItem value="Miss">Ms.</MenuItem>
              <MenuItem value="Mrs.">Mrs.</MenuItem>
              <MenuItem value="Mrs.">Baby</MenuItem>
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
              <MenuItem value="B+">B+</MenuItem>
              <MenuItem value="O+">O+</MenuItem>
              <MenuItem value="AB+">AB+</MenuItem>
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
          gridTemplateColumns="0.3fr 0.3fr 0.3fr"
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
              <MenuItem value="Govt">Govt</MenuItem>
              <MenuItem value="Private">Private</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Empanelment Detail"
            name="empanelmentText"
            value={formData.empanelmentText}
            onChange={handleChange}
            fullWidth
          />

          <FormControl component="fieldset">
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
          </FormControl>

          {/* empty slot to fill the fourth column */}
          <div />
        </Box>

        {/* Row 5 */}
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
          <TextField
            label="Father / Husband Name"
            name="fatherOrHusband"
            value={formData.fatherOrHusband}
            onChange={handleChange}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Doctor Incharge</InputLabel>
            <Select
              name="doctorIncharge"
              value={formData.doctorIncharge}
              label="Doctor Incharge"
              onChange={handleChange}
            >
              <MenuItem value="Dr. A">Dr. A</MenuItem>
              <MenuItem value="Dr. B">Dr. B</MenuItem>
              <MenuItem value="Dr. C">Dr. C</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Row 6 */}
        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2} mt={2}>
          {/* Reference Doctor Name takes 2 columns */}
          <TextField
            label="Reference Doctor Name"
            name="refDoctor"
            value={formData.refDoctor}
            onChange={handleChange}
            fullWidth
            sx={{ gridColumn: "span 2" }}
          />

          {/* Telephone takes 1 column */}
          <TextField
            label="Telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            fullWidth
          />

          {/* Reg Amount takes 1 column */}
          <TextField
            label="Reg Amount"
            name="regAmount"
            value={formData.regAmount}
            onChange={handleChange}
            fullWidth
          />
        </Box>

        {/* Row 7 */}
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} mt={2}>
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
        </Box>

        <div className="h-0.5 bg-gray-600 mt-5"></div>
        
        {/* Address Sections */}
        <Typography variant="h6" marginTop={2}>
          Address
        </Typography>

        {/* Local address */}
        <Typography variant="subtitle1">Local Address</Typography>
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

          {/* ZIP 1/4 */}
          <TextField
            label="ZIP"
            name="localZip"
            value={formData.localZip}
            onChange={handleChange}
            fullWidth
          />

          {/* 2 empty slots to balance the second row */}
          <div />
          <div />
        </Box>

        {/* Permanent address */}
        <Typography variant="subtitle1" marginTop={2}>
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
            label="ZIP"
            name="permanentZip"
            value={formData.permanentZip}
            onChange={handleChange}
            fullWidth
          />

          {/* 2 empty columns to fill row */}
          <div />
          <div />
        </Box>

        {/* Submit */}
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default RegistrationForm;
