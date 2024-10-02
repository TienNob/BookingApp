import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack";
import Loadding from "../../Loadding";

const columns = (handleEdit, handleDelete) => [
  { field: "index", headerName: "ID", flex: 0.1 },
  {
    field: "locations",
    headerName: "Chuyến đi",
    flex: 0.4,
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        <Typography variant="body2" sx={{ color: "var(--text-color)" }}>
          {params.row.locations[0]} - {params.row.locations[1]}
        </Typography>
      </Box>
    ),
  },
  { field: "seatsAvailable", headerName: "Số chỗ trống", flex: 0.2 },
  {
    field: "totalSeats",
    headerName: "Loại xe (Chỗ)",
    flex: 0.2,
  },
  {
    field: "costPerKm",
    headerName: "Giá mỗi km (VND)",
    flex: 0.2,
  },
  {
    field: "userName",
    headerName: "Người đăng tải",
    flex: 0.2,
  },
  {
    field: "actions",
    type: "actions",
    headerName: "Hành động",
    flex: 0.2,
    renderCell: (params) => (
      <ActionsMenu
        params={params.row}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    ),
  },
];

function ActionsMenu({ params, handleEdit, handleDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { width: "200px" } }}
      >
        <MenuItem
          onClick={() => {
            handleView(params); // Add this to open the view details dialog
            handleClose();
          }}
        >
          <ListItemIcon>
            <ControlPointIcon />
          </ListItemIcon>
          <ListItemText primary="Xem chi tiết" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleEdit(params);
            handleClose();
          }}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="Chỉnh sửa" />
        </MenuItem>
        <MenuItem
          sx={{ color: "var(--red)" }}
          onClick={() => {
            handleDelete(params);
            handleClose();
          }}
        >
          <ListItemIcon>
            <DeleteIcon sx={{ color: "var(--red)" }} />
          </ListItemIcon>
          <ListItemText primary="Xóa" />
        </MenuItem>
      </Menu>
    </>
  );
}

function AdminTrips() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTrip, setNewTrip] = useState({
    locations: [],
    totalSeats: "",
    costPerKm: "",
  });
  const [inputLocation, setInputLocation] = useState("");
  const [editingTrip, setEditingTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const token = localStorage.getItem("token");
  console.log(rows);

  const fetchUserName = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/${userId}`
      );
      return response.data.firstName + " " + response.data.lastName;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng", error);
      return "Người dùng "; // Xử lý lỗi, trả về giá trị mặc định
    }
  };

  useEffect(() => {
    const fetchTripsWithUserNames = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/trips");
        const trips = response.data;

        // Lấy tên của từng người dùng theo ID và gán vào dữ liệu chuyến đi
        const tripsWithUserNames = await Promise.all(
          trips.map(async (trip, index) => {
            const userName = await fetchUserName(trip.user); // Lấy tên người dùng theo ID
            return {
              ...trip,
              index: index + 1,
              userName, // Thêm trường tên người dùng vào mỗi chuyến đi
            };
          })
        );

        setRows(tripsWithUserNames);
      } catch (error) {
        console.error("Có lỗi khi lấy dữ liệu!", error);
        enqueueSnackbar("Lỗi khi lấy dữ liệu", { variant: "error" });
      }
    };

    fetchTripsWithUserNames();
  }, [enqueueSnackbar]);

  const handleAddNew = () => {
    setEditingTrip(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewTrip({ locations: [], totalSeats: "", costPerKm: "" });
    setInputLocation("");
  };

  const handleSubmit = () => {
    setLoading(true);
    console.log(newTrip);

    if (editingTrip) {
      axios
        .put(
          `http://localhost:8080/api/trips/${editingTrip._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          newTrip
        )
        .then((response) => {
          const updatedRows = rows.map((row) =>
            row._id === editingTrip._id
              ? { ...newTrip, _id: row._id, index: row.index }
              : row
          );
          setRows(updatedRows);
          enqueueSnackbar("Cập nhật chuyến đi thành công", {
            variant: "success",
          });
          handleCloseDialog();
        })
        .catch((error) => {
          console.error("Có lỗi khi cập nhật chuyến đi!", error);
          enqueueSnackbar("Lỗi khi cập nhật chuyến đi", { variant: "error" });
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 500);
        });
    } else {
      axios
        .post("http://localhost:8080/api/trips", newTrip, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setRows([
            ...rows,
            { ...newTrip, _id: response.data._id, index: rows.length + 1 },
          ]);
          enqueueSnackbar("Thêm chuyến đi thành công", { variant: "success" });
          handleCloseDialog();
        })
        .catch((error) => {
          console.error("Có lỗi khi thêm chuyến đi!", error);
          enqueueSnackbar("Lỗi khi thêm chuyến đi", { variant: "error" });
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 500);
        });
    }
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setNewTrip({
      locations: trip.locations,
      totalSeats: trip.totalSeats,
      costPerKm: trip.costPerKm,
    });
    setOpenDialog(true);
  };

  const handleDelete = (trip) => {
    setLoading(true);
    axios
      .delete(`http://localhost:8080/api/trips/${trip._id}`)
      .then(() => {
        setRows(rows.filter((row) => row._id !== trip._id));
        enqueueSnackbar("Xóa chuyến đi thành công", { variant: "success" });
      })
      .catch((error) => {
        console.error("Có lỗi khi xóa chuyến đi!", error);
        enqueueSnackbar("Lỗi khi xóa chuyến đi", { variant: "error" });
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;

    setLoading(true);
    Promise.all(
      selectedRows.map((row) =>
        axios.delete(`http://localhost:8080/api/trips/${row._id}`)
      )
    )
      .then(() => {
        setRows(rows.filter((row) => !selectedRows.includes(row)));
        setSelectedRows([]);
        enqueueSnackbar("Đã xóa các chuyến đi được chọn thành công", {
          variant: "success",
        });
      })
      .catch((error) => {
        console.error("Có lỗi khi xóa các chuyến đi!", error);
        enqueueSnackbar("Lỗi khi xóa các chuyến đi", { variant: "error" });
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
  };

  const handleAddLocation = () => {
    if (inputLocation && !newTrip.locations.includes(inputLocation)) {
      setNewTrip({
        ...newTrip,
        locations: [...newTrip.locations, inputLocation],
      });
      setInputLocation("");
    }
  };

  const handleDeleteLocation = (locationToDelete) => {
    setNewTrip({
      ...newTrip,
      locations: newTrip.locations.filter(
        (location) => location !== locationToDelete
      ),
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          mb: 6,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {" "}
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {" "}
          Danh sách chuyến đi{" "}
        </Typography>{" "}
        <Box>
          {selectedRows.length > 0 ? (
            <Button
              sx={{
                py: 1,
                px: 2,
                borderRadius: "8px",
                backgroundColor: "var(--red)",
                "&:hover": {
                  backgroundColor: "var(--dark-red)",
                },
                mr: 2,
              }}
              variant="contained"
              color="error"
              onClick={handleBulkDelete}
            >
              <DeleteIcon sx={{ mr: 1 }} /> Xóa ({selectedRows.length})
            </Button>
          ) : (
            <Button
              sx={{
                py: 1,
                px: 2,
                borderRadius: "8px",
                backgroundColor: "var(--primary-color)",
                "&:hover": {
                  backgroundColor: "var(--hover-color)",
                },
              }}
              variant="contained"
              color="primary"
              onClick={handleAddNew}
            >
              <AddIcon sx={{ mr: 1 }} /> Thêm Mới
            </Button>
          )}
        </Box>{" "}
      </Box>{" "}
      <DataGrid
        sx={{ color: "var(--text-color)" }} // Keep your existing styles
        rows={rows}
        columns={columns(handleEdit, handleDelete)}
        getRowId={(row) => row._id} // Ensure each row uses _id as the unique identifier
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => {
          const selectedIds = newSelection;
          const selectedRows = rows.filter((row) =>
            selectedIds.includes(row._id)
          );
          setSelectedRows(selectedRows);
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 25, 35, 50]}
        localeText={{
          noRowsLabel: "Không có dữ liệu",
          noResultsOverlayLabel: "Không tìm thấy kết quả",
          footerRowSelected: (count) =>
            count !== 1
              ? `${count.toLocaleString()} hàng đã chọn`
              : `${count.toLocaleString()} hàng đã chọn`,
          footerTotalRows: "Tổng số hàng:",
          footerTotalVisibleRows: (visibleCount, totalCount) =>
            `${visibleCount.toLocaleString()} trong số ${totalCount.toLocaleString()}`,
          footerPaginationRowsPerPage: "Số hàng mỗi trang",
          footerPaginationNext: "Trang tiếp",
          footerPaginationPrevious: "Trang trước",
          footerPaginationLabel: (from, to, count) =>
            `${from}–${to} của ${count}`,
        }}
      />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingTrip ? "Chỉnh sửa chuyến đi" : "Thêm chuyến đi"}
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
              label="Số chỗ ngồi"
              variant="outlined"
              value={newTrip.totalSeats}
              onChange={(e) =>
                setNewTrip({ ...newTrip, totalSeats: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Giá mỗi km"
              variant="outlined"
              value={newTrip.costPerKm}
              onChange={(e) =>
                setNewTrip({ ...newTrip, costPerKm: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Địa điểm"
              variant="outlined"
              value={inputLocation}
              onChange={(e) => setInputLocation(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddLocation();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleAddLocation}>
                      <ControlPointIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {newTrip.locations.map((location, index) => (
                <Chip
                  key={index}
                  label={location}
                  onDelete={() => handleDeleteLocation(location)}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    "& .MuiChip-deleteIcon": { color: "#f50057" },
                  }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={
              !newTrip.totalSeats ||
              !newTrip.costPerKm ||
              newTrip.locations.length === 0
            }
          >
            {editingTrip ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
      {loading && <Loadding />}
    </Box>
  );
}

export default AdminTrips;
