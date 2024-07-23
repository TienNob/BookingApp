import {
  Box,
  Typography,
  Container,
  Stack,
  Paper,
  Grid,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import "./home.css";

function HomeStep(params) {
  return (
    <Box sx={{ margin: "90px 0" }}>
      <Container>
        <Stack sx={{ marginBottom: "40px" }} justifyContent="center">
          <Typography
            sx={{
              fontSize: "36px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "14px",
            }}
            variant="h3"
          >
            Nhận Vé Đơn Giản Chỉ Với 3 Bước{" "}
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
            Đặt vé và tận hưỡng chuyến đi chưa bao giờ là dễ dàng đến vậy. Bạn
            chỉ cần cầm tấm vé và tận hưởng chuyển đi tuyệt với của mình thôi!
          </Typography>
        </Stack>
        <Grid container justifyContent="center" spacing={4}>
          <Grid item xs={4}>
            <Paper className="homeStep-card" elevation={1}>
              <Box>
                <Badge
                  className="homeStep-card_icon"
                  badgeContent={1}
                  overlap="circular"
                  color="primary"
                >
                  <SearchIcon />
                </Badge>
              </Box>
              <Typography
                sx={{
                  fontSize: "22px",
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
                variant="h5"
              >
                Tìm kiếm{" "}
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
                Nhập thông tin cần thiết như điểm khởi hành, điểm đến, ngày và
                giờ di chuyển vào ô tìm kiếm. Hệ thống sẽ hiển thị danh sách các
                tuyến xe buýt phù hợp với yêu cầu của bạn. Bạn có thể lọc kết
                quả theo thời gian khởi hành, giá vé, hoặc loại dịch vụ để tìm
                chuyến đi phù hợp nhất.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className="homeStep-card" elevation={1}>
              <Box>
                <Badge
                  className="homeStep-card_icon"
                  badgeContent={2}
                  overlap="circular"
                  color="primary"
                >
                  <ConfirmationNumberOutlinedIcon />
                </Badge>
              </Box>
              <Typography
                sx={{
                  fontSize: "22px",
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
                variant="h5"
              >
                Chọn vé
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
                Chọn chuyến xe buýt cụ thể từ danh sách kết quả. Trong bước này,
                bạn sẽ chọn loại vé, số lượng vé, và có thể chọn thêm các tùy
                chọn khác như ghế ngồi hoặc dịch vụ bổ sung. Xem lại thông tin
                chi tiết về chuyến đi và giá vé trước khi tiếp tục.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className="homeStep-card" elevation={1}>
              <Box>
                <Badge
                  className="homeStep-card_icon"
                  badgeContent={3}
                  overlap="circular"
                  color="primary"
                >
                  <LocalAtmOutlinedIcon />
                </Badge>
              </Box>
              <Typography
                sx={{
                  fontSize: "22px",
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
                variant="h5"
              >
                Thanh toán
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
                Cung cấp thông tin thanh toán để hoàn tất giao dịch. Bạn có thể
                chọn phương thức thanh toán như thẻ tín dụng, thẻ ghi nợ, hoặc
                các phương thức thanh toán trực tuyến khác. Sau khi thanh toán
                thành công, bạn sẽ nhận được xác nhận đặt vé và thông tin chuyến
                đi qua email.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HomeStep;
