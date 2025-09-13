import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ServiceCharges({ rows, setRows }) {
  const addRow = () => {
    setRows([
      ...rows,
      { descriptionType: "service", description: "", unit: 1, rate: 0, amount: 0 },
    ]);
  };

  const removeRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  return (
    <Box mb={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.unit}</TableCell>
              <TableCell>{row.rate}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>
                <IconButton onClick={() => removeRow(idx)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={addRow} sx={{ mt: 1 }} variant="outlined">
        Add Service
      </Button>
    </Box>
  );
}
