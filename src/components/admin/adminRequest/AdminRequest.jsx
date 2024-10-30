import { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TablePagination,
  Box,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack"; // Import useSnackbar
import ImagePreviewDialog from "../../ImagePreview"; // Import the ImagePreviewDialog

function AdminRequest() {
  const { enqueueSnackbar } = useSnackbar(); // Initialize useSnackbar
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [preview, setPreview] = useState(null); // State for image preview URL

  const fetchRequests = async (status) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/driver-registration`,
        {
          params: { status },
        }
      );
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests", error);
    }
  };

  useEffect(() => {
    fetchRequests(statusFilter);
  }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`http://localhost:8080/api/driver-registration/${id}`, {
        status,
      });

      fetchRequests(statusFilter); // Refresh the list after status update
      enqueueSnackbar(`Yêu cầu đã được phê duyệt`, { variant: "success" });
    } catch (error) {
      console.error("Error updating request status", error);
      enqueueSnackbar("Có lỗi khi phê duyệt", { variant: "error" });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openImagePreview = (imageUrl) => {
    setPreview(imageUrl); // Set preview URL
    setIsPreviewDialogOpen(true); // Open dialog
  };

  return (
    <div>
      <Select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        displayEmpty
      >
        <MenuItem value="pending">Đang chờ</MenuItem>
        <MenuItem value="approved">Chấp nhận</MenuItem>
        <MenuItem value="rejected">Từ chối</MenuItem>
      </Select>

      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "100px" }}>ID Người dùng</TableCell>
              <TableCell sx={{ width: "150px" }}>Kinh nghiệm</TableCell>
              <TableCell sx={{ width: "150px" }}>Hình ảnh</TableCell>
              <TableCell sx={{ width: "100px" }}>Ngày tạo</TableCell>
              <TableCell sx={{ width: "120px" }}>Trạng thái</TableCell>
              <TableCell sx={{ width: "280px" }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.userId}</TableCell>
                  <TableCell>{request.experience}</TableCell>
                  <TableCell>
                    <img
                      src={`http://localhost:8080${request.licenseImage}`}
                      alt="License"
                      style={{
                        width: "50px",
                        height: "auto",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        openImagePreview(
                          `http://localhost:8080${request.licenseImage}`
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(request.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {request.status === "pending"
                      ? "Đang chờ"
                      : request.status === "approved"
                      ? "Chấp nhận"
                      : "Từ chối"}
                  </TableCell>
                  <TableCell>
                    <Button
                      sx={{
                        color:
                          request.status === "pending"
                            ? "var(--primary-color)"
                            : "",
                      }}
                      onClick={() =>
                        handleStatusChange(request._id, "approved")
                      }
                      disabled={request.status !== "pending"}
                    >
                      Chấp nhận
                    </Button>
                    <Button
                      sx={{
                        color: request.status === "pending" ? "var(--red)" : "",
                      }}
                      onClick={() =>
                        handleStatusChange(request._id, "rejected")
                      }
                      disabled={request.status !== "pending"}
                    >
                      Từ chối
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>

      <ImagePreviewDialog
        open={isPreviewDialogOpen}
        imageUrl={preview}
        onClose={() => setIsPreviewDialogOpen(false)}
      />

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={requests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default AdminRequest;
