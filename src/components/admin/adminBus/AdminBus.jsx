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
import busDefault from "../../../assets/busDefault.png";

const columns = (handleEdit, handleDelete) => [
  { field: "index", headerName: "ID", flex: 0.1 },
  {
    field: "nameAndImage",
    headerName: "Xe bus",
    flex: 0.4,
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        <img
          src={params.row.image || busDefault}
          alt="Bus"
          onError={(e) => (e.target.src = busDefault)}
          style={{
            width: "50px",
            height: "auto",
            objectFit: "contain",
            marginRight: "16px",
          }}
        />
        <Typography variant="body2" sx={{ color: "var(--text-color)" }}>
          {params.row.name}
        </Typography>
      </Box>
    ),
  },
  { field: "seats", headerName: "Số chỗ", flex: 0.2 },
  {
    field: "amenities",
    headerName: "Tiện nghi",
    flex: 0.4,
    valueGetter: (params) => {
      const amenities = params;
      if (Array.isArray(amenities)) {
        return amenities.join(", ");
      } else {
        return "N/A";
      }
    },
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

function AdminBus() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newBus, setNewBus] = useState({ name: "", seats: "", amenities: [] });
  const [inputAmenity, setInputAmenity] = useState("");
  const [editingBus, setEditingBus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/buses")
      .then((response) => {
        const dataWithIndex = response.data.map((item, index) => ({
          ...item,
          index: index + 1,
        }));
        setRows(dataWithIndex);
      })
      .catch((error) => {
        console.error("Có lỗi khi lấy dữ liệu!", error);
        enqueueSnackbar("Lỗi khi lấy dữ liệu", { variant: "error" });
      });
  }, [enqueueSnackbar]);

  const handleAddNew = () => {
    setEditingBus(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewBus({ name: "", seats: "", amenities: [] });
    setInputAmenity("");
  };

  const handleSubmit = () => {
    setLoading(true);
    if (editingBus) {
      axios
        .put(`http://localhost:8080/api/buses/${editingBus._id}`, newBus)
        .then((response) => {
          const updatedRows = rows.map((row) =>
            row._id === editingBus._id
              ? { ...newBus, _id: row._id, index: row.index }
              : row
          );
          setRows(updatedRows);
          enqueueSnackbar("Cập nhật xe thành công", { variant: "success" });
          handleCloseDialog();
        })
        .catch((error) => {
          console.error("Có lỗi khi cập nhật xe!", error);
          enqueueSnackbar("Lỗi khi cập nhật xe", { variant: "error" });
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 500);
        });
    } else {
      axios
        .post("http://localhost:8080/api/buses", newBus)
        .then((response) => {
          setRows([
            ...rows,
            { ...newBus, _id: response.data._id, index: rows.length + 1 },
          ]);
          enqueueSnackbar("Thêm xe thành công", { variant: "success" });
          handleCloseDialog();
        })
        .catch((error) => {
          console.error("Có lỗi khi thêm xe!", error);
          enqueueSnackbar("Lỗi khi thêm xe", { variant: "error" });
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 500);
        });
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setNewBus({
      name: bus.name,
      seats: bus.seats,
      amenities: bus.amenities,
      image: bus.image,
    });
    setOpenDialog(true);
  };

  const handleDelete = (bus) => {
    setLoading(true);
    axios
      .delete(`http://localhost:8080/api/buses/${bus._id}`)
      .then(() => {
        setRows(rows.filter((row) => row._id !== bus._id));
        enqueueSnackbar("Xóa xe thành công", { variant: "success" });
      })
      .catch((error) => {
        console.error("Có lỗi khi xóa xe!", error);
        enqueueSnackbar("Lỗi khi xóa xe", { variant: "error" });
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
        axios.delete(`http://localhost:8080/api/buses/${row._id}`)
      )
    )
      .then(() => {
        setRows(rows.filter((row) => !selectedRows.includes(row)));
        setSelectedRows([]);
        enqueueSnackbar("Đã xóa các xe bus được chọn thành công", {
          variant: "success",
        });
      })
      .catch((error) => {
        console.error("Có lỗi khi xóa các xe bus!", error);
        enqueueSnackbar("Lỗi khi xóa các xe bus", { variant: "error" });
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
  };

  const handleAddAmenity = () => {
    if (inputAmenity && !newBus.amenities.includes(inputAmenity)) {
      setNewBus({ ...newBus, amenities: [...newBus.amenities, inputAmenity] });
      setInputAmenity("");
    }
  };

  const handleDeleteAmenity = (amenityToDelete) => {
    setNewBus({
      ...newBus,
      amenities: newBus.amenities.filter(
        (amenity) => amenity !== amenityToDelete
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
        <Typography sx={{ color: "var(--text-color)" }} variant="h5">
          Danh Sách Xe Bus
        </Typography>
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
        </Box>
      </Box>

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          sx={{ color: "var(--text-color)" }}
          rows={rows}
          columns={columns(handleEdit, handleDelete)}
          getRowId={(row) => row._id}
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
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingBus ? "Chỉnh sửa xe" : "Thêm mới xe"}</DialogTitle>
        <DialogContent>
          {newBus.image && (
            <Box sx={{ mt: 2, textAlign: "start" }}>
              <img
                src={newBus.image}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
          <TextField
            margin="dense"
            label="Liên kết hình ảnh"
            type="text"
            fullWidth
            variant="outlined"
            value={newBus.image}
            onChange={(e) => setNewBus({ ...newBus, image: e.target.value })}
          />

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Tên xe"
            type="text"
            fullWidth
            variant="outlined"
            value={newBus.name}
            onChange={(e) => setNewBus({ ...newBus, name: e.target.value })}
          />
          <TextField
            margin="dense"
            id="seats"
            label="Số chỗ"
            type="number"
            fullWidth
            variant="outlined"
            value={newBus.seats}
            onChange={(e) => setNewBus({ ...newBus, seats: e.target.value })}
          />
          <TextField
            margin="dense"
            id="amenity"
            label="Tiện nghi"
            type="text"
            fullWidth
            variant="outlined"
            value={inputAmenity}
            onChange={(e) => setInputAmenity(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleAddAmenity();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleAddAmenity} edge="end">
                    <ControlPointIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ mt: 2 }}>
            {newBus.amenities.map((amenity, index) => (
              <Chip
                key={index}
                label={amenity}
                onDelete={() => handleDeleteAmenity(amenity)}
                sx={{ margin: "4px" }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Huỷ</Button>
          <Button onClick={handleSubmit}>Lưu</Button>
        </DialogActions>
      </Dialog>
      {loading && <Loadding />}
    </Box>
  );
}

export default AdminBus;
