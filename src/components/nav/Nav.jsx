import { useState } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
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

const pages = [
  { name: "Trang chủ", path: "/" },
  { name: "Đặt vé", path: "/tickets" },
  { name: "Liên hệ", path: "/contact" },
  { name: "Diễn đàn", path: "/forum" },
];

function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [activePage, setActivePage] = useState(pages[0].name);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const location = useLocation();

  console.log(activePage);
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
    setActivePage(page.name);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAnchorElUser(null);
    navigate("/login");
  };
  const handleViewProfile = () => {
    navigate(`/forum-profile/${userId}`);
    handleCloseUserMenu();
  };

  return (
    <AppBar
      position="fixed"
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
                      key={page.name}
                      component={RouterLink}
                      to={page.path}
                      onClick={() => handlePageClick(page)}
                      sx={{
                        my: 2,
                        display: "block",
                        color:
                          location.pathname === page.path
                            ? "var(--primary-color)"
                            : "var(--text-color)",
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{ color: "inherit" }}>
                            {page.name}
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
                key={page.name}
                component={RouterLink}
                to={page.path}
                onClick={() => handlePageClick(page)}
                sx={{
                  my: 2,
                  mr: 2,
                  display: "block",
                  color:
                    location.pathname === page.path
                      ? "var(--primary-color)"
                      : "var(--text-color)",
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      border: "1px solid var(--bg-primary)",
                    }}
                    src={`http://localhost:8080${user.avatar}` || ""}
                  />
                </IconButton>
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
                  <MenuItem onClick={handleViewProfile}>
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
                  <MenuItem
                    onClick={() => {
                      navigate(`/chatbox`);
                    }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                        padding: "4px 14px 4px 4px",
                      }}
                    >
                      <ChatBubbleOutlineIcon sx={{ mr: 1 }} /> Tin nhắn
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
