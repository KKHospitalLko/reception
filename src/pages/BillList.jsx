import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Button,
  Divider,
  List,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "../components/Navbar";
import { generateBillPDF } from "../utils/generateBillPDF.js";
import axios from "axios";

// Helper function for the Snackbar alert
const AlertComponent = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function BillList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [billData, setBillData] = useState(location.state?.billData || []);
  // console.log("Bill Data:", billData);
  
  const [error, setError] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const username = sessionStorage.getItem("username");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const openCancelDialog = (bill) => {
    // console.log("Opening cancel dialog for bill:", bill.final_bill_no);
    setSelectedBill(bill);
    setConfirmOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBill) return;

    setLoading(true);
    try {
      await axios.put(
        `${backendUrl}/final-bill/cancel/${selectedBill.final_bill_no}`,
        { cancelled_by: username },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      );

      // Correctly update state with both status and the user who cancelled it
      setBillData((prev) =>
        prev.map((bill) =>
          bill.final_bill_no === selectedBill.final_bill_no
            ? { ...bill, status: "cancelled", cancelled_by: username }
            : bill
        )
      );
      setConfirmOpen(false);
      setSnackbarMessage(
        `Bill ${selectedBill.final_bill_no} has been cancelled successfully.`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // console.log(`Bill ${selectedBill.final_bill_no} cancelled successfully`);
      setSelectedBill(null);
    } catch (err) {
      console.error("Error cancelling receipt:", err);
      const errorMessage =
        err.response?.data?.detail || "Failed to cancel receipt";
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (bill) => {
    generateBillPDF(bill);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Group bills by registration number
  const groupedBills = billData.reduce((acc, bill) => {
    const regNo = bill.patient_regno;
    if (!acc[regNo]) {
      acc[regNo] = [];
    }
    acc[regNo].push(bill);
    return acc;
  }, {});

  return (
    <>
      <Navbar />
      <Box p={3} maxWidth="1000px" mx="auto">
        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          fontWeight="bold"
        >
          Final Bills
        </Typography>

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

        {billData.length > 0 ? (
          <Box>
            {billData.map((bill, index) => (
              <Accordion key={index} defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box
                    display="flex"
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography fontWeight="bold">
                      Final Bill No: {bill.final_bill_no}
                    </Typography>
                    <Typography>
                      Patient: {bill.patient_name} (UHID: {bill.patient_uhid})
                    </Typography>
                    <Typography>Reg No: {bill.patient_regno}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Card
                    elevation={2}
                    sx={{
                      mb: 2,
                      backgroundColor:
                        bill.status === "cancelled" ? "#ffe6e6" : "inherit",
                    }}
                  >
                    <CardContent>
                      <Box display="flex" flexWrap="wrap" gap={2}>
                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">
                            Age / Gender:
                          </Typography>
                          <Typography>
                            {bill.age} / {bill.gender}
                          </Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">Room Type:</Typography>
                          <Typography>{bill.room_type}</Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">Bed No:</Typography>
                          <Typography>{bill.bed_no}</Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">
                            Consultant Doctor:
                          </Typography>
                          <Typography>{bill.consultant_doctor}</Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">
                            Admission Date:
                          </Typography>
                          <Typography>{bill.admission_date}</Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">Discharge:</Typography>
                          <Typography>
                            {bill.discharge_date} {bill.discharge_time}
                          </Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">
                            Total Charges:
                          </Typography>
                          <Typography>
                            ₹
                            {Number(bill.total_charges).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">
                            Total Discount:
                          </Typography>
                          <Typography color="error.main">
                            ₹
                            {Number(bill.total_discount).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">Net Amount:</Typography>
                          <Typography color="primary.main" fontWeight="bold">
                            ₹
                            {Number(bill.net_amount).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">Total Paid:</Typography>
                          <Typography color="success.main" fontWeight="bold">
                            ₹
                            {Number(bill.total_paid).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">Balance:</Typography>
                          <Typography
                            color={
                              bill.balance < 0 ? "error.main" : "success.main"
                            }
                            fontWeight="bold"
                          >
                            ₹
                            {Number(bill.balance).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">Created By:</Typography>
                          <Typography>{bill.created_by}</Typography>
                        </Box>

                        {bill.status === "cancelled" ? (
                          <Box flex="1 1 45%">
                            <Typography fontWeight="bold">
                              Cancelled By:
                            </Typography>
                            <Typography>{bill.cancelled_by}</Typography>
                          </Box>
                        ) : (
                          <Box flex="1 1 45%">
                            <Typography fontWeight="bold">Status:</Typography>
                            <Typography>{bill.status}</Typography>
                          </Box>
                        )}
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Transactions List */}
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        Transactions
                      </Typography>
                      <List sx={{ width: "100%", p: 0 }}>
                        {bill.transaction_breakdown?.map((txn, tIdx) => (
                          <Card key={tIdx} sx={{ mb: 1 }} variant="outlined">
                            <CardContent
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography>
                                Txn No: {txn.transaction_no} | Date: {txn.date}
                              </Typography>
                              <Typography color="success.main">
                                ₹
                                {Number(txn.amount).toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Typography>
                            </CardContent>
                          </Card>
                        ))}
                      </List>

                      {/* Buttons - hide if cancelled */}
                      {bill.status !== "cancelled" && (
                        <Box display="flex" gap={2} mt={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => generateBillPDF([bill], true)}
                          >
                            Print Bill
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => openCancelDialog(bill)}
                          >
                            Cancel Bill
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </AccordionDetails>
              </Accordion>
            ))}

            {/* Confirm Cancel Dialog */}
            <Dialog
              open={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              maxWidth="xs"
              fullWidth
            >
              <DialogTitle>Confirm Cancellation</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to cancel bill{" "}
                  <Typography component="span" fontWeight="bold">
                    {selectedBill?.final_bill_no}
                  </Typography>
                  ? This action cannot be undone.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setConfirmOpen(false)}>
                  No, Keep Bill
                </Button>
                <Button
                  onClick={handleCancelConfirm}
                  color="error"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Yes, Cancel Bill"
                  )}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        ) : (
          <Alert severity="info">No Final Bills found</Alert>
        )}
      </Box>

      {/* Snackbar for user feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <AlertComponent
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </AlertComponent>
      </Snackbar>
    </>
  );
}
