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
  {
    name: "Jyoti Makhija",
    username: "jyoti7009",
    password: import.meta.env.VITE_JYOTI_PASSWORD,
  },
  {
    name: "Ritesh Sharma",
    username: "ritesh7672",
    password: import.meta.env.VITE_RITESH_PASSWORD,
  },
  {
    name: "Shalini Dubey",
    username: "shalini6978",
    password: import.meta.env.VITE_SHALINI_PASSWORD,
  },
  {
    name: "Rinku Singh",
    username: "rinku2158",
    password: import.meta.env.VITE_RINKU_PASSWORD,
  },
  {
    name: "Babloo Singh",
    username: "babloo8272",
    password: import.meta.env.VITE_BABLOO_PASSWORD,
  },
];

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toastSeverity, setToastSeverity] = useState("success");

  const navigate = useNavigate();

  // const handleLogin = () => {
  //   const user = USERS.find(
  //     (u) => u.username === username.trim() && u.password === password.trim()
  //   );

  //   if (user) {
  //     sessionStorage.setItem("username", user.name);
  //     setToastMsg("Login successful!");
  //     setToastSeverity("success");
  //     setToastOpen(true);
  //     setTimeout(() => {
  //       navigate("/", { state: { username: user.name } });
  //     }, 1000);
  //   } else {
  //     setToastMsg("Invalid username or password.");
  //     setToastSeverity("error");
  //     setToastOpen(true);
  //   }
  // };

  const handleLogin = (e) => {
    e.preventDefault(); // ✅ prevent page reload

    const user = USERS.find(
      (u) => u.username === username.trim() && u.password === password.trim()
    );

    if (user) {
      sessionStorage.setItem("username", user.name);
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
        <form onSubmit={handleLogin}>
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
            type="submit" // ✅ Submit on Enter
            variant="contained"
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
        </form>
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
