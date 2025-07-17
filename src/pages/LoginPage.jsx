import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import { useNavigate } from "react-router-dom";

// Updated users with usernames and simple passwords
const USERS = [
  { name: "Jyoti Makhija", username: "jyoti", password: "jyoti123" },
  { name: "Ritesh Sharma", username: "ritesh", password: "ritesh123" },
  { name: "Shalini Dubey", username: "shalini", password: "shalini123" },
  { name: "Rinku Singh", username: "rinku", password: "rinku123" },
  { name: "Babloo Singh", username: "babloo", password: "babloo123" },
];

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toastSeverity, setToastSeverity] = useState("success");

  const navigate = useNavigate();

  const handleLogin = () => {
    const user = USERS.find(
      (u) => u.username === username.trim() && u.password === password.trim()
    );

    if (user) {
      localStorage.setItem("username", user.name);
      setToastMsg("Login successful!");
      setToastSeverity("success");
      setToastOpen(true);
      setTimeout(() => {
        navigate("/", { state: { username: user.name } });
      }, 1000);
    } else {
      setToastMsg("Invalid username or password.");
      setToastSeverity("error");
      setToastOpen(true);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" mb={2}>
          Login
        </Typography>
        <TextField
          label="Username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Password"
          fullWidth
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          onClick={handleLogin}
          sx={{
            backgroundColor: "#5fc1b2",
            "&:hover": {
              backgroundColor: "#4da99f",
            },
          }}
          fullWidth
        >
          Login
        </Button>
      </Paper>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
