import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import axios from "axios";
import Navbar from "../../components/Navbar";
import FilterForm from "./FilterForm";
import DataTable from "./DataTable";
import { generateFilterPDF } from "../../utils/generateFilterPDF";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function FilterPage() {
  const [filters, setFilters] = useState({});
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // handle search → call backend
  const handleSearch = async (filterValues) => {
    console.log("Searching with filters:", filterValues);
    setFilters(filterValues);

    try {
      setLoading(true);
      // Define defaults expected by backend
      const defaultFilters = {
        patient_type: "",
        date_from: "",
        date_to: "",
        doctor_wise: "",
        empanelment: "",
      };

      // Merge defaults with provided filterValues
       const normalizedFilters = Object.fromEntries(
      Object.entries({ ...defaultFilters, ...filterValues }).map(([key, val]) => [
        key,
        val === "All" ? "" : val,
      ])
    );

      // Convert to query string
      const queryParams = new URLSearchParams(normalizedFilters).toString();

      const res = await axios.get(
        `${backendUrl}/patients/filter?${queryParams}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      );

      console.log("Received data:", res.data);
      setTableData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
      setTableData([]);
    }
  };

  const navigate = useNavigate();
const handleGoHome = () => {
  navigate("/");
};

  return (
    <>
      <Card>
        <Navbar />
        <CardContent sx={{ padding: 5}}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoHome}
            startIcon={<HomeIcon />}
            sx={{
              mb: 2,
              backgroundColor: "#5fc1b2",
              "&:hover": { backgroundColor: "#4da99f" },
            }}
          >
            Home
          </Button>
          {/* Loading spinner */}
          <Backdrop open={loading} sx={{ color: "#fff", zIndex: 9999 }}>
            <CircularProgress color="inherit" />
          </Backdrop>

          <Typography variant="h6" gutterBottom>
            Filter Data
          </Typography>

          {/* Filters */}
          {/* <FilterForm onSearch={handleSearch}  /> */}
          <FilterForm
            onSearch={handleSearch}
            onPrint={() => generateFilterPDF(tableData, true)}
          />

          {/* Table */}
          <DataTable data={tableData} />
        </CardContent>
      </Card>

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
    </>
  );
}
