import React from "react";
import {
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import { Link } from "react-router-dom";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HotelIcon from "@mui/icons-material/Hotel";
import LogoutIcon from "@mui/icons-material/Logout";

export default function App() {
 const username = sessionStorage.getItem("username");

const handleLogout = () => {
  sessionStorage.removeItem("username");
  window.location.href = "/login";
};


  const sections = [
    // {
    //   label: "Bill",
    //   to: "/bill",
    //   icon: <ReceiptIcon fontSize="large" color="primary" />,
    // },
    // {
    //   label: "Receipt",
    //   to: "/receipt",
    //   icon: <AssignmentIcon fontSize="large" color="success" />,
    // },
    {
      label: "Registration",
      to: "/registration",
      icon: <LocalHospitalIcon fontSize="large" color="error" />,
    },
    {
      label: "Bed Allotment",
      to: "/bedManagement",
      icon: <HotelIcon fontSize="large" color="secondary" />,
    },
  ];

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to the App
      </Typography>
      <h2>Welcome, {username}</h2>

      <Grid container spacing={3} justifyContent="center" mt={2}>
        {sections.map(({ label, to, icon }) => (
          <Grid item xs={12} sm={6} md={3} key={label}>
            <Card sx={{ minHeight: 150, minWidth: 200 }}>
              <CardActionArea component={Link} to={to}>
                <CardContent>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    {icon}
                    <Typography variant="h6" mt={1}>
                      {label}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
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
