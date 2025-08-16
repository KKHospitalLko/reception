import React from "react";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "../components/Navbar";
import { generateBillPDF } from "../utils/generateBillPDF.js";

export default function BillList() {
  const navigate = useNavigate();
  const location = useLocation();
  const billData = location.state?.billData || [];
    console.log("Bill Data:", billData);

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
                  <Card elevation={2} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box display="flex" flexWrap="wrap" gap={2}>
                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">Age / Gender:</Typography>
                          <Typography>{bill.age} / {bill.gender}</Typography>
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
                          <Typography fontWeight="bold">Consultant Doctor:</Typography>
                          <Typography>{bill.consultant_doctor}</Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">Admission Date:</Typography>
                          <Typography>{bill.admission_date}</Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">Discharge:</Typography>
                          <Typography>
                            {bill.discharge_date} {bill.discharge_time}
                          </Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">Total Charges:</Typography>
                          <Typography>
                            ₹{Number(bill.total_charges).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">Total Discount:</Typography>
                          <Typography color="error.main">
                            ₹{Number(bill.total_discount).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">Net Amount:</Typography>
                          <Typography color="primary.main" fontWeight="bold">
                            ₹{Number(bill.net_amount).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">Total Paid:</Typography>
                          <Typography color="success.main" fontWeight="bold">
                            ₹{Number(bill.total_paid).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Typography>
                        </Box>

                        <Box flex="1 1 45%">
                          <Typography fontWeight="bold">Balance:</Typography>
                          <Typography
                            color={bill.balance < 0 ? "error.main" : "success.main"}
                            fontWeight="bold"
                          >
                            ₹{Number(bill.balance).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Transactions List */}
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Transactions
                      </Typography>
                      <List sx={{ width: "100%", p: 0 }}>
                        {bill.transaction_breakdown?.map((txn, tIdx) => (
                          <Card key={tIdx} sx={{ mb: 1 }} variant="outlined">
                            <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography>
                                Txn No: {txn.transaction_no} | Date: {txn.date}
                              </Typography>
                              <Typography color="success.main">
                                ₹{Number(txn.amount).toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Typography>
                            </CardContent>
                          </Card>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </AccordionDetails>
              </Accordion>
            ))}
            <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2 }}
        onClick={() => generateBillPDF(billData, true)} // true = preview
      >
        Print Bill
      </Button>
          </Box>
        ) : (
          <Alert severity="info">No Final Bills found</Alert>
        )}
      </Box>
    </>
  );
}
