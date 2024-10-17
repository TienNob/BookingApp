import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Loadding from "../../Loadding";
import { useSnackbar } from "notistack";
import axios from "axios";

function EditTripDialog({ open, onClose, trip, token, rows, setRows }) {
  const { enqueueSnackbar } = useSnackbar();
  const [newTrip, setNewTrip] = useState({
    locations: [],
    totalSeats: "",
    seatsAvailable: "",
    costPerKm: "",
    prices: [],
    departureTime: "",
    user: "",
  });

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (trip) {
      setNewTrip({
        locations: trip.locations || [],
        totalSeats: trip.totalSeats || "",
        seatsAvailable: trip.seatsAvailable || "",
        costPerKm: trip.costPerKm || "",
        prices: trip.prices || [],
        departureTime: trip.departureTime || "",
        user: trip.user || "",
      });
    }
  }, [trip]);
  const handleSubmit = () => {
    setLoading(true);
    const updatedTrip = {
      seatsAvailable: newTrip.seatsAvailable,
      totalSeats: newTrip.totalSeats,
      locations: newTrip.locations,
      costPerKm: newTrip.costPerKm,
      prices: newTrip.prices,
      departureTime: newTrip.departureTime,
      user: newTrip.user,
    };

    axios
      .put(`http://localhost:8080/api/trips/${trip._id}`, updatedTrip, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        const updatedRows = rows.map((row) =>
          row._id === trip._id ? { ...row, ...newTrip } : row
        );
        setRows(updatedRows);
        enqueueSnackbar("Cập nhật chuyến đi thành công", {
          variant: "success",
        });
        onClose();
      })
      .catch((error) => {
        console.error("Có lỗi khi cập nhật chuyến đi!", error);
        enqueueSnackbar("Lỗi khi cập nhật chuyến đi", { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {trip ? "Chỉnh sửa chuyến đi" : "Thêm chuyến đi"}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
          }}
        >
          <TextField
            label="Số chỗ ngồi trống"
            variant="outlined"
            value={newTrip.seatsAvailable}
            onChange={(e) =>
              setNewTrip({ ...newTrip, seatsAvailable: e.target.value })
            }
            fullWidth
          />

          <TextField
            label="Tổng số chỗ"
            variant="outlined"
            value={newTrip.totalSeats}
            onChange={(e) =>
              setNewTrip({ ...newTrip, totalSeats: e.target.value })
            }
            fullWidth
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Thời gian khởi hành"
              value={
                newTrip.departureTime ? new Date(newTrip.departureTime) : null
              }
              minDateTime={new Date()}
              onChange={(newValue) =>
                setNewTrip({
                  ...newTrip,
                  departureTime: newValue.toISOString(),
                })
              }
              renderInput={(params) => (
                <TextField {...params} fullWidth variant="outlined" />
              )}
            />
          </LocalizationProvider>

          <TextField
            label="ID Người đăng"
            disabled
            variant="outlined"
            value={newTrip.user}
            onChange={(e) => setNewTrip({ ...newTrip, user: e.target.value })}
            fullWidth
          />
        </Box>
      </DialogContent>

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
        <Button
          onClick={handleSubmit}
          sx={{
            borderRadius: "8px",
            backgroundColor: "var(--primary-color)",
            "&:hover": {
              backgroundColor: "var(--hover-color)",
            },
          }}
          variant="contained"
        >
          Cập nhật
        </Button>
      </DialogActions>
      {loading && <Loadding />}
    </Dialog>
  );
}

export default EditTripDialog;
