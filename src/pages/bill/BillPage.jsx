import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import {
  Grid,
  TextField,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Backdrop,
  Snackbar,
  Alert,
} from "@mui/material";

import PatientDetails from "./PatientDetails";
import ServiceCharges from "./ServiceCharges";
import ReceiptsTable from "./ReceiptsTable";
import DiscountSummary from "./DiscountSummary";

export default function BillPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [uhid, setUhid] = useState("");
  const [searchUhid, setSearchUhid] = useState("");
  const [patient, setPatient] = useState({});
  const [beds, setBeds] = useState({});
  const [rows, setRows] = useState([]);
  const [amount, setAmount] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const [discountType, setDiscountType] = useState("amount");
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

  const todayDate = new Date().toISOString().split("T")[0];

  // fetch patient data
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

      const initialRows = [
        {
          descriptionType: "service",
          description: "Pollution and prevention control",
          unit: 1,
          rate: 500,
          amount: 500,
        },
      ];

      setPatient(data.patient || {});
      setBeds(data.beds || {});
      setTransactions(data.transactions || []);
      setAmount(data.patient?.regAmount || 0);
      setRows(initialRows);
    } catch (error) {
      showToast("Error fetching patient data", "error");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on UHID input
  useEffect(() => {
    if (uhid.length === 8) fetchPatientData(uhid);
  }, [uhid]);

  // Check existing final bills on searchUhid
  useEffect(() => {
    if (searchUhid.length === 8) fetchFinalBills(searchUhid);
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
      navigate("/billList", { state: { billData: res.data } });
    } catch (error) {
      showToast("Error fetching final bill", "error");
    } finally {
      setLoading(false);
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

          {/* UHID Input */}
          <Grid container spacing={2} alignItems="center" mb={2}>
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

          {/* Components */}
          <PatientDetails patient={patient} beds={beds} todayDate={todayDate} />
          <ServiceCharges rows={rows} setRows={setRows} />
          <ReceiptsTable transactions={transactions} />
          <DiscountSummary
            rows={rows}
            discountType={discountType}
            setDiscountType={setDiscountType}
            discountValue={discountValue}
            setDiscountValue={setDiscountValue}
            transactions={transactions}
            amount={amount}
            patient={patient}
            beds={beds}
            todayDate={todayDate}
            navigate={navigate}
          />
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
