import { useState } from "react";
import {
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { reportUser } from "../../../api/userAPI"; // Import API
import "./reportUserModal.scss";

interface ReportUserProps {
  open: boolean;
  handleClose: () => void;
  currentUID: number;
  targetUID: number;
  targetName: string;
}

const ReportUserModal = (props: ReportUserProps) => {
  const [reportType, setReportType] = useState<string>("spam");
  const [reportContent, setReportContent] = useState<string>("");

  const [typeError, setTypeError] = useState<boolean>(false);
  const [contentError, setContentError] = useState<boolean>(false);

  const handleReport = async () => {
    let hasError = false;

    // Kiểm tra bắt buộc
    if (!reportType) {
      setTypeError(true);
      hasError = true;
    } else {
      setTypeError(false);
    }

    if (!reportContent.trim()) {
      setContentError(true);
      hasError = true;
    } else {
      setContentError(false);
    }

    if (hasError) return;

    try {
      // Gọi API reportUser
      await reportUser(
        props.currentUID,
        props.targetUID,
        reportContent,
        reportType
      );
      console.log("Report successful!");
      props.handleClose();
    } catch (error) {
      console.error("Error reporting user:", error);
      alert("Failed to report. Please try again.");
    }
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="report-modal-title"
      aria-describedby="report-modal-description"
    >
      <div className="report-modal customScrollbar">
        <div className="header">
          <div className="none"></div>
          <Typography
            className="report-modal-title"
            variant="h6"
            component="h2"
          >
            Report {props.targetName}
          </Typography>
          <IconButton
            onClick={props.handleClose}
            className="report-modal-title"
          >
            X
          </IconButton>
        </div>
        <div className="mainContent">
          {/* Selector for report type */}
          <Typography variant="subtitle1" className="type-label">
            Select report type:
          </Typography>
          <TextField
            select
            required
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="type-selector"
            fullWidth
            error={typeError}
            helperText={typeError ? "Please select a report type." : ""}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#1c1c1c", // Màu nền của selector
                color: "#ffffff", // Màu chữ
              },
              "& .MuiPaper-root": {
                backgroundColor: "#242526", // Màu nền menu dropdown
                color: "#e7e9ea", // Màu chữ menu dropdown
              },
              "& .MuiMenuItem-root": {
                "&:hover": {
                  backgroundColor: "#555", // Màu hover của item
                },
                "& .MuiSelect-icon": {
                  color: "#ffffff",
                  fill: "#fff !important  ",
                },
              },
            }}
          >
            <MenuItem value="spam">Spam</MenuItem>
            <MenuItem value="inappropriate_content">
              Inappropriate Content
            </MenuItem>
            <MenuItem value="harassment">Harassment</MenuItem>
            <MenuItem value="scam">Scam</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>

          {/* Text field for user to input report content */}
          <Typography variant="subtitle1" className="content-label">
            Additional details:
          </Typography>
          <TextField
            multiline
            required
            rows={4}
            placeholder="Provide details about your report..."
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
            fullWidth
            className="content-input"
            error={contentError}
            helperText={
              contentError ? "Please provide additional details." : ""
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#1c1c1c", // Màu nền textfield
                color: "#ffffff", // Màu chữ
              },
            }}
          />
        </div>
        <div className="reportOption">
          <Button
            className="cancel-button"
            variant="contained"
            onClick={props.handleClose}
          >
            Cancel
          </Button>
          <Button
            className="report-button"
            variant="contained"
            onClick={handleReport}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportUserModal;
