import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useVerifyPaymentQuery } from "../../../state/api";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import "./PaymentVerification.css"; // Import external CSS

const PaymentVerification = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderId = params.get("order_id");

  const MAX_ATTEMPTS = 10;
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState("Verifying your payment...");
  const [stopPolling, setStopPolling] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false); // ✅ New state for download status
  const downloadStarted = useRef(false);

  const { data: paymentStatus, isLoading } = useVerifyPaymentQuery(orderId, {
    skip: !orderId || stopPolling || attempts >= MAX_ATTEMPTS,
    pollingInterval: 10000, // Check every 10 sec
  });

  const startDownload = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setIsDownloaded(true); // ✅ Update state when download completes
  };

  useEffect(() => {
    if (!paymentStatus) return;

    if (attempts >= MAX_ATTEMPTS) {
      setStatus("Verification timeout. Please contact support.");
      setStopPolling(true);
      return;
    }

    if (!stopPolling) {
      setAttempts((prev) => prev + 1);
    }

    switch (paymentStatus.paymentStatus) {
      case "PAID":
        if (paymentStatus.answerPaperUrl && !downloadStarted.current) {
          downloadStarted.current = true;
          startDownload(paymentStatus.answerPaperUrl);
        }
        setStatus("Payment verified! Your answer paper is downloading.");
        setStopPolling(true);
        break;

      case "PENDING":
        setStatus("Payment is still being processed. Please wait...");
        break;

      case "FAILED":
        setStatus("Payment failed. Please try again.");
        setStopPolling(true);
        break;

      case "ORDER NOT FOUND":
        setStatus("Invalid order ID. Please check and try again.");
        setStopPolling(true);
        break;

      default:
        setStatus("An unexpected error occurred. Please contact support.");
        setStopPolling(true);
    }
  }, [paymentStatus, attempts, stopPolling]);

  return (
    <div className="payment-verification">
      <div className="payment-verification__container">
        {isDownloaded ? ( // ✅ Show download success icon
          <FileDownloadDoneIcon className="payment-verification__icon payment-verification__icon--downloaded" />
        ) : isLoading ? (
          <CircularProgress className="payment-verification__icon payment-verification__icon--loading" />
        ) : paymentStatus?.status === "SUCCESS" ? (
          <CheckCircleIcon className="payment-verification__icon payment-verification__icon--success" />
        ) : paymentStatus?.status === "FAILED" ? (
          <ErrorIcon className="payment-verification__icon payment-verification__icon--error" />
        ) : (
          <HourglassEmptyIcon className="payment-verification__icon payment-verification__icon--pending" />
        )}

        <h2 className="payment-verification__status">
          {isDownloaded ? "Download Complete! Check your files." : status}
        </h2>
       

        {paymentStatus?.status === "FAILED" && (
          <button
            onClick={() => window.location.reload()}
            className="payment-verification__retry-button"
          >
            Retry Verification
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentVerification;
