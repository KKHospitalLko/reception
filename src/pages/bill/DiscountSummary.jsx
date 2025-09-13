import React from "react";
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";

export default function DiscountSummary({
  rows,
  discountType,
  setDiscountType,
  discountValue,
  setDiscountValue,
  transactions,
  amount,
  patient,
  beds,
  todayDate,
  navigate,
}) {
  const subtotal = rows.reduce((sum, r) => sum + (r.amount || 0), 0);
  const discount =
    discountType === "amount"
      ? Number(discountValue || 0)
      : (subtotal * Number(discountValue || 0)) / 100;
  const total = subtotal - discount;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Discounts & Summary
      </Typography>

      <RadioGroup
        row
        value={discountType}
        onChange={(e) => setDiscountType(e.target.value)}
      >
        <FormControlLabel value="amount" control={<Radio />} label="Amount" />
        <FormControlLabel value="percent" control={<Radio />} label="Percent" />
      </RadioGroup>

      <TextField
        label="Discount"
        value={discountValue}
        onChange={(e) => setDiscountValue(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Typography><strong>Subtotal:</strong> {subtotal}</Typography>
      <Typography><strong>Discount:</strong> {discount}</Typography>
      <Typography><strong>Total:</strong> {total}</Typography>

      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
        Generate Final Bill
      </Button>
    </Box>
  );
}
