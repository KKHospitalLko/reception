import { useState } from 'react';
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
import Navbar from "../components/Navbar";
import { generateReceiptPDF } from "../utils/generateReceiptPDF.js";
import axios from "axios";

const ReceiptPreview = () => {
  // Initialize currentReceipt with data from useLocation
  const { state: initialReceipt } = useLocation();
  const navigate = useNavigate();

  // Use useState to manage the current receipt data so it can be updated dynamically
  const [currentReceipt, setCurrentReceipt] = useState(initialReceipt);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const username = sessionStorage.getItem("username");

  // Display a message if no receipt data is available
  if (!currentReceipt) {
    return (
      <>
        <Navbar />
        <Typography textAlign="center" mt={5}>
          No receipt data available.
        </Typography>
      </>
    );
  }

  // Opens the confirmation dialog for cancellation
  const handleCancel = () => {
    setConfirmOpen(true);
  };

  // Handles the actual cancellation process after confirmation
  const handleCancelConfirm = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Make the API call to cancel the transaction
      const response = await axios.put(
        `${backendUrl}/transactions/cancel/${currentReceipt.transaction_no}`,
        { cancelled_by: username }, // Pass the username for 'cancelled_by'
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      );

      // console.log("Cancel response:", response.data);
      setSuccess(`Receipt ${currentReceipt.transaction_no} has been cancelled successfully`);

      // Update the local state of the receipt to reflect the cancelled status
      // and the 'cancelled_by' user immediately
      setCurrentReceipt({
        ...currentReceipt,
        status: response.data?.status || "CANCELLED", // Use status from response, fallback to "CANCELLED"
        cancelled_by: username, // Set the user who cancelled the receipt
      });
      setConfirmOpen(false); // Close the confirmation dialog
    } catch (err) {
      console.error("Error cancelling receipt:", err);
      setError(err.response?.data?.detail || "Failed to cancel receipt");
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Handles printing/downloading the receipt PDF
  const handlePrint = () => {
    generateReceiptPDF(currentReceipt, true);
  };

  // Navigates back to the previous page
  const handleBack = () => {
    navigate(-1);
  };

  // Destructure receipt properties for easier access
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
    cancelled_by, // Destructure cancelled_by here as well
  } = currentReceipt;

  // Determine if the receipt is cancelled for conditional rendering and styling
  const isCancelled = status === "CANCELLED" || status === "cancelled";

  return (
    <>
      <Navbar />
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
            backgroundColor: isCancelled ? "#ffe5e5" : "#fff", // Light pink for cancelled receipts
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
                  ₹{Number(amount).toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })}
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
                  {isCancelled ? `Cancelled by ${cancelled_by || "N/A"}` : "Active"}
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
                <Button variant="contained" color="error" onClick={handleCancel}>
                  Cancel Receipt
                </Button>
              )}
            </Box>

            {/* Confirmation Dialog for Cancellation */}
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
    </>
  );
};

export default ReceiptPreview;