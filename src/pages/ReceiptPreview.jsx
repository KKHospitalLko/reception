import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { generateReceiptPDF } from "../utils/generateReceiptPDF.js";
import axios from "axios";

const ReceiptPreview = () => {
  const { state: receipt } = useLocation();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentReceipt, setCurrentReceipt] = useState(receipt);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const username = sessionStorage.getItem("username");

  // console.log("ReceiptPreview state:", receipt);

  if (!currentReceipt) {
    return (
      <Typography textAlign="center" mt={5}>
        No receipt data available.
      </Typography>
    );
  }

  const handleCancel = () => {
    setConfirmOpen(true);
  };

  const handleCancelConfirm = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await axios.put(
        `${backendUrl}/transactions/cancel/${currentReceipt.transaction_no}`,
        { cancelled_by: username },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log("Cancel response:", response.data);
      setSuccess(`Receipt ${currentReceipt.transaction_no} has been cancelled successfully`);
      
      // Update the receipt status
      setCurrentReceipt({ ...currentReceipt, status: "CANCELLED" });
      setConfirmOpen(false);
    } catch (err) {
      console.error("Error cancelling receipt:", err);
      setError(err.response?.data?.detail || "Failed to cancel receipt");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    generateReceiptPDF(currentReceipt, true);
  };
  
  const handleBack = () => {
    navigate(-1);
  };

  const {
    patient_uhid,
    patient_regno,
    patient_name,
    admission_date,
    transaction_purpose,
    amount,
    payment_mode,
    payment_details,
    transaction_date,
    transaction_time,
    transaction_no,
    created_by,
    status,
  } = currentReceipt;

  const isCancelled = status === "CANCELLED";

  return (
    <Box p={3} maxWidth="800px" mx="auto">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Button 
        variant="contained" 
        onClick={handleBack}
        sx={{
          mb: 3,
          backgroundColor: "#5fc1b2",
          "&:hover": { backgroundColor: "#4da99f" },
        }}
      >
        Back
      </Button>
      <Card
        elevation={3}
        sx={{
          mb: 4,
          backgroundColor: isCancelled ? "#ffe5e5" : "#fff",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            textAlign="center"
            fontWeight="bold"
          >
            Transaction Receipt
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box display="flex" flexWrap="wrap" gap={2}>
            <Box flex="1 1 30%">
              <Typography fontWeight="bold">UHID:</Typography>
              <Typography>{patient_uhid}</Typography>
            </Box>

            <Box flex="1 1 30%">
              <Typography fontWeight="bold">Registration No.:</Typography>
              <Typography>{patient_regno}</Typography>
            </Box>

            <Box flex="1 1 30%">
              <Typography fontWeight="bold">Patient Name:</Typography>
              <Typography>{patient_name}</Typography>
            </Box>

            <Box flex="1 1 30%">
              <Typography fontWeight="bold">Admission Date:</Typography>
              <Typography>{admission_date}</Typography>
            </Box>

            <Box flex="1 1 30%">
              <Typography fontWeight="bold">Purpose:</Typography>
              <Typography>{transaction_purpose}</Typography>
            </Box>

            <Box flex="1 1 30%">
              <Typography fontWeight="bold">Amount:</Typography>
              <Typography color="success.main" fontWeight="bold">
                ₹{amount}
              </Typography>
            </Box>

            <Box flex="1 1 30%">
              <Typography fontWeight="bold">Payment Mode:</Typography>
              <Typography>{payment_mode}</Typography>
            </Box>

            {payment_mode === "CHEQUE" && payment_details && (
              <>
                <Box flex="1 1 30%">
                  <Typography fontWeight="bold">Bank:</Typography>
                  <Typography>{payment_details.bank_name}</Typography>
                </Box>

                <Box flex="1 1 30%">
                  <Typography fontWeight="bold">Cheque No.:</Typography>
                  <Typography>{payment_details.cheque_number}</Typography>
                </Box>

                <Box flex="1 1 30%">
                  <Typography fontWeight="bold">Cheque Date:</Typography>
                  <Typography>{payment_details.cheque_date}</Typography>
                </Box>
              </>
            )}

            <Box flex="1 1 30%">
              <Typography fontWeight="bold">Transaction Date:</Typography>
              <Typography>{transaction_date}</Typography>
            </Box>

            <Box flex="1 1 30%">
              <Typography fontWeight="bold">Transaction Time:</Typography>
              <Typography>{transaction_time}</Typography>
            </Box>

            <Box flex="1 1 30%">
              <Typography fontWeight="bold">Transaction No.:</Typography>
              <Typography>{transaction_no}</Typography>
            </Box>

            <Box flex="1 1 30%">
              <Typography fontWeight="bold">Created By:</Typography>
              <Typography>{created_by}</Typography>
            </Box>

            <Box flex="1 1 30%">
              <Typography fontWeight="bold">Status:</Typography>
              <Typography color={isCancelled ? "error.main" : "success.main"}>
                {isCancelled ? "Cancelled" : "Active"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box textAlign="center" display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              onClick={handlePrint}
              sx={{
                backgroundColor: "#5fc1b2",
                "&:hover": { backgroundColor: "#4da99f" },
              }}
            >
              Print / Download PDF
            </Button>

            {!isCancelled && (
              <Button variant="outlined" color="error" onClick={handleCancel}>
                Cancel Receipt
              </Button>
            )}
          </Box>
          
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Confirm Cancellation</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to cancel receipt {transaction_no}?
                This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>No, Keep Receipt</Button>
              <Button 
                onClick={handleCancelConfirm} 
                color="error" 
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Yes, Cancel Receipt"}
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReceiptPreview;
