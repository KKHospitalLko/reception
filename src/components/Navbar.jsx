import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Container,
  Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HotelIcon from "@mui/icons-material/Hotel";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const username = sessionStorage.getItem("username");
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("username");
    navigate("/login");
  };

  const navItems = [
    {
      label: "Registration",
      to: "/registration",
      icon: <LocalHospitalIcon />,
    },
    {
      label: "Bed Allotment",
      to: "/bedManagement",
      icon: <HotelIcon />,
    },
    {
      label: "Receipt",
      to: "/receipt",
      icon: <AssignmentIcon />,
    },
    {
      label: "Bill",
      to: "/bill",
      icon: <ReceiptIcon />,
    },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        K.K. Hospital
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={Link} to={item.to}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: "#5fc1b2" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
              display: { xs: "none", md: "flex" },
            }}
          >
            KK Hospital
          </Typography>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop Navigation Links */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
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

          {/* User and Logout Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mr: { xs: 1, md: 2 },
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: "#3f7d72", mr: 1 }}>
                {username ? username.charAt(0).toUpperCase() : "U"}
              </Avatar>
              <Typography
                variant="body1"
                color="white"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
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

      {/* Mobile Drawer */}
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better performance on mobile
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </AppBar>
  );
};

export default Navbar;