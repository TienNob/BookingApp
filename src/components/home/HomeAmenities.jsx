import { Box, Container, Stack, Typography, Grid, Paper } from "@mui/material";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PaymentsIcon from "@mui/icons-material/Payments";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
function HomeAmenities(params) {
  return (
    <Box sx={{ paddingBottom: "90px" }}>
      <Container maxWidth="md">
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
              Những Tiện Nghi Của Chúng Tôi
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
        </Container>
        <Grid container justifyContent="center" spacing={4}>
          <Grid item xs={6} sm={3}>
            <Paper className="homeStep-card homeAmenities-card" elevation={1}>
              <Box>
                <ConnectWithoutContactIcon
                  className="homeAmenities-card_icon"
                  sx={{
                    fontSize: "80px",
                    color: "var(--grey)",
                    paddingBottom: 2,
                    borderBottom: "2px solid var(--grey)",
                  }}
                />
              </Box>
              <Typography
                className="homeAmenities-card_text"
                sx={{
                  fontSize: "16px",
                  textAlign: "center",
                  color: "var(--grey)",
                  lineHeight: "24px",
                  marginTop: 2,
                }}
                variant="p"
              >
                Cộng đồng rộng lớn
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className="homeStep-card homeAmenities-card" elevation={1}>
              <Box>
                <GroupAddIcon
                  sx={{
                    fontSize: "80px",
                    color: "var(--grey)",
                    paddingBottom: 2,
                    borderBottom: "2px solid var(--grey)",
                  }}
                  className="homeAmenities-card_icon"
                />
              </Box>
              <Typography
                sx={{
                  fontSize: "16px",
                  textAlign: "center",
                  color: "var(--grey)",
                  lineHeight: "24px",
                  marginTop: 2,
                }}
                variant="p"
                className="homeAmenities-card_text"
              >
                Thêm bạn thêm vui
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className="homeStep-card homeAmenities-card" elevation={1}>
              <Box>
                <PaymentsIcon
                  sx={{
                    fontSize: "80px",
                    color: "var(--grey)",
                    paddingBottom: 2,
                    borderBottom: "2px solid var(--grey)",
                  }}
                  className="homeAmenities-card_icon"
                />
              </Box>
              <Typography
                sx={{
                  fontSize: "16px",
                  textAlign: "center",
                  color: "var(--grey)",
                  lineHeight: "24px",
                  marginTop: 2,
                }}
                variant="p"
                className="homeAmenities-card_text"
              >
                Thanh toán nhanh chống
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className="homeStep-card homeAmenities-card" elevation={1}>
              <Box>
                <QueryStatsIcon
                  sx={{
                    fontSize: "80px",
                    color: "var(--grey)",
                    paddingBottom: 2,
                    borderBottom: "2px solid var(--grey)",
                  }}
                  className="homeAmenities-card_icon"
                />
              </Box>
              <Typography
                sx={{
                  fontSize: "16px",
                  textAlign: "center",
                  color: "var(--grey)",
                  lineHeight: "24px",
                  marginTop: 2,
                }}
                variant="p"
                className="homeAmenities-card_text"
              >
                Tìm kiếm dễ dàng
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
export default HomeAmenities;
