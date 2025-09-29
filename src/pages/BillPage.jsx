import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import {
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Paper,
  Box,
  IconButton,
  FormControl,
  InputAdornment,
  CircularProgress,
  Backdrop,
  FormControlLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function BillPage() {
  const navigate = useNavigate();
  const [searchUhid, setSearchUhid] = useState("");
  const [discountType, setDiscountType] = useState("amount"); // "amount" | "percentage"
  const [discountValue, setDiscountValue] = useState("");

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleToastClose = (_, reason) => {
    if (reason === "clickaway") return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Tariff list for services
  const tariffList = [
    { description: "Emergency Ward", rate: 5000 },
    { description: "ICU Ward", rate: 6000 },
    { description: "HDU", rate: 4000 },
    { description: "Ventilator", rate: 12000 },
    { description: "Minor OT", rate: 3000 },
    { description: "Major OT", rate: 5000 },
    { description: "Oxygen (per hour)", rate: 300 },
    { description: "Suite Room, 106", rate: 6000 },
    { description: "Super Deluxe Room 105", rate: 5500 },
    { description: "Deluxe Room 102-104, 109-110, 217-219", rate: 5000 },
    { description: "Private Room 107-108, 205", rate: 4500 },
    {
      description: "Semi Private Room 111-113, 201-202, 211-216, 310-313, 324",
      rate: 3500,
    },
    { description: "General Ward", rate: 2500 },
    { description: "NICU - Bed Charge with Consultation", rate: 5000 },
    { description: "Oxygen (per day)", rate: 1000 },
    { description: "C-PAP", rate: 1000 },
    { description: "High Flow", rate: 1000 },
    { description: "Ventilator (NICU)", rate: 3000 },
    { description: "Registration fee", rate: 500 },
    { description: "Pollution and prevention control", rate: 500 },
  ];

  // Doctor options list
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

  const [loading, setLoading] = useState(false);
  const [uhid, setUhid] = useState("");
  const [patient, setPatient] = useState({});
  const [beds, setBeds] = useState({});
  const [rows, setRows] = useState([]);
  const [amount, setAmount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  // const [discounts, setDiscounts] = useState({
  //   medication: 0,
  //   roomService: 0,
  //   consultancy: 0,
  // });
  // const todayDate = new Date().toLocaleDateString();
  const now = new Date();
  const todayDate = now.toISOString().split("T")[0];

  // Auto-fetch patient data when UHID reaches 8 digits
  useEffect(() => {
    if (uhid.length === 8) {
      setLoading(true);
      try {
        fetchPatientData(uhid);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response && Array.isArray(error.response.data?.detail)) {
          // Show all validation messages if available
          const messages = error.response.data.detail
            .map((d) => d.msg)
            .join("\n");
          showToast(messages, "error");
        } else if (error.response?.data?.detail) {
          // Single validation message
          showToast(error.response.data.detail);
        } else {
          showToast("Something went wrong. Please try again.", "error");
        }
      }
    }
  }, [uhid]);

  const fetchPatientData = async (uhidVal) => {
    setLoading(true);
    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL +
          `/patient/bed/transaction/${uhidVal}/forbill`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      );
      const data = res.data;
      console.log(data);
      const initialRows = [
        {
          descriptionType: "service",
          description: "Pollution and prevention control",
          unit: 1,
          rate: 500,
          amount: 500,
        },
      ];

      setAmount(data.patient.regAmount || 0);
      setTransactions(data.transactions || []);
      setPatient(data.patient || {});
      setBeds(data.beds || {});
      setRows(initialRows);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response && Array.isArray(error.response.data?.detail)) {
        // Show all validation messages if available
        const messages = error.response.data.detail
          .map((d) => d.msg)
          .join("\n");
        showToast(messages, "error");
      } else if (error.response?.data?.detail) {
        // Single validation message
        showToast(error.response.data.detail, "error");
      } else {
        console.error("Error submitting form:", error);
        showToast("Something went wrong. Please try again.", "error");
      }
    }
  };

  useEffect(() => {
    if (searchUhid.length === 8) {
      fetchFinalBills(searchUhid);
    }
  }, [searchUhid]);

  const fetchFinalBills = async (uhidVal) => {
    setLoading(true);
    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + `/final-bill/${uhidVal}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      );

      const data = res.data;
      // console.log("Fetched Final Bill Data:", data);
      setLoading(false);
      // Navigate to BillList and pass data
      navigate("/billList", { state: { billData: data } });
    } catch (error) {
      setLoading(false);
      if (error.response && Array.isArray(error.response.data?.detail)) {
        // Show all validation messages if available
        const messages = error.response.data.detail
          .map((d) => d.msg)
          .join("\n");
        showToast(messages, "error");
      } else if (error.response?.data?.detail) {
        // Single validation message
        showToast(error.response.data.detail, "error");
      } else {
        console.error("Error submitting form:", error);
        showToast("Something went wrong. Please try again.", "error");
      }
    }
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        description: "",
        descriptionType: "",
        unit: 1,
        rate: "",
        amount: "",
      },
    ]);
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    // Auto-calculate amount based on unit and rate
    if (field === "unit" || field === "rate") {
      const unit = field === "unit" ? value : updated[index].unit;
      const rate = field === "rate" ? value : updated[index].rate;

      if (unit && rate) {
        updated[index].amount = (parseFloat(unit) * parseFloat(rate)).toFixed(
          2
        );
      }
    }

    // Auto-fill rate when selecting a service
    if (
      field === "description" &&
      updated[index].descriptionType === "service"
    ) {
      const selectedService = tariffList.find(
        (item) => item.description === value
      );
      if (selectedService && selectedService.rate) {
        updated[index].rate = selectedService.rate;
        if (updated[index].unit) {
          updated[index].amount = (
            parseFloat(updated[index].unit) * parseFloat(selectedService.rate)
          ).toFixed(2);
        }
      }
    }

    // Set fixed rate for doctors
    if (
      field === "description" &&
      updated[index].descriptionType === "doctor"
    ) {
      updated[index].rate = 1000; // Fixed rate for doctors
      if (updated[index].unit) {
        updated[index].amount = (
          parseFloat(updated[index].unit) * 1000
        ).toFixed(2);
      }
    }

    // Set description type
    if (field === "descriptionType") {
      updated[index].description = ""; // Reset description when changing type
      updated[index].rate = ""; // Reset rate
      updated[index].amount = ""; // Reset amount
    }

    setRows(updated);
  };

  const handleRemoveRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  const handleDiscountChange = (field, value) => {
    setDiscounts({
      ...discounts,
      [field]: value,
    });
  };

  const formatTimeTo12Hour = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    const hh = hours % 12 || 12;
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    return `${hh}:${mm}:${ss} ${ampm}`;
  };

  const formattedTime = formatTimeTo12Hour(now);

  // discountValue is string from input, discountType is "amount" | "percentage"
  const calculateBill = ({
    rows,
    discountValue,
    discountType,
    transactions,
  }) => {
    const totalCharges = rows.reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0
    );

    const numericDiscount = parseFloat(discountValue) || 0;

    let totalDiscount = 0;
    if (discountType === "percentage") {
      totalDiscount = (totalCharges * numericDiscount) / 100;
    } else {
      totalDiscount = numericDiscount;
    }

    const netAmount = totalCharges - totalDiscount;

    const regAmountPaid = Number(amount || 0);

    const totalPaid =
      transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0) +
      regAmountPaid;

    const balance = netAmount - totalPaid;

    return {
      totalCharges,
      numericDiscount,
      totalDiscount,
      netAmount,
      totalPaid,
      balance,
    };
  };

  const {
    totalCharges,
    numericDiscount,
    totalDiscount,
    netAmount,
    totalPaid,
    balance,
  } = calculateBill({ rows, discountValue, discountType, transactions });

  const handleGenerateBill = async () => {
    setLoading(true);
    try {
      // const totalCharges = rows.reduce(
      //   (sum, r) => sum + Number(r.amount || 0),
      //   0
      // );
      // const totalDiscount =
      //   discounts.medication + discounts.roomService + discounts.consultancy;
      // const netAmount = totalCharges - totalDiscount;
      // const totalPaid = transactions.reduce(
      //   (sum, t) => sum + Number(t.amount || 0),
      //   0
      // );
      // const balance = netAmount - totalPaid;

      // Build request payload
      const payload = {
        final_bill_no: patient.uhid + patient.regno,
        patient_uhid: patient.uhid || "",
        patient_regno: patient.regno || "",
        patient_name: patient.fullname || "",
        patient_type: patient.patient_type || "",
        age: patient.age?.toString() || "",
        gender: patient.sex || "",
        admission_date: patient.dateofreg || "",
        admission_time: patient.time || "",
        discharge_date:
          patient.patient_type === "OPD" ||
          patient.empanelment?.toLowerCase().includes("cashless")
            ? ""
            : todayDate,

        discharge_time:
          patient.patient_type === "OPD" ||
          patient.empanelment?.toLowerCase().includes("cashless")
            ? ""
            : formattedTime,

        empanelment: patient.empanelment || "",
        consultant_doctor: (patient.doctorIncharge || []).join(", "),
        room_type: beds.department || "",
        bed_no: beds.bed_number || "",
        created_by: sessionStorage.getItem("username") || "Unknown",
        reg_amount: patient.regAmount || 0,
        charges_summary: rows.map((r, idx) => ({
          particulars: r.description,
          quantity: Number(r.unit),
          rate: Number(r.rate),
          amount: Number(r.amount),
        })),

        transaction_breakdown: transactions.map((t) => ({
          transaction_no: t.transaction_no,
          date: t.transaction_date,
          amount: Number(t.amount),
        })),

        // total_charges: totalCharges,
        total_discount: {
          discount_type: discountType,
          discount_percent: numericDiscount,
          discount_rupee: totalDiscount,
        },
        net_amount: netAmount,
        total_paid: totalPaid,
        total_charges: totalCharges,
        balance: balance,
      };

      console.log("Final Bill Payload:", payload);

      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/final-bill",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      );

      console.log("response", res.data);
      navigate("/billList", { state: { billData: [res.data] } });

      showToast("Final bill generated successfully!", "success");

      // Clear form after successful submission
      setUhid("");
      setPatient({});
      setBeds({});
      setRows([]);
      setTransactions([]);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response && Array.isArray(error.response.data?.detail)) {
        // Show all validation messages if available
        const messages = error.response.data.detail
          .map((d) => d.msg)
          .join("\n");
        showToast(messages, "error");
      } else if (error.response?.data?.detail) {
        // Single validation message
        showToast(error.response.data.detail, "error");
      } else {
        showToast("Something went wrong. Please try again.", "error");
      }
    }
  };

  return (
    <>
      <Navbar />

      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          className="bg-[#5fc1b2] text-white p-3 rounded-lg shadow-md"
        >
          Final Bill Generation
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Backdrop open={loading} sx={{ color: "#fff", zIndex: 9999 }}>
            <CircularProgress color="inherit" />
          </Backdrop>

          <Grid
            container
            spacing={2}
            alignItems="center"
            mb={2}
            justifyContent="space-between"
          >
            <Grid item xs={3}>
              <TextField
                label="UHID"
                value={uhid}
                onChange={(e) => setUhid(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Search UHID"
                value={searchUhid}
                onChange={(e) => setSearchUhid(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>

          {/* Patient Info Section - Reorganized into two columns */}
          <Typography variant="h6" gutterBottom>
            Patient Details
          </Typography>
          <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {/* Field Component */}
              {[
                {
                  label: "UHID / Registration No:",
                  value: `${patient.uhid} / ${patient.regno}`,
                },
                { label: "Patient Type: ", value: patient.patient_type },
                { label: "Patient Name: ", value: patient.fullname },
                {
                  label: "Age / Sex: ",
                  value: `${patient.age} / ${patient.sex}`,
                },
                ...(patient.patient_type === "IPD"
                  ? [
                      { label: "Department: ", value: beds.department },
                      { label: "Bed No: ", value: beds.bed_number },
                    ]
                  : []),
                { label: "Date of Admission: ", value: patient.dateofreg },
                { label: "Time of Admission: ", value: patient.time },
                { label: "Empanelment: ", value: patient.empanelment },
                {
                  label: "Registration Amount: ",
                  value: "Rs." + patient.regAmount + " (Paid)",
                },
                { label: "Date: ", value: todayDate },
                {
                  label: "Doctor Incharge: ",
                  value: patient.doctorIncharge?.join(", "),
                },
                {
                  label: "Father / Husband Name: ",
                  value: patient.fatherHusband,
                },
              ].map((field, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    width: { xs: "100%", sm: "48%" },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", minWidth: 150 }}
                  >
                    {field.label} &nbsp;
                  </Typography>
                  <Typography variant="body2">{field.value}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Service Charges Section - Updated with new columns */}
          <Typography variant="h6" gutterBottom mt={3}>
            Services / Charges
          </Typography>
          <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleAddRow}
              sx={{
                mb: 2,
                backgroundColor: "#5fc1b2",
                "&:hover": { backgroundColor: "#4da99f" },
              }}
            >
              Add Row
            </Button>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="5%">Sr. No.</TableCell>
                <TableCell width="10%">Type</TableCell>
                <TableCell width="35%">Description</TableCell>
                <TableCell width="10%">Unit</TableCell>
                <TableCell width="15%">Rate</TableCell>
                <TableCell width="15%">Amount</TableCell>
                <TableCell width="10%">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        value={row.descriptionType}
                        onChange={(e) =>
                          handleRowChange(i, "descriptionType", e.target.value)
                        }
                        displayEmpty
                      >
                        <MenuItem value="">Select Type</MenuItem>
                        <MenuItem value="service">Service</MenuItem>
                        <MenuItem value="doctor">Doctor</MenuItem>
                        <MenuItem value="other services">
                          Other Service
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    {row.descriptionType === "other services" ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={row.description}
                        placeholder="Enter service description"
                        onChange={(e) =>
                          handleRowChange(i, "description", e.target.value)
                        }
                      />
                    ) : (
                      <FormControl fullWidth size="small">
                        <Select
                          value={row.description}
                          onChange={(e) =>
                            handleRowChange(i, "description", e.target.value)
                          }
                          displayEmpty
                          disabled={!row.descriptionType}
                        >
                          <MenuItem value="">
                            Select{" "}
                            {row.descriptionType === "service"
                              ? "Service"
                              : row.descriptionType === "doctor"
                              ? "Doctor"
                              : ""}
                          </MenuItem>
                          {row.descriptionType === "service" &&
                            tariffList.map((item) => (
                              <MenuItem
                                key={item.description}
                                value={item.description}
                              >
                                {item.description}
                              </MenuItem>
                            ))}
                          {row.descriptionType === "doctor" &&
                            doctorOptions.map((doctor) => (
                              <MenuItem key={doctor} value={doctor}>
                                {doctor}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.unit}
                      onChange={(e) =>
                        handleRowChange(i, "unit", e.target.value)
                      }
                      fullWidth
                      size="small"
                      InputProps={{ inputProps: { min: 1 } }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.rate}
                      onChange={(e) =>
                        handleRowChange(i, "rate", e.target.value)
                      }
                      fullWidth
                      size="small"
                      disabled={row.descriptionType === "doctor"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={row.amount}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      fullWidth
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveRow(i)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Receipts Table */}
          <Typography variant="h6" gutterBottom mt={3}>
            Receipts
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Receipt No</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((t, i) => (
                <TableRow key={i}>
                  <TableCell>{t.transaction_no}</TableCell>
                  <TableCell>{t.transaction_date}</TableCell>
                  <TableCell align="right">
                    ₹
                    {Number(t.amount).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Discounts Section */}
          <Typography variant="h6" gutterBottom mt={3}>
            Discount
          </Typography>

          {/* Radio Button to choose type */}
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <RadioGroup
              row
              value={discountType}
              onChange={(e) => {
                setDiscountType(e.target.value);
                setDiscountValue(0); // reset value when switching type
              }}
            >
              <FormControlLabel
                value="amount"
                control={<Radio />}
                label="Amount (₹)"
              />
              <FormControlLabel
                value="percentage"
                control={<Radio />}
                label="Percentage (%)"
              />
            </RadioGroup>
          </FormControl>

          {/* Single Input Field */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4} width={{ xs: "100%", md: "33.33%" }}>
              <TextField
                label="Discount"
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(parseFloat(e.target.value))}
                sx={{ width: "70%" }}
                inputProps={
                  discountType === "percentage"
                    ? { min: 0, max: 100 }
                    : { min: 0 }
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {discountType === "percentage" ? "%" : "₹"}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {/* Summary Table */}
          <Typography variant="h6" gutterBottom mt={3}>
            Summary
          </Typography>
          {(() => {
            const totalCharges = rows.reduce(
              (sum, r) => sum + Number(r.amount || 0),
              0
            );

            // calculate discount based on type
            let totalDiscounts = 0;
            const numericDiscount = parseFloat(discountValue) || 0;
            if (discountType === "percentage") {
              totalDiscounts = (totalCharges * numericDiscount) / 100;
            } else {
              totalDiscounts = numericDiscount;
            }

            const netAmount = totalCharges - totalDiscounts;

            const transactionsTotal = transactions.reduce(
              (sum, t) => sum + Number(t.amount || 0),
              0
            );

            const regAmountPaid = Number(amount || 0);
            const totalPaid = transactionsTotal + regAmountPaid;

            const balance = netAmount - totalPaid;

            return (
              <Table sx={{ "& td": { padding: "12px 16px" } }}>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <b>Total Charges</b>
                    </TableCell>
                    <TableCell align="right">
                      ₹
                      {totalCharges.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Total Discounts</b>
                    </TableCell>
                    <TableCell align="right">
                      ₹
                      {totalDiscounts.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Net Amount</b>
                    </TableCell>
                    <TableCell align="right">
                      ₹
                      {netAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Total Paid</b>
                    </TableCell>
                    <TableCell align="right">
                      ₹
                      {totalPaid.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Balance</b>
                    </TableCell>
                    <TableCell align="right">
                      ₹
                      {balance.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            );
          })()}

          {/* Action Buttons */}
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleGenerateBill}
              sx={{
                mb: 2,
                backgroundColor: "#5fc1b2",
                "&:hover": { backgroundColor: "#4da99f" },
              }}
            >
              Generate Bill
            </Button>
          </Box>
        </Paper>

        {/* Toast Notification */}
        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={handleToastClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleToastClose}
            severity={toast.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
