import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Container,
  Avatar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HotelIcon from "@mui/icons-material/Hotel";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar = () => {
  const username = sessionStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("username");
    window.location.href = "/login";
  };

  const navItems = [
    {
      label: "Bill",
      to: "/bill",
      icon: <ReceiptIcon fontSize="small" />,
    },
    {
      label: "Receipt",
      to: "/receipt",
      icon: <AssignmentIcon fontSize="small" />,
    },
    {
      label: "Registration",
      to: "/registration",
      icon: <LocalHospitalIcon fontSize="small" />,
    },
    {
      label: "Bed Allotment",
      to: "/bedManagement",
      icon: <HotelIcon fontSize="small" />,
    },
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: "#5fc1b2" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
            }}
          >
            KK Hospital
          </Typography>

          <Box sx={{ flexGrow: 1, display: "flex" }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.to}
                sx={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  mx: 1,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
                startIcon={item.icon}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: "#3f7d72", mr: 1 }}>
                {username ? username.charAt(0).toUpperCase() : "U"}
              </Avatar>
              <Typography variant="body1" color="white">
                {username || "User"}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ borderColor: "white" }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;