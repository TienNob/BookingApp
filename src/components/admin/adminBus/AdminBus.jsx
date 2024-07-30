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
  CircularProgress, // Import CircularProgress
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useSnackbar } from "notistack";
import Loadding from "../../Loadding"; // Import your Loadding component

const columns = (handleEdit, handleDelete) => [
  { field: "index", headerName: "ID", flex: 0.1 },
  { field: "name", headerName: "Tên xe", flex: 0.3 },
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
          onClick={() => {
            handleDelete(params);
            handleClose();
          }}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Xóa" />
        </MenuItem>
      </Menu>
    </>
  );
}

function AdminBus() {
  const { enqueueSnackbar } = useSnackbar(); // Initialize snackbar
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newBus, setNewBus] = useState({ name: "", seats: "", amenities: [] });
  const [inputAmenity, setInputAmenity] = useState("");
  const [editingBus, setEditingBus] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    setLoading(true);
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
        console.error("There was an error fetching the data!", error);
        enqueueSnackbar("Error fetching data", { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
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
          enqueueSnackbar("Bus updated successfully", { variant: "success" });
          handleCloseDialog();
        })
        .catch((error) => {
          console.error("There was an error updating the bus!", error);
          enqueueSnackbar("Error updating bus", { variant: "error" });
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
          enqueueSnackbar("Bus added successfully", { variant: "success" });
          handleCloseDialog();
        })
        .catch((error) => {
          console.error("There was an error adding the bus!", error);
          enqueueSnackbar("Error adding bus", { variant: "error" });
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
    setNewBus({ name: bus.name, seats: bus.seats, amenities: bus.amenities });
    setOpenDialog(true);
  };

  const handleDelete = (bus) => {
    setLoading(true); // Start loading
    axios
      .delete(`http://localhost:8080/api/buses/${bus._id}`)
      .then(() => {
        setRows(rows.filter((row) => row._id !== bus._id));
        enqueueSnackbar("Bus deleted successfully", { variant: "success" });
      })
      .catch((error) => {
        console.error("There was an error deleting the bus!", error);
        enqueueSnackbar("Error deleting bus", { variant: "error" });
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
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Danh Sách Xe</Typography>
        <Button variant="contained" color="primary" onClick={handleAddNew}>
          Thêm Mới
        </Button>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns(handleEdit, handleDelete)}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.index}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingBus ? "Chỉnh sửa xe" : "Thêm mới xe"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Tên xe"
            type="text"
            fullWidth
            variant="standard"
            value={newBus.name}
            onChange={(e) => setNewBus({ ...newBus, name: e.target.value })}
          />
          <TextField
            margin="dense"
            id="seats"
            label="Số chỗ"
            type="number"
            fullWidth
            variant="standard"
            value={newBus.seats}
            onChange={(e) => setNewBus({ ...newBus, seats: e.target.value })}
          />
          <TextField
            margin="dense"
            id="amenity"
            label="Tiện nghi"
            type="text"
            fullWidth
            variant="standard"
            value={inputAmenity}
            onChange={(e) => setInputAmenity(e.target.value)}
            onKeyDown={(e) => {
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
