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
import MyTicket from "./components/ticket/MyTicket";
import MyTrip from "./components/ticket/MyTrip";
import TicketDetail from "./components/ticket/TicketDetail";
import ForumProfile from "./components/forum/forumProfile/ForumProfile";
import { Button } from "@mui/material";
import ScrollTop from "./components/ScrollTop";
import ChatBox from "./components/forum/forumLeft/ChatBox";
import TripTable from "./components/ticket/TripTable";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const hideHeaderFooter =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname.includes("/admin");
  const hideFooter =
    hideHeaderFooter ||
    location.pathname === "/forum" ||
    location.pathname === "/my-tickets" ||
    location.pathname === "/my-trips" ||
    location.pathname === "/tickets" ||
    location.pathname.startsWith("/ticket-detail") ||
    location.pathname.startsWith("/trip-table") ||
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
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Admin />
              </ProtectedRoute>
            }
          />{" "}
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum-profile/:userId" element={<ForumProfile />} />
          <Route path="/tickets" element={<Ticket />} />
          <Route path="/my-tickets" element={<MyTicket />} />
          <Route path="/my-trips" element={<MyTrip />} />
          <Route path="/chatbox" element={<ChatBox />} />
          <Route path="/ticket-detail/:id" element={<TicketDetail />} />
          <Route path="/trip-table/:id" element={<TripTable />} />
        </Routes>
        {!hideFooter && <Footer />} <ScrollTop />
      </div>
    </SnackbarProvider>
  );
}

export default App;
