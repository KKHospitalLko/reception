import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
} from "@mui/material";

export default function ReceiptsTable({ transactions }) {
  return (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>
        Receipts / Transactions
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Receipt No</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Mode</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length > 0 ? (
            transactions.map((t, idx) => (
              <TableRow key={idx}>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.receiptNo}</TableCell>
                <TableCell>{t.amount}</TableCell>
                <TableCell>{t.mode}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}
