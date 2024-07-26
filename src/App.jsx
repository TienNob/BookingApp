import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { SnackbarProvider, closeSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";
import Nav from "./components/nav/Nav";
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";
import Login from "./components/user/Login";
import SignUp from "./components/user/SignUp";
import { Button } from "@mui/material";

function App() {
  const location = useLocation();
  const hideHeaderFooter =
    location.pathname === "/login" || location.pathname === "/signup";

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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        {!hideHeaderFooter && <Footer />}
      </div>
    </SnackbarProvider>
  );
}

export default App;
