import { Box, Container, Stack, Typography, Grid, Paper } from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
function HomeAmenities(params) {
  return (
    <Box sx={{ paddingBottom: "90px" }}>
      <Container maxWidth="md">
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
        <Grid container justifyContent="center" spacing={4}>
          <Grid item xs={3}>
            <Paper className="homeStep-card homeAmenities-card" elevation={1}>
              <Box>
                <WifiIcon
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
                Wifi
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className="homeStep-card homeAmenities-card" elevation={1}>
              <Box>
                <BedOutlinedIcon
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
                Giường Nằm
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className="homeStep-card homeAmenities-card" elevation={1}>
              <Box>
                <LocalDrinkOutlinedIcon
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
                Nước Uống
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className="homeStep-card homeAmenities-card" elevation={1}>
              <Box>
                <HeadphonesOutlinedIcon
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
                Nhạc
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
export default HomeAmenities;
