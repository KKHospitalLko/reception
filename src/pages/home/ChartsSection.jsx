import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ChartsSection({ graphs }) {
  const buildChartData = (label, data, color) => ({
    labels: data?.dates_x_axis ?? [],
    datasets: [
      {
        label,
        data: data?.dates_y_axis ?? [],
        borderColor: color,
        backgroundColor: `${color}33`, // light transparent version
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  });

  const chartMappings = [
    { key: "OPD", label: "OPD", color: "rgba(54, 162, 235, 1)" },       // Blue
    { key: "IPD", label: "IPD", color: "rgba(255, 99, 132, 1)" },       // Red
    { key: "DAYCARE", label: "Daycare", color: "rgba(75, 192, 192, 1)" }, // Teal
    { key: "DISCHARGED", label: "Discharged", color: "rgba(255, 159, 64, 1)" }, // Orange
  ];

  return (
    <Box display="flex" flexDirection="column" gap={3} paddingX={20}>
      {chartMappings.map(({ key, label, color }) => (
        <Card key={key} sx={{ width: "100%", boxShadow: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ textAlign: "left", fontWeight: "bold", mb: 2 }}
            >
              {label} Trends
            </Typography>
            <Line
              data={buildChartData(label, graphs?.[key], color)}
              options={{
                responsive: true,
                maintainAspectRatio: true, // stop infinite growth
                plugins: {
                  legend: { display: false },
                  tooltip: { mode: "index", intersect: false },
                },
                scales: {
                  x: {
                    ticks: { maxRotation: 45, minRotation: 45 },
                    grid: { display: false },
                  },
                  y: {
                    beginAtZero: true,
                    grid: { color: "rgba(200,200,200,0.2)" },
                  },
                },
              }}
              height={70} // fixed height
            />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
