import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation, useVerifyOtpMutation } from "../service/user.auth";

const Login = () => {
  const navigate = useNavigate();

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [step, setStep] = useState<"login" | "otp">("login");
  const [userID, setUserID] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  const [verifyOtp, { isLoading: isVerifying, error: otpError }] =
    useVerifyOtpMutation();
  const [login, { isLoading: isLogin, error: loginError }] = useLoginMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await login(loginFormData).unwrap();

      
      if (typeof response.data === "object" && response.data?.userID) {
        setUserID(response.data.userID);
        setStep("otp"); 
      } else if (typeof response.data === "string") {
        // User is verified, token received
        localStorage.setItem("token", response.data);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

 
  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await verifyOtp({ userID, otp }).unwrap();

      if (response?.data) {
        localStorage.setItem("token", response.data);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card sx={{ width: 400 }}>
        <CardContent sx={{ p: 4 }}>
          {step === "login" ? (
            <>
              <Typography variant="h4" align="center" gutterBottom>
                Login
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  margin="normal"
                  value={loginFormData.email}
                  onChange={(e) =>
                    setLoginFormData({
                      ...loginFormData,
                      email: e.target.value,
                    })
                  }
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  value={loginFormData.password}
                  onChange={(e) =>
                    setLoginFormData({
                      ...loginFormData,
                      password: e.target.value,
                    })
                  }
                  required
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={isLogin}
                >
                  {isLogin ? "Logging in..." : "Login"}
                </Button>

                {loginError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {(loginError as any)?.data?.message || "Login failed"}
                  </Alert>
                )}

                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "#1976d2", fontWeight: "bold" }}>
                      Register
                    </Link>
                  </Typography>
                  <Typography variant="body2">
                    <Link to="/forgot-password" style={{ color: "#1976d2", fontWeight: "bold" }}>
                      Forgot Password?
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h4" align="center" gutterBottom>
                Verify OTP
              </Typography>
              <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                You are not verified yet. An OTP has been sent to <b>{loginFormData.email}</b>
              </Typography>

              <Box component="form" onSubmit={handleOtpSubmit}>
                <TextField
                  fullWidth
                  label="Enter OTP"
                  margin="normal"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={isVerifying}
                >
                  {isVerifying ? "Verifying..." : "Verify & Login"}
                </Button>

                {otpError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {(otpError as any)?.data?.message ||
                      "OTP verification failed"}
                  </Alert>
                )}

                <Button
                  fullWidth
                  variant="text"
                  sx={{ mt: 1 }}
                  onClick={() => setStep("login")}
                >
                  Back to Login
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;