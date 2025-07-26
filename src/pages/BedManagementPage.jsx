import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TableContainer,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

export default function BedAllocationPage() {
  const [uhid, setUhid] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [bed, setBed] = useState("");
  const [bedData, setBedData] = useState({});
  const [allottedBeds, setAllottedBeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState("");
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [shiftForm, setShiftForm] = useState({
    uhid: "",
    patient_name: "",
    department: "",
    bed_number: "",
  });

  const navigate = useNavigate();

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

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchAvailableBeds = () => {
    axios
      .get(`${backendUrl}/beds/available`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
      })
      .then((res) => {
        setBedData(res.data.available_beds);
      })
      .catch((err) => {
        console.error("Error fetching bed data:", err);
      });
  };

  // Fetch departments and beds
  useEffect(() => {
    axios
      .get(`${backendUrl}/beds/available`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
      })
      .then((res) => {
        setBedData(res.data.available_beds);
        // console.log("Available beds data:", res.data.available_beds);
      })
      .catch((err) => {
        console.error("Error fetching bed data:", err);
      });

    fetchAvailableBeds();
    loadAllottedBeds();
  }, []);

  const loadAllottedBeds = () => {
    axios
      .get(`${backendUrl}/beds`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
      })
      .then((res) => {
        setAllottedBeds(res.data);
      })
      .catch((err) => {
        console.error("Error fetching allotted beds:", err);
      });
  };

  const handleAdd = () => {
    if (!uhid || !name || !department || !bed) {
      showToast("Please fill all fields", "warning");
      return;
    }

    const payload = {
      uhid,
      patient_name: name,
      department,
      bed_number: bed,
    };

    setLoading(true);

    axios
      .post(`${backendUrl}/bed_allotment`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
      })
      .then(() => {
        loadAllottedBeds();
        fetchAvailableBeds();
        setUhid("");
        setName("");
        setDepartment("");
        setBed("");
        showToast("Bed successfully allotted", "success");
      })
      .catch((err) => {
        console.error("Error allotting bed:", err);
        if (err.response && err.response.status === 403) {
          showToast(err.response.data?.detail || "Permission denied.", "error");
        } else {
          showToast("Failed to allot bed. Please try again.", "error");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemoveBed = (bedNumber) => {
    const confirm = window.confirm(
      `Are you sure you want to remove patient from bed ${bedNumber}?`
    );
    if (!confirm) return;

    setLoading(true);
    axios
      .delete(`${backendUrl}/bed/${bedNumber}`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
      })
      .then(() => {
        loadAllottedBeds();
        fetchAvailableBeds();
        showToast(`Patient removed from bed ${bedNumber}`, "success");
      })
      .catch((err) => {
        console.error("Error removing patient:", err);
        showToast("Failed to remove patient.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangeBed = (patient) => {
    setShiftForm({
      uhid: patient.uhid,
      patient_name: patient.patient_name,
      department: "",
      bed_number: "",
    });
    setShiftModalOpen(true);
  };

  const handleShiftSubmit = () => {
    const { uhid, patient_name, department, bed_number } = shiftForm;

    if (!department || !bed_number) {
      showToast("Please select department and bed number", "warning");
      return;
    }

    setLoading(true);

    axios
      .put(
        `${backendUrl}/bed/shift`,
        {
          uhid,
          patient_name,
          department,
          bed_number,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      )
      .then(() => {
        setShiftModalOpen(false);
        setShiftForm({
          uhid: "",
          patient_name: "",
          department: "",
          bed_number: "",
        });
        loadAllottedBeds();
        fetchAvailableBeds();
        showToast("Patient successfully shifted", "success");
      })
      .catch((err) => {
        console.error("Error shifting patient:", err);
        showToast("Failed to shift patient.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const departments = Object.keys(bedData);
  const availableBeds = bedData[department] || [];

  // Filter only occupied beds
  const occupiedBeds = allottedBeds.filter((b) => b.status === "occupied");

  // Then filter by selected department
  const filteredBeds = filterDepartment
    ? occupiedBeds.filter((b) => b.department === filterDepartment)
    : occupiedBeds;

  return (
    <Box p={4}>
      {/* Loading spinner */}
      <Backdrop open={loading} sx={{ color: "#fff", zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography variant="h4" mb={2}>
        Bed Allocation
      </Typography>
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

      {/* Form */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item width={"28%"}>
            <TextField
              label="UHID"
              value={uhid}
              onChange={(e) => setUhid(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item width={"70%"}>
            <TextField
              label="Patient Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item width={"25%"}>
            <TextField
              select
              label="Department"
              value={department}
              onChange={(e) => {
                const selectedDept = e.target.value;
                setDepartment(selectedDept);
                setBed(""); // reset bed on dept change

                // Alert if no beds in this department
                if (
                  bedData[selectedDept] &&
                  bedData[selectedDept].length === 0
                ) {
                  alert(`${selectedDept} has no beds available.`);
                }
              }}
              fullWidth
            >
              {departments.map((dep) => (
                <MenuItem key={dep} value={dep}>
                  {dep}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item width={"25%"}>
            <TextField
              select
              label="Bed Number"
              value={bed}
              onChange={(e) => setBed(e.target.value)}
              fullWidth
              disabled={!department}
            >
              {availableBeds.map((b) => (
                <MenuItem key={b} value={b}>
                  {b}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item width={"20%"} display="flex" alignItems="end">
            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={loading}
              sx={{
                backgroundColor: "#5fc1b2",
                "&:hover": { backgroundColor: "#4da99f" },
              }}
            >
              {loading ? "Allotting..." : "Allot Bed"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Table Filter */}
      <Grid container spacing={2} alignItems="center" mb={1}>
        <Grid item width={"30%"} mb={3}>
          <TextField
            select
            label="Filter by Department"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((dep) => (
              <MenuItem key={dep} value={dep}>
                {dep}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Table */}
      {filteredBeds.length === 0 ? (
        <Typography>No occupied beds yet.</Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ overflowX: "auto", maxWidth: "100%" }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#5fc1b2" }}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  UHID
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  Patient Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  Department
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  Bed Number
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredBeds.map((a, index) => (
                <TableRow
                  key={a.bed_id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#dcf3ec",
                  }}
                >
                  <TableCell>{a.uhid}</TableCell>
                  <TableCell>{a.patient_name}</TableCell>
                  <TableCell>{a.department}</TableCell>
                  <TableCell>{a.bed_number}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => handleRemoveBed(a.bed_number)}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() => handleChangeBed(a)}
                    >
                      Shift Patient
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={shiftModalOpen}
        onClose={() => setShiftModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent dividers sx={{ px: 4, pt: 3, pb: 2 }}>
          <Box
            component="form"
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Row 1: UHID & Patient Name */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <TextField
                label="UHID"
                value={shiftForm.uhid}
                fullWidth
                disabled
                variant="outlined"
                sx={{ flex: { xs: "1 1 100%", sm: "1 1 48%" } }}
              />
              <TextField
                label="Patient Name"
                value={shiftForm.patient_name}
                fullWidth
                disabled
                variant="outlined"
                sx={{ flex: { xs: "1 1 100%", sm: "1 1 48%" } }}
              />
            </Box>

            {/* Row 2: Department & Bed */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <TextField
                select
                label="New Department"
                value={shiftForm.department}
                onChange={(e) =>
                  setShiftForm((prev) => ({
                    ...prev,
                    department: e.target.value,
                    bed_number: "",
                  }))
                }
                fullWidth
                variant="outlined"
                sx={{ flex: { xs: "1 1 100%", sm: "1 1 48%" } }}
              >
                {departments.map((dep) => (
                  <MenuItem key={dep} value={dep}>
                    {dep}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="New Bed"
                value={shiftForm.bed_number}
                onChange={(e) =>
                  setShiftForm((prev) => ({
                    ...prev,
                    bed_number: e.target.value,
                  }))
                }
                fullWidth
                disabled={!shiftForm.department}
                variant="outlined"
                sx={{ flex: { xs: "1 1 100%", sm: "1 1 48%" } }}
              >
                {(bedData[shiftForm.department] || []).map((b) => (
                  <MenuItem key={b} value={b}>
                    {b}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 4, pb: 2 }}>
          <Button onClick={() => setShiftModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleShiftSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#5fc1b2",
              "&:hover": { backgroundColor: "#4da99f" },
            }}
          >
            Shift
          </Button>
        </DialogActions>
      </Dialog>

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
  );
}
