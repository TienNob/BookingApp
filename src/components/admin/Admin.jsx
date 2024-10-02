import {
  Box,
  Grid,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNav from "./AdminNav";
import AdminTrips from "./adminTrip/AdminTrips";
import AdminOverview from "./adminOverview/AdminOverview";
import { Routes, Route } from "react-router-dom";

function Admin(params) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AdminNav handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="nav"
        sx={{ width: { md: 250 }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant={isMdUp ? "permanent" : "temporary"}
          open={isMdUp ? true : mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
          }}
        >
          <AdminSidebar />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: "100%", md: `calc(100% - ${250}px)` },
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="trips" element={<AdminTrips />} />
          <Route path="overview" element={<AdminOverview />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default Admin;
