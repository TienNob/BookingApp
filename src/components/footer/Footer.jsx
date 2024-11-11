import { Box, Container, Grid, Typography, Link, Divider } from "@mui/material";
import logo from "../../assets/ImgLogo.png";
import footerBg from "../../assets/footer.png";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import "./footer.css";
function Footer() {
  return (
    <Box
      sx={{
        backgroundImage: `url(${footerBg})`,
        color: "var(--subtext-color)",
        padding: "60px 0",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: "220px",
              }}
            />
            <Typography variant="body2" sx={{ fontSize: "16px" }}>
              Đặt vé và tận hưỡng chuyến đi chưa bao giờ là dễ dàng đến vậy. Bạn
              chỉ cần cầm tấm vé và tận hưởng chuyển đi tuyệt với của mình thôi!
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Link
                className="footer-icon_socal"
                href="https://x.com/?lang=vi&mx=2"
              >
                <TwitterIcon />
              </Link>
              <Link
                className="footer-icon_socal"
                href="https://x.com/?lang=vi&mx=2"
              >
                <TelegramIcon />
              </Link>
              <Link
                className="footer-icon_socal"
                href="https://x.com/?lang=vi&mx=2"
              >
                <InstagramIcon />
              </Link>
              <Link
                className="footer-icon_socal"
                href="https://x.com/?lang=vi&mx=2"
              >
                <FacebookIcon />
              </Link>
            </Box>
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography variant="h5" sx={{ mb: 2 }} gutterBottom>
              Liên kết
            </Typography>
            <Link
              className="footer-link"
              href="#"
              color="inherit"
              variant="body2"
            >
              <ArrowRightOutlinedIcon /> Trang chủ
            </Link>
            <Link
              className="footer-link"
              href="/tickets"
              color="inherit"
              variant="body2"
            >
              <ArrowRightOutlinedIcon /> Đặt vé
            </Link>
            <Link
              className="footer-link"
              href="#forum"
              color="inherit"
              variant="body2"
            >
              <ArrowRightOutlinedIcon /> Diễn đàn
            </Link>
            <Link
              className="footer-link"
              href="/contact"
              color="inherit"
              variant="body2"
            >
              <ArrowRightOutlinedIcon /> Liên hệ
            </Link>
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography variant="h5" sx={{ mb: 2 }} gutterBottom>
              Liên hệ
            </Typography>
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                fontSize: "16px",
                alignItems: "center",
                mb: 1,
              }}
            >
              <EmailOutlinedIcon sx={{ mr: 1, color: "var(--hover-color)" }} />{" "}
              Email: nhuttien8377@gmail.com
            </Typography>
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                fontSize: "16px",
                alignItems: "center",
                mb: 1,
              }}
            >
              {" "}
              <LocalPhoneOutlinedIcon
                sx={{ mr: 1, color: "var(--hover-color)" }}
              />
              Điện thoại: 0355008377
            </Typography>
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                fontSize: "16px",
                alignItems: "center",
                mb: 1,
              }}
            >
              <FmdGoodOutlinedIcon
                sx={{ mr: 1, color: "var(--hover-color)" }}
              />{" "}
              Địa chỉ: 86/27b, Cách Mạng Tháng 8, Bùi Hữu Nghĩa, Ninh Kiều, Cần
              Thơ
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Footer;
