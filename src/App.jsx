import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SectionCards from "./pages/home/SectionCards";
import StatsCards from "./pages/home/StatsCards";
import ChartsSection from "./pages/home/ChartsSection";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Dashboard() {
  const username = sessionStorage.getItem("username");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    sessionStorage.removeItem("username");
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(backendUrl + "/patients/count_and_graph", {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        });
        const dashboardData = res.data;
        setData(dashboardData);
        console.log("Dashboard data:", dashboardData);
      } catch (error) {
        setLoading(false);
        if (error.response && Array.isArray(error.response.data?.detail)) {
          // Show all validation messages if available
          const messages = error.response.data.detail
            .map((d) => d.msg)
            .join("\n");
          alert(messages);
        } else if (error.response?.data?.detail) {
          // Single validation message
          alert(error.response.data.detail);
        } else {
          console.error("Error submitting form:", error);
          // alert("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ textAlign: "center", mt: 4, px: 2 }}>
      <Typography variant="h3" gutterBottom>
        Welcome {username}
      </Typography>
      

      {/* Navigation Section */}
      <SectionCards />

      {/* Loading & Data Display */}
      {loading ? (
        <Box mt={4}>
          <CircularProgress />
        </Box>
      ) : ( data && 
        <>
          {/* Stats Summary */}
          <Box mt={4}>
            <StatsCards counts={data?.count} />
          </Box>

          {/* Charts Section */}
          <Box mt={4}>
            <ChartsSection graphs={data?.graph} />
          </Box>
        </>
      )}

      {/* Logout */}
      <Box mt={4} mb={4}>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}
