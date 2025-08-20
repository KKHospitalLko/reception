import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  Button,
  List,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { generateReceiptPDF } from "../utils/generateReceiptPDF.js";
import axios from "axios";

const ReceiptsList = () => {
  const { state: initialReceipts } = useLocation();
  const navigate = useNavigate();

  // Use useState to manage the receipts data so it can be updated
  const [receipts, setReceipts] = useState(initialReceipts || []);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [groupedReceipts, setGroupedReceipts] = useState({});
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const username = sessionStorage.getItem("username");

  // This useEffect will now react to changes in the 'receipts' state
  useEffect(() => {
    if (receipts && receipts.length > 0) {
      const grouped = receipts.reduce((acc, receipt) => {
        const regNo = receipt.patient_regno;
        if (!acc[regNo]) {
          acc[regNo] = [];
        }
        acc[regNo].push(receipt);
        return acc;
      }, {});
      setGroupedReceipts(grouped);
    } else {
      setGroupedReceipts({});
    }
  }, [receipts]);

  if (!receipts || receipts.length === 0) {
    return (
      <>
        <Navbar />
        <Typography textAlign="center" mt={5}>
          No receipts data available.
        </Typography>
      </>
    );
  }

  const handlePrint = (receipt) => {
    generateReceiptPDF(receipt, true);
  };

  const handleCancelClick = (receipt) => {
    setSelectedReceipt(receipt);
    setConfirmOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedReceipt) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.put(
        `${backendUrl}/transactions/cancel/${selectedReceipt.transaction_no}`,
        { cancelled_by: username },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      );

      // console.log("Cancel response:", response.data);
      setSuccess(
        `Receipt ${selectedReceipt.transaction_no} has been cancelled successfully`
      );

      const cancelledStatus = response.data?.status || "cancelled";

      // Update the receipt status in the state directly
      setReceipts((prevReceipts) =>
        prevReceipts.map((receipt) => {
          if (receipt.transaction_no === selectedReceipt.transaction_no) {
            return { ...receipt, status: cancelledStatus, cancelled_by: username };
          }
          return receipt;
        })
      );

      // The useEffect will automatically re-group the updated receipts

      // Close the dialog
      setConfirmOpen(false);

    } catch (err) {
      console.error("Error cancelling receipt:", err);
      setError(err.response?.data?.detail || "Failed to cancel receipt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box p={3} maxWidth="800px" mx="auto">
        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          fontWeight="bold"
        >
          Receipts List
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            backgroundColor: "#5fc1b2",
            "&:hover": { backgroundColor: "#4da99f" },
          }}
        >
          Back
        </Button>

        {Object.keys(groupedReceipts).length > 0 ? (
          <Box>
            {Object.entries(groupedReceipts).map(([regNo, regReceipts]) => (
              <Accordion key={regNo} defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box
                    display="flex"
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography fontWeight="bold">
                      Registration No: {regNo}
                    </Typography>
                    <Typography>
                      Patient: {regReceipts[0]?.patient_name} (UHID:{" "}
                      {regReceipts[0]?.patient_uhid})
                    </Typography>
                    <Typography>{regReceipts.length} Receipt(s)</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List sx={{ width: "100%", p: 0 }}>
                    {regReceipts.map((receipt, index) => {
                      const isCancelled = receipt.status === "CANCELLED" || receipt.status === "cancelled";

                      return (
                        <Card
                          key={index}
                          elevation={2}
                          sx={{
                            mb: 2,
                            backgroundColor: isCancelled ? "#ffe5e5" : "#fff",
                          }}
                        >
                          <CardContent>
                            <Box display="flex" flexWrap="wrap" gap={2}>
                              <Box flex="1 1 30%">
                                <Typography fontWeight="bold">
                                  Transaction No:
                                </Typography>
                                <Typography>
                                  {receipt.transaction_no}
                                </Typography>
                              </Box>

                              <Box flex="1 1 30%">
                                <Typography fontWeight="bold">
                                  Purpose:
                                </Typography>
                                <Typography>
                                  {receipt.transaction_purpose}
                                </Typography>
                              </Box>

                              <Box flex="1 1 30%">
                                <Typography fontWeight="bold">Date:</Typography>
                                <Typography>
                                  {receipt.transaction_date}
                                </Typography>
                              </Box>

                              <Box flex="1 1 30%">
                                <Typography fontWeight="bold">Time:</Typography>
                                <Typography>
                                  {receipt.transaction_time}
                                </Typography>
                              </Box>

                              <Box flex="1 1 30%">
                                <Typography fontWeight="bold">
                                  Amount:
                                </Typography>
                                <Typography
                                  color="success.main"
                                  fontWeight="bold"
                                >
                                  ₹
                                  {Number(receipt.amount).toLocaleString(
                                    "en-IN",
                                    {
                                      maximumFractionDigits: 2,
                                      minimumFractionDigits: 2,
                                    }
                                  )}
                                </Typography>
                              </Box>

                              <Box flex="1 1 30%">
                                <Typography fontWeight="bold">
                                  Payment Mode:
                                </Typography>
                                <Typography>{receipt.payment_mode}</Typography>
                              </Box>

                              {receipt.payment_mode === "CHEQUE" &&
                                receipt.payment_details && (
                                  <>
                                    <Box flex="1 1 30%">
                                      <Typography fontWeight="bold">
                                        Bank:
                                      </Typography>
                                      <Typography>
                                        {receipt.payment_details.bank_name}
                                      </Typography>
                                    </Box>
                                    <Box flex="1 1 30%">
                                      <Typography fontWeight="bold">
                                        Cheque No:
                                      </Typography>
                                      <Typography>
                                        {receipt.payment_details.cheque_number}
                                      </Typography>
                                    </Box>
                                    <Box flex="1 1 30%">
                                      <Typography fontWeight="bold">
                                        Cheque Date:
                                      </Typography>
                                      <Typography>
                                        {receipt.payment_details.cheque_date}
                                      </Typography>
                                    </Box>
                                  </>
                                )}

                              <Box flex="1 1 30%">
                                <Typography fontWeight="bold">
                                  Created By:
                                </Typography>
                                <Typography>{receipt.created_by}</Typography>
                              </Box>

                              <Box flex="1 1 30%">
                                <Typography fontWeight="bold">
                                  Status:
                                </Typography>
                                <Typography
                                  color={
                                    isCancelled ? "error.main" : "success.main"
                                  }
                                >
                                  {isCancelled ? `Cancelled by ${receipt.cancelled_by}` : "Active"}
                                </Typography>
                              </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box
                              display="flex"
                              justifyContent="flex-end"
                              gap={1}
                            >
                              {!isCancelled && (
                                <Button
                                  variant="contained"
                                  onClick={() => handlePrint(receipt)}
                                  size="small"
                                  sx={{
                                    backgroundColor: "#5fc1b2",
                                    "&:hover": { backgroundColor: "#4da99f" },
                                  }}
                                >
                                  Print
                                </Button>
                              )}

                              {!isCancelled && (
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() => handleCancelClick(receipt)}
                                  size="small"
                                >
                                  Cancel
                                </Button>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ) : (
          <Typography textAlign="center">No receipts found</Typography>
        )}

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Cancellation</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to cancel receipt{" "}
              {selectedReceipt?.transaction_no}? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>
              No, Keep Receipt
            </Button>
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
      </Box>
    </>
  );
};

export default ReceiptsList;