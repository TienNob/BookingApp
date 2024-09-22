import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import axios from "axios";
import Loadding from "../../Loadding";

const ForumEditProfile = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cccd: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [cccdError, setCccdError] = useState(""); // Error message for CCCD
  const [phoneError, setPhoneError] = useState(""); // Error message for Phone
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const { enqueueSnackbar } = useSnackbar(); // Initialize snackbar

  // Regex patterns for validation
  const cccdRegex = /^\d{12}$/;
  const phoneRegex = /^0\d{9}$/;

  // Gọi API để lấy thông tin user
  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/api/users/${userId}`)
        .then((response) => {
          const user = response.data;
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            cccd: user.cccd || "",
            phone: user.phone || "",
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setError("Failed to fetch user data.");
          setLoading(false);
        });
    }
  }, [open, userId]);

  // Xử lý khi thay đổi giá trị trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate CCCD and Phone
    if (name === "cccd") {
      setCccdError(cccdRegex.test(value) ? "" : "CCCD phải có 12 chữ số");
    }
    if (name === "phone") {
      setPhoneError(
        phoneRegex.test(value)
          ? ""
          : "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0"
      );
    }
  };

  // Gọi hàm onSave khi người dùng nhấn nút "Lưu"
  const handleSave = async () => {
    // Nếu có lỗi CCCD hoặc số điện thoại, không gửi yêu cầu
    if (cccdError || phoneError) return;

    setSaving(true);
    try {
      const response = await axios.put(
        `http://localhost:8080/api/users/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      enqueueSnackbar(`Thay đổi thông tin thành công!`, { variant: "success" });
      setSaving(false);
      handleClose(); // Đóng dialog sau khi lưu thành công
    } catch (error) {
      console.error("Error saving user data:", error);
      enqueueSnackbar(`Thay đổi thông tinh thất bại!`, { variant: "error" });
      setError("Failed to save user data.");
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle mb={2}>Chỉnh sửa thông tin cá nhân</DialogTitle>
      <DialogContent>
        {loading ? (
          <Loadding />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Họ"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Tên"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                margin="dense"
                label="CCCD"
                name="cccd"
                value={formData.cccd}
                onChange={handleChange}
                error={!!cccdError}
                helperText={cccdError}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                margin="dense"
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!phoneError}
                helperText={phoneError}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            borderRadius: "8px",
            backgroundColor: "var(--grey)",
            "&:hover": {
              backgroundColor: "var(--subtext-color)",
            },
          }}
          variant="contained"
          onClick={handleClose}
        >
          Hủy
        </Button>
        <Button
          sx={{
            borderRadius: "8px",
            backgroundColor: "var(--primary-color)",
            "&:hover": {
              backgroundColor: "var(--hover-color)",
            },
          }}
          variant="contained"
          onClick={handleSave}
          color="primary"
          disabled={saving || !!cccdError || !!phoneError} // Disable if validation errors exist
        >
          {saving ? <CircularProgress size={24} /> : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForumEditProfile;
