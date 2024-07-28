import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import imgLogo from "../../assets/ImgLogo.png";

const pages = ["Trang chủ", "Đặt vé", "Liên hệ", "Tin Tức"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [activePage, setActivePage] = useState(pages[0]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleOpenNavMenu = () => {
    setDrawerOpen(true);
  };

  const handleCloseNavMenu = () => {
    setDrawerOpen(false);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handlePageClick = (page) => {
    setActivePage(page);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    setAnchorElUser(null);
    navigate("/login");
  };
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff",
        boxShadow:
          "0px 0 0 -0 rgba(0,0,0,0.2),0px 0 0 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
      }}
    >
      <Container>
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1, mr: 1 }}>
            <img src={imgLogo} width={137} />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="var(--text-color)"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={handleCloseNavMenu}
            >
              <Box
                sx={{ width: 250, flexGrow: 1 }}
                role="presentation"
                onClick={handleCloseNavMenu}
                onKeyDown={handleCloseNavMenu}
              >
                <List>
                  {pages.map((page) => (
                    <ListItem
                      button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      sx={{
                        my: 2,
                        display: "block",
                        color:
                          activePage === page
                            ? "var(--primary-color)"
                            : "var(--text-color)",
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{ color: "inherit" }}>
                            {page}
                          </Typography>
                        }
                      />{" "}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, flexGrow: 1 }}>
            <img src={imgLogo} width={137} />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handlePageClick(page)}
                sx={{
                  my: 2,
                  mr: 2,
                  display: "block",
                  color:
                    activePage === page
                      ? "var(--primary-color)"
                      : "var(--text-color)",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      sx={{ bgcolor: "var(--secondary-color)" }}
                      alt={user.firstName}
                      src={"/static/images/avatar/2.jpg"}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                        padding: "4px 14px 4px 4px",
                      }}
                    >
                      <PermIdentityIcon sx={{ mr: 1 }} /> {user.firstName}{" "}
                      {user.lastName}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                        padding: "4px 14px 4px 4px",
                        color: "var(--red)",
                      }}
                    >
                      <LogoutIcon sx={{ mr: 1 }} />
                      Đăng xuất
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar src={""} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleLogout}>
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                        padding: "4px 14px 4px 4px",
                        color: "var(--hover-color)",
                      }}
                    >
                      <LoginIcon sx={{ mr: 1 }} />
                      Đăng nhập
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Nav;
