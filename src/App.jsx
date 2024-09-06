import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { SnackbarProvider, closeSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";
import Nav from "./components/nav/Nav";
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";
import Login from "./components/user/Login";
import SignUp from "./components/user/SignUp";
import Contact from "./components/contact/Contact";
import Admin from "./components/admin/Admin";
import Forum from "./components/forum/Forum";
import Ticket from "./components/ticket/Ticket";
import TicketDetail from "./components/ticket/TicketDetail";
import ForumProfile from "./components/forum/ForumProfile";
import { Button } from "@mui/material";
import ScrollTop from "./components/ScrollTop";
import ChatBox from "./components/forum/forumLeft/ChatBox";
function App() {
  const location = useLocation();
  const hideHeaderFooter =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname.includes("/admin");
  const hideFooter =
    hideHeaderFooter ||
    location.pathname === "/forum" ||
    location.pathname === "/tickets" ||
    location.pathname === "/chatbox" ||
    location.pathname.startsWith("/forum-profile");

  return (
    <SnackbarProvider
      autoHideDuration={3000}
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      action={(snackbarId) => (
        <Button
          sx={{ color: "#fff" }}
          onClick={() => closeSnackbar(snackbarId)}
        >
          <CloseIcon />
        </Button>
      )}
    >
      <div className="app">
        {!hideHeaderFooter && <Nav />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum-profile/:userId" element={<ForumProfile />} />
          <Route path="/tickets" element={<Ticket />} />
          <Route path="/chatbox" element={<ChatBox />} />
          <Route path="/ticket-detail/:id" element={<TicketDetail />} />
        </Routes>
        {!hideFooter && <Footer />} <ScrollTop />
      </div>
    </SnackbarProvider>
  );
}

export default App;
