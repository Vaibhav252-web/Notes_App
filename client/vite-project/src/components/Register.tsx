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
import { useRegisterMutation, useVerifyOtpMutation } from "../service/user.auth";

type RegisterFormState = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
  });

 
  const [step, setStep] = useState<"register" | "otp">("register");
  const [userID, setUserID] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  const [register, { isLoading: isRegistering, error: registerError }] =
    useRegisterMutation();
  const [verifyOtp, { isLoading: isVerifying, error: otpError }] =
    useVerifyOtpMutation();

  // Handle registration step
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register(formData).unwrap();
      if (response?.data?.userID) {
        setUserID(response.data.userID);
        setStep("otp");
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

 
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await verifyOtp({ userID, otp }).unwrap();
      
    
      if (response?.data) {
        localStorage.setItem("token", response.data);
      }
      
      navigate("/dashboard"); 
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
          {step === "register" ? (
            <>
              <Typography variant="h4" align="center" gutterBottom>
                Register
              </Typography>

              <Box component="form" onSubmit={handleRegisterSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  margin="normal"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  margin="normal"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={isRegistering}
                >
                  {isRegistering ? "Registering..." : "Register"}
                </Button>

                {registerError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {(registerError as any)?.data?.message || "Registration failed"}
                  </Alert>
                )}

                <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: "#1976d2", fontWeight: "bold" }}>
                    Login here
                  </Link>
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h4" align="center" gutterBottom>
                Verify OTP
              </Typography>
              <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                Enter the OTP sent to <b>{formData.email}</b>
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
                  {isVerifying ? "Verifying..." : "Verify OTP"}
                </Button>

                {otpError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {(otpError as any)?.data?.message || "OTP verification failed"}
                  </Alert>
                )}

                <Button
                  fullWidth
                  variant="text"
                  sx={{ mt: 1 }}
                  onClick={() => setStep("register")}
                >
                  Back to Registration
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;