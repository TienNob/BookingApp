import { List, ListItem, ListItemText, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import imgLogo from "../../assets/ImgLogo.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CommuteIcon from "@mui/icons-material/Commute";
import PeopleIcon from "@mui/icons-material/People";
function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleListItemClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
        <img src={imgLogo} alt="Logo" width={137} />
      </Box>
      <List sx={{ pr: 1, pl: 1 }}>
        <ListItem
          sx={{
            mb: 0.5,
            borderRadius: "10px",
            backgroundColor: isActive("/admin/overview")
              ? "var(--bg-btn)"
              : "transparent",
            "&:hover": {
              backgroundColor: "var(--hover-bg-btn)",
            },
            color: isActive("/admin/overview")
              ? "var(--primary-color)"
              : "inherit",
          }}
          button
          onClick={() => handleListItemClick("/admin/overview")}
        >
          <DashboardIcon
            sx={{
              mr: 1,
              color: isActive("/admin/overview")
                ? "var(--primary-color)"
                : "var(--grey)",
            }}
          />
          <ListItemText primary="Tổng quan" />
        </ListItem>
        <ListItem
          sx={{
            borderRadius: "10px",
            mb: 0.5,

            backgroundColor: isActive("/admin/trips")
              ? "var(--bg-btn)"
              : "transparent",
            "&:hover": {
              backgroundColor: "var(--hover-bg-btn)",
            },
            color: isActive("/admin/trips")
              ? "var(--primary-color)"
              : "inherit",
          }}
          button
          onClick={() => handleListItemClick("/admin/trips")}
        >
          <CommuteIcon
            sx={{
              mr: 1,
              color: isActive("/admin/trips")
                ? "var(--primary-color)"
                : "var(--grey)",
            }}
          />
          <ListItemText primary="Chuyến đi" />
        </ListItem>
        <ListItem
          sx={{
            borderRadius: "10px",
            backgroundColor: isActive("/admin/users")
              ? "var(--bg-btn)"
              : "transparent",
            "&:hover": {
              backgroundColor: "var(--hover-bg-btn)",
            },
            color: isActive("/admin/users")
              ? "var(--primary-color)"
              : "inherit",
          }}
          button
          onClick={() => handleListItemClick("/admin/users")}
        >
          <PeopleIcon
            sx={{
              mr: 1,
              color: isActive("/admin/users")
                ? "var(--primary-color)"
                : "var(--grey)",
            }}
          />{" "}
          <ListItemText primary="Người dùng" />
        </ListItem>

        {/* Add more items as needed */}
      </List>
    </Box>
  );
}

export default AdminSidebar;
