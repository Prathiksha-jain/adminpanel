import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
const backendUrl = process.env.REACT_APP_BACKEND_URL;


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={5} ref={ref} variant="filled" {...props} />;
});

const OtpForm = ({ userId }) => {
  const [otp, setOtp] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    try {
      setVerified(true);
      const response = await fetch(
        // "http://localhost:2000/verify-otp", 
        `${backendUrl}/verify-otp`,
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });
        
      const result = await response.json();

      if (response.status === 200) {
        handleSnackbar("OTP verified successfully!", "success");
        localStorage.setItem("token", JSON.stringify(result.auth));
        localStorage.setItem("user", JSON.stringify(result.user.userID));

        if (result.user.userID === "1") {
          navigate(`/adminDashboard/${result.user.userID}`);
        } else if (result.user.userID === "2") {
          navigate(`/operatorDashboard/${result.user.userID}`);
        }
      } else {
        handleSnackbar(result.message, "error");
      }
    } catch (error) {
      handleSnackbar(
        "An unexpected error occurred. Please try again.",
        "error"
      );
    } finally {
      setVerified(false);
    }
  };

  return (
    <div className="otp-container">
      <h2>Enter OTP</h2>
      <form onSubmit={verifyOtp}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="OTP"
          required
        />
        <button type="submit1" className="loader" disabled={verified}>{verified ?"Verifying..":"Verify OTP"}</button>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OtpForm;
