import { List, ListItem, ListItemText, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import imgLogo from "../../assets/ImgLogo.png";

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
            borderRadius: "10px",
            backgroundColor: isActive("/admin/bus")
              ? "var(--bg-btn)"
              : "transparent",
            "&:hover": {
              backgroundColor: isActive("/admin/bus")
                ? "var(--hover-bg-btn)"
                : "var(light-grey)",
            },
            color: isActive("/admin/bus") ? "var(--primary-color)" : "inherit",
          }}
          button
          onClick={() => handleListItemClick("/admin/bus")}
        >
          <ListItemText primary="Bus Management" />
        </ListItem>
        <ListItem
          sx={{
            mt: 0.5,
            borderRadius: "10px",
            backgroundColor: isActive("/admin/ss")
              ? "var(--bg-btn)"
              : "transparent",
            "&:hover": {
              backgroundColor: "var(--hover-bg-btn)",
            },
            color: isActive("/admin/ss") ? "var(--primary-color)" : "inherit",
          }}
          button
          onClick={() => handleListItemClick("/admin/ss")}
        >
          <ListItemText primary="Bus Management" />
        </ListItem>
        {/* Add more items as needed */}
      </List>
    </Box>
  );
}

export default AdminSidebar;
