import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useSnackbar } from "notistack"; // Import useSnackbar from notistack

function DriverRegistrationForm({ open, onClose }) {
  const { enqueueSnackbar } = useSnackbar(); // Initialize snackbar
  const [experience, setExperience] = useState("");
  const [licenseImage, setLicenseImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null); // State for registration status
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/driver-registration`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { userId },
          }
        );

        if (response.data.length > 0) {
          const registration = response.data[0];
          console.log(response.data);
          setRegistrationStatus(registration.status);
          setExperience(registration.experience);
          // Set the license image URL for the preview if approved
          if (registration.status === "approved") {
            setPreview(`http://localhost:8080${registration.licenseImage}`);
          }
        }
      } catch (error) {
        console.error("Error fetching registration status", error);
      }
    };

    if (open) {
      fetchRegistrationStatus(); // Fetch status when the dialog opens
    }
  }, [open, token, userId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicenseImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("experience", experience);
    formData.append("licenseImage", licenseImage);

    try {
      await axios.post(
        "http://localhost:8080/api/driver-registration",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      enqueueSnackbar("Đăng ký thành công!", { variant: "success" }); // Success notification
      onClose(); // Close the dialog on success
    } catch (error) {
      enqueueSnackbar("Đăng ký thất bại. Vui lòng thử lại.", {
        variant: "error",
      }); // Error notification
      console.error("Error submitting driver registration", error);
    }
  };

  const renderContent = () => {
    if (registrationStatus === "pending") {
      return (
        <Typography variant="body1">Yêu cầu đang chờ phê duyệt.</Typography>
      );
    }
    if (registrationStatus === "approved") {
      return (
        <Typography variant="body1">
          Yêu cầu của bạn đã được phê duyệt.
        </Typography>
      );
    }
    if (registrationStatus === "rejected") {
      return (
        <Typography variant="body1">
          Yêu cầu bị từ chối. Vui lòng thử lại sau 24 giờ.
        </Typography>
      );
    }
    return (
      <>
        <TextField
          name="experience"
          label="Kinh nghiệm"
          fullWidth
          required
          value={experience}
          sx={{ mt: 1 }}
          onChange={(e) => setExperience(e.target.value)}
        />
        <Button
          sx={{
            mt: 2,
            borderRadius: "8px",
            backgroundColor: "var(--primary-color)",
            "&:hover": {
              backgroundColor: "var(--hover-color)",
            },
          }}
          variant="contained"
          component="label"
        >
          <FileUploadIcon />
          Hình ảnh liên quan
          <input type="file" hidden onChange={handleImageChange} />
        </Button>
        {preview && (
          <div style={{ marginTop: "16px" }}>
            <img
              src={preview}
              alt="License Preview"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Đăng kí tài xế</DialogTitle>
      <DialogContent>{renderContent()}</DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: "8px",
            backgroundColor: "var(--grey)",
            "&:hover": {
              backgroundColor: "var(--subtext-color)",
            },
          }}
          variant="contained"
        >
          Hủy
        </Button>
        {registrationStatus === null && (
          <Button
            sx={{
              borderRadius: "8px",
              backgroundColor: "var(--primary-color)",
              "&:hover": {
                backgroundColor: "var(--hover-color)",
              },
            }}
            variant="contained"
            type="submit"
            onClick={handleFormSubmit}
          >
            Gửi
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default DriverRegistrationForm;
