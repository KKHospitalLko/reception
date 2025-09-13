import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HotelIcon from "@mui/icons-material/Hotel";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BedIcon from "@mui/icons-material/Bed";

export default function StatsCards({ counts }) {
  // Map your API keys into card data
  const stats = [
    { label: "OPD", count: counts?.total_OPD ?? 0, icon: <LocalHospitalIcon color="primary" /> },
    { label: "IPD", count: counts?.total_IPD ?? 0, icon: <HotelIcon color="secondary" /> },
    { label: "Daycare", count: counts?.total_DAYCARE ?? 0, icon: <AssignmentIcon color="success" /> },
    { label: "Discharged", count: counts?.total_Discharged ?? 0, icon: <BedIcon color="error" /> },
  ];

  return (
    <Grid container spacing={3} justifyContent="center">
      {stats.map(({ label, count, icon }) => (
        <Grid item xs={12} sm={6} md={3} key={label}>
          <Card sx={{ minHeight: 150, minWidth: 200 }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center">
                {icon}
                <Typography variant="h6">{label}</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {count}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
