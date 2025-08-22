// PaymentForm.js
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import axios from "axios";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Autocomplete,
  Backdrop,
  CircularProgress,
  InputAdornment,
  Typography,

} from "@mui/material";
import { generateTransactionId } from "../utils/generateTransactionId";

const PaymentForm = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [uhidSearch, setUhidSearch] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const username = sessionStorage.getItem("username");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    transactionId: "",
    uhid: "",
    registrationNumber: "",
    date: "",
    patientName: "",
    amount: "",
    modeOfPayment: "",
    bankName: "",
    chequeNumber: "",
    chequeDate: "",
    purpose: "",
  });

  const bankOptions = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Kotak Mahindra Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "IndusInd Bank",
  ];

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

  const now = new Date();
  const formattedTime = formatTimeTo12Hour(now);

  const [previewOpen, setPreviewOpen] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (form.uhid.length === 8 && /^\d{8}$/.test(form.uhid)) {
        setLoading(true);
        try {
          const response = await axios.get(
            backendUrl + `/transactions/patient/${form.uhid}`,
            {
              headers: {
                "Content-Type": "application/json",
                "x-api-key": import.meta.env.VITE_API_KEY,
              },
            }
          );
          const data = response.data;

          // console.log("Patient Data:", data);

          // Update form fields with API response
          setForm((prev) => ({
            ...prev,
            patientName: data.fullname || "",
            date: data.dateofreg || "",
            registrationNumber: data.regno || "",
          }));
          setLoading(false);
        } catch (error) {
          console.error("Error fetching patient data:", error);
          setLoading(false);
        }
      }
    };

    fetchPatientData();
  }, [form.uhid]);

  useEffect(() => {
    const transactionId = generateTransactionId();
    setForm((prev) => ({ ...prev, transactionId }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error for this field when user makes a change
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    // Check required fields
    if (!form.uhid) newErrors.uhid = "UHID is required";
    if (!form.registrationNumber)
      newErrors.registrationNumber = "Registration Number is required";
    if (!form.patientName) newErrors.patientName = "Patient Name is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.amount) newErrors.amount = "Amount is required";
    if (!form.purpose) newErrors.purpose = "Purpose is required";
    if (!form.modeOfPayment)
      newErrors.modeOfPayment = "Mode of Payment is required";

    // Check cheque-specific fields if payment mode is CHEQUE
    if (form.modeOfPayment === "CHEQUE") {
      if (!form.bankName) newErrors.bankName = "Bank Name is required";
      if (!form.chequeNumber)
        newErrors.chequeNumber = "Cheque Number is required";
      if (!form.chequeDate) newErrors.chequeDate = "Cheque Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    // Validate form before proceeding
    if (!validateForm()) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    const payload = {
      patient_uhid: form.uhid,
      patient_regno: form.registrationNumber,
      patient_name: form.patientName,
      admission_date: form.date,
      transaction_purpose: form.purpose,
      amount: form.amount ? parseFloat(form.amount).toFixed(2) : null,
      payment_mode: form.modeOfPayment,
      payment_details:
        form.modeOfPayment === "CHEQUE"
          ? {
              bank_name: form.bankName,
              cheque_number: form.chequeNumber,
              cheque_date: form.chequeDate,
            }
          : null,
      transaction_date: form.date, // assuming already in YYYY-MM-DD
      transaction_time: formattedTime,
      transaction_no: form.transactionId || generateTransactionId(),
      created_by: username, // Replace with dynamic user if needed
    };

    // console.log("Payload to save:", payload);
    try {
      const response = await axios.post(backendUrl + `/transactions`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
      });

      // console.log("Transaction saved:", response.data);
      navigate("/receipts/list", { state: [response.data] });
      // Optional: reset form or show success message
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
    } finally {
      setLoading(false);
    }
  };

  const handleUhidSearch = async () => {
    if (!uhidSearch.trim()) return;
    setLoading(true);

    try {
      setSearchLoading(true);
      const res = await axios.get(
        backendUrl + `/transactions/summary/${uhidSearch.trim()}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      );
      // console.log("Search results:", res.data);
      // if (res.data.length === 0) {
      //   alert("No receipts found for this UHID.");
      //   return;
      // }
      setReceipts(res.data); // adjust based on actual API shape
      setSearchLoading(false);
      navigate("/receipts/list", { state: res.data });
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

  return (
    <>
      <Navbar />
      <Box p={4} bgcolor="#fff" minHeight="100vh">
        <Typography
        variant="h4"
        gutterBottom
        align="center"
        className="bg-[#5fc1b2] text-white p-3 rounded-lg shadow-md"
      >
        Transaction Generation Form
      </Typography>
        <Backdrop open={loading} sx={{ color: "#fff", zIndex: 9999 }}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <Box
          display="flex"
          justifyContent="space-between"
          mb={3}
          flexWrap="wrap"
          gap={2}
        >
          <Button
            variant="contained"
            sx={{
              mb: 4,
              backgroundColor: "#5fc1b2",
              "&:hover": { backgroundColor: "#4da99f" },
            }}
            onClick={() => window.history.back()}
          >
            Back
          </Button>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="Search by UHID"
                value={uhidSearch}
                onChange={(e) => setUhidSearch(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleUhidSearch}
                sx={{
                  mb: 2,
                  backgroundColor: "#5fc1b2",
                  "&:hover": { backgroundColor: "#4da99f" },
                }}
              >
                Search
              </Button>
            </Box>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          {/* Row 1: Transaction ID, UHID, Registration Number, Date */}
          <Box display="flex" flexWrap="wrap" gap={2}>
            {[
              {
                label: "Transaction ID",
                name: "transactionId",
                disabled: true,
              },
              { label: "UHID", name: "uhid" },
              {
                label: "Registration Number",
                name: "registrationNumber",
                disabled: true,
              },
              { label: "Date", name: "date", type: "date", disabled: true },
            ].map((field, i) => (
              <TextField
                key={i}
                fullWidth
                sx={{ flex: "1 1 23%" }}
                label={field.label}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                disabled={field.disabled}
                type={field.type || "text"}
                InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                required={!field.disabled}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
              />
            ))}
          </Box>

          {/* Row 2: Patient Name, Amount */}
          <Box display="flex" flexWrap="wrap" gap={2}>
            <TextField
              fullWidth
              sx={{ flex: "1 1 45%" }}
              label="Patient Name"
              name="patientName"
              value={form.patientName}
              disabled={true}
              onChange={handleChange}
              type="text"
              required
              error={!!errors.patientName}
              helperText={errors.patientName}
            />
            <TextField
              fullWidth
              sx={{ flex: "1 1 45%" }}
              label="Amount"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              type="number"
              required
              error={!!errors.amount}
              helperText={errors.amount}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Row 3: Purpose of Transaction */}
          <Box display="flex">
            <TextField
              fullWidth
              label="Purpose of Transaction"
              name="purpose"
              value={form.purpose || ""}
              onChange={handleChange}
              required
              error={!!errors.purpose}
              helperText={errors.purpose}
            />
          </Box>

          {/* Row 4: Mode of Payment */}
          <Box display="flex" flexWrap="wrap" gap={2}>
            <TextField
              select
              fullWidth
              sx={{ flexBasis: "30%", flexGrow: 1 }}
              label="Mode of Payment"
              name="modeOfPayment"
              value={form.modeOfPayment}
              onChange={handleChange}
              required
              error={!!errors.modeOfPayment}
              helperText={errors.modeOfPayment}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="CASH">Cash</MenuItem>
              <MenuItem value="CARD">Credit Card / Debit Card</MenuItem>
              <MenuItem value="CHEQUE">Cheque</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="CASHLESS">Cashless</MenuItem>
            </TextField>
          </Box>

          {/* Row 5: Cheque-specific Fields */}
          {form.modeOfPayment === "CHEQUE" && (
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Box flexBasis="25%" flexGrow={1}>
                <Autocomplete
                  freeSolo
                  options={bankOptions}
                  value={form.bankName}
                  onChange={(e, value) => {
                    setForm((prev) => ({ ...prev, bankName: value }));
                    // Clear error for bank name when user makes a change
                    if (errors.bankName) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.bankName;
                        return newErrors;
                      });
                    }
                  }}
                  onInputChange={(e, value) => {
                    setForm((prev) => ({ ...prev, bankName: value }));
                    // Clear error for bank name when user makes a change
                    if (errors.bankName) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.bankName;
                        return newErrors;
                      });
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Bank Name"
                      fullWidth
                      required={form.modeOfPayment === "CHEQUE"}
                      error={!!errors.bankName}
                      helperText={errors.bankName}
                    />
                  )}
                />
              </Box>

              <Box flexBasis="30%" flexGrow={1}>
                <TextField
                  label="Cheque Number"
                  name="chequeNumber"
                  value={form.chequeNumber}
                  onChange={handleChange}
                  fullWidth
                  required={form.modeOfPayment === "CHEQUE"}
                  error={!!errors.chequeNumber}
                  helperText={errors.chequeNumber}
                />
              </Box>

              <Box flexBasis="30%" flexGrow={1}>
                <TextField
                  label="Date of Cheque"
                  name="chequeDate"
                  type="date"
                  value={form.chequeDate}
                  onChange={handleChange}
                  fullWidth
                  required={form.modeOfPayment === "CHEQUE"}
                  error={!!errors.chequeDate}
                  helperText={errors.chequeDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
          )}

          <Box mt={8}>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                sx={{
                  mb: 2,
                  backgroundColor: "#5fc1b2",
                  "&:hover": { backgroundColor: "#4da99f" },
                }}
                onClick={handleSave}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>

        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Receipt Preview</DialogTitle>
          <DialogContent>
            <iframe
              ref={iframeRef}
              width="100%"
              height="600px"
              title="PDF Preview"
            />
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default PaymentForm;
