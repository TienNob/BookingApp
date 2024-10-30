import {
  Box,
  Container,
  Stack,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import SendIcon from "@mui/icons-material/Send";
function Contact(params) {
  return (
    <Box
      className="home-banner"
      sx={{
        paddingTop: "170px",
        paddingBottom: "90px",
      }}
    >
      <Container>
        <Container maxWidth="sm">
          <Stack sx={{ marginBottom: "40px" }} justifyContent="center">
            <Typography
              sx={{
                fontSize: "36px",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "14px",
                color: "var(--text-color)",
              }}
              variant="h3"
            >
              Kết Nối Với Chúng Tôi{" "}
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                textAlign: "center",
                color: "var(--subtext-color)",
                lineHeight: "24px",
              }}
              variant="p"
            >
              Chúng tôi luôn lắng nghe ý kiến của bạn
            </Typography>
          </Stack>
        </Container>
        <Grid container justifyContent="center" spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                display: "flex",
                height: "100%",
                p: "30px 25px 15px",
                alignItems: "start",
              }}
              className=" homeAmenities-card"
              elevation={1}
            >
              <Box>
                <PinDropOutlinedIcon
                  sx={{ color: "var(--primary-color)", fontSize: "42px" }}
                />
              </Box>
              <Box sx={{ ml: 3 }}>
                <Typography
                  sx={{
                    fontSize: "20px",
                    color: "var(--text-color)",
                    lineHeight: "24px",
                    mb: 1,
                  }}
                  variant="h5"
                >
                  Địa chỉ
                </Typography>
                <Typography
                  sx={{
                    fontSize: "16px",
                    color: "var(--grey)",
                    lineHeight: "24px",
                  }}
                  variant="p"
                >
                  86/27b, Cách Mạng Tháng 8, Bùi Hữu Nghĩa, Ninh Kiều, Cần Thơ
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                display: "flex",
                height: "100%",
                p: "30px 25px 15px",
                alignItems: "start",
              }}
              className=" homeAmenities-card"
              elevation={1}
            >
              <Box>
                <CallOutlinedIcon
                  sx={{ color: "var(--primary-color)", fontSize: "42px" }}
                />
              </Box>
              <Box sx={{ ml: 3 }}>
                <Typography
                  sx={{
                    fontSize: "20px",
                    color: "var(--text-color)",
                    lineHeight: "24px",
                    mb: 1,
                  }}
                  variant="h5"
                >
                  Điện thoại{" "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "16px",
                    color: "var(--grey)",
                    lineHeight: "24px",
                  }}
                  variant="p"
                >
                  +84 355008377{" "}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                display: "flex",
                height: "100%",
                p: "30px 25px 15px",
                alignItems: "start",
              }}
              className=" homeAmenities-card"
              elevation={1}
            >
              <Box>
                <MailOutlinedIcon
                  sx={{ color: "var(--primary-color)", fontSize: "42px" }}
                />
              </Box>
              <Box sx={{ ml: 3 }}>
                <Typography
                  sx={{
                    fontSize: "20px",
                    color: "var(--text-color)",
                    lineHeight: "24px",
                    mb: 1,
                  }}
                  variant="h5"
                >
                  Email{" "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "16px",
                    color: "var(--grey)",
                    lineHeight: "24px",
                  }}
                  variant="p"
                >
                  nhuttien8377@gmail.com{" "}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Box
          sx={{
            marginTop: "90px",
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ padding: "20px" }} elevation={3}>
                <Typography
                  sx={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "14px",
                    color: "var(--text-color)",
                  }}
                  variant="h4"
                >
                  Bạn có câu hỏi cho chúng tôi ?
                </Typography>
                <Box component="form" noValidate autoComplete="off">
                  <TextField
                    fullWidth
                    label="Tên"
                    variant="outlined"
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Soạn tin"
                    variant="outlined"
                    margin="normal"
                    required
                    multiline
                    rows={4}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      marginTop: "20px",
                      backgroundColor: "var(--primary-color)",
                      "&:hover": { backgroundColor: "var(--hover-color)" },
                    }}
                  >
                    Gửi <SendIcon sx={{ ml: 1 }} />
                  </Button>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.5230725495844!2d105.76821588000873!3d10.05615706440223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a087a9f1bc3569%3A0xbfae9cb29f554cfe!2zODYgxJAuIEPDoWNoIE3huqFuZyBUaMOhbmcgOCwgQ8OhaSBLaOG6vywgQsOsbmggVGjhu6d5LCBD4bqnbiBUaMahIDkwMDAwMCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1722157699740!5m2!1svi!2s"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
export default Contact;
