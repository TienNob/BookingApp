import React, { useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Container,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo.png";

import { useSnackbar } from "notistack";
import Loadding from "../Loadding";
function Login() {
  const { enqueueSnackbar } = useSnackbar();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    let valid = true;

    // Validate phone number
    if (phone.trim() === "") {
      setPhoneError(true);
      enqueueSnackbar("Số điện thoại không được để trống.", {
        variant: "error",
      });
      valid = false;
    } else {
      setPhoneError(false);
    }

    // Validate password
    if (password.trim() === "") {
      setPasswordError(true);
      enqueueSnackbar("Mật khẩu không được để trống.", { variant: "error" });
      valid = false;
    } else {
      setPasswordError(false);
    }

    if (!valid) {
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/auth", {
        phone,
        password,
      });
      console.log("Đăng nhập thành công:", response.data);
      const { firstName, lastName, token, _id } = response.data.data;
      localStorage.setItem("user", JSON.stringify({ firstName, lastName }));
      localStorage.setItem("token", token);
      localStorage.setItem("userId", _id);

      console.log(firstName, lastName);
      enqueueSnackbar("Đăng nhập thành công!", { variant: "success" });
      setTimeout(() => {
        setLoading(false);

        navigate("/");
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error("Đăng nhập thất bại:", error);
      enqueueSnackbar("Đăng nhập thất bại. Vui lòng thử lại.", {
        variant: "error",
      });
    }
  };

  return (
    <Box sx={{ backgroundColor: "#EEF2F6", minHeight: "100vh" }}>
      <Container>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Grid item xs={12} sm={9} md={6} lg={5}>
            <Paper sx={{ padding: "24px" }} elevation={0}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img width="150px" src={logo} alt="logo" />
                <Typography
                  sx={{
                    fontSize: "22px",
                    fontWeight: "600",
                    textAlign: "center",
                    margin: "10px 0",
                    color: "var(--primary-color)",
                  }}
                  variant="h5"
                >
                  Mừng Bạn Trở Lại!{" "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "16px",
                    textAlign: "center",
                    color: "var(--grey)",
                    marginBottom: 4,
                  }}
                  variant="p"
                >
                  Đăng nhập để tiếp tục
                </Typography>
              </Box>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  id="phone"
                  label="Số điện thoại"
                  variant="outlined"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  helperText={
                    phoneError && "Số điện thoại không được để trống."
                  }
                  error={phoneError}
                />
                <TextField
                  sx={{ marginTop: "24px" }}
                  fullWidth
                  id="password"
                  label="Mật khẩu"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText={passwordError && "Mật khẩu không được để trống."}
                  error={passwordError}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 1,
                  }}
                >
                  <FormControlLabel
                    sx={{ fontSize: "14px" }}
                    control={<Checkbox color="default" defaultChecked />}
                    label="Lưu đăng nhập"
                  />
                  <Typography
                    sx={{
                      color: "var(--primary-color)",
                    }}
                    variant="body2"
                  >
                    Quên mật khẩu?
                  </Typography>
                </Box>
                <Button
                  sx={{
                    width: "100%",
                    background: "var(--primary-color)",
                    "&:hover": {
                      backgroundColor: "var(--hover-color)",
                    },
                    marginTop: 2,
                  }}
                  variant="contained"
                  type="submit"
                >
                  Đăng Nhập
                </Button>
                <Box>
                  <Link
                    to={"/signup"}
                    style={{
                      display: "block",
                      fontSize: "14px",
                      textAlign: "center",
                      color: "var(--text-color)",
                      textDecoration: "none",
                      marginTop: "24px",
                      paddingTop: "24px",
                      borderTop: "2px solid var(--light-grey)",
                    }}
                  >
                    Bạn chưa có tài khoản?{" "}
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      {loading && <Loadding />}
    </Box>
  );
}

export default Login;
