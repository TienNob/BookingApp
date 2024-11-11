import { Box, Container, Stack, Typography, Grid, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

function HomeBlog(params) {
  const navigate = useNavigate();
  return (
    <Box sx={{ paddingBottom: "90px" }}>
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
              Diễn Đàn
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
              Chia sẽ chuyến đi thật dễ dàng với một cộng đồng siêu lớn. Ban chỉ
              cần lướt tin tức mới nhất để có những chuyến đi phù hợp với bạn!
            </Typography>
          </Stack>
        </Container>
        <Grid container justifyContent="center" spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card onClick={() => navigate("/forum")} elevation={3}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://images.pexels.com/photos/3826579/pexels-photo-3826579.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: 1,
                      textOverflow: "ellipsis",
                      color: "var(--text-color)",
                      fontWeight: 600,
                    }}
                  >
                    Việc lấy vé xe chỉ là chuyện đơn giản
                  </Typography>
                  <Typography
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: 3,
                      textOverflow: "ellipsis",
                      color: "var(--subtext-color)",
                      marginBottom: 2,
                    }}
                    variant="body2"
                  >
                    Trong quá khứ, việc lấy vé tham gia sự kiện, phim ảnh, hay
                    du lịch cũng đòi hỏi bạn phải đến trực tiếp các điểm bán vé
                    để mua. Điều này có thể gây ra nhiều phiền phức, đặc biệt
                    khi phải xếp hàng chờ đợi hoặc di chuyển đến nhiều nơi. Với
                    vé online, tất cả những gì bạn cần làm là truy cập vào
                    website hoặc ứng dụng, chọn sự kiện hoặc dịch vụ, thanh toán
                    và nhận vé ngay lập tức qua email hoặc mã QR. Điều này không
                    chỉ tiết kiệm thời gian mà còn mang lại sự tiện lợi và linh
                    hoạt cho người sử dụng.
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: 2,
                      color: "var(--subtext-color)",
                      fontSize: "0.875rem",
                      borderTop: "1px solid var(--light-grey)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        alt="Tiến"
                        src="/path/to/avatar.jpg"
                        sx={{
                          width: 24,
                          height: 24,
                          marginRight: 1,
                          bgcolor: "var(--secondary-color)",
                        }}
                      />
                      <Typography variant="body2">Tiến</Typography>
                    </Box>{" "}
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "var(--secondary-color)",
                      }}
                      variant="body2"
                    >
                      <CalendarMonthOutlinedIcon sx={{ marginRight: 1 }} />
                      25/07/2024
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card onClick={() => navigate("/forum")} elevation={3}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://images.pexels.com/photos/3829175/pexels-photo-3829175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: 1,
                      textOverflow: "ellipsis",
                      color: "var(--text-color)",
                      fontWeight: 600,
                    }}
                  >
                    Chúng tôi sẽ phục vụ bạn 24/24{" "}
                  </Typography>
                  <Typography
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: 3,
                      textOverflow: "ellipsis",
                      color: "var(--subtext-color)",
                      marginBottom: 2,
                    }}
                    variant="body2"
                  >
                    Dù bạn gặp vấn đề vào giữa đêm hay cần hỗ trợ vào sáng sớm,
                    đội ngũ nhân viên của chúng tôi luôn sẵn sàng lắng nghe và
                    giúp đỡ bạn. Chúng tôi hiểu rằng không phải lúc nào cũng có
                    thể dự đoán trước được những tình huống cần sự hỗ trợ, vì
                    vậy, chúng tôi cam kết luôn ở bên bạn, bất kể thời gian nào
                    trong ngày.
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: 2,
                      color: "var(--subtext-color)",
                      fontSize: "0.875rem",
                      borderTop: "1px solid var(--light-grey)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        alt="Tiến"
                        src="/path/to/avatar.jpg"
                        sx={{
                          width: 24,
                          height: 24,
                          marginRight: 1,
                          bgcolor: "var(--secondary-color)",
                        }}
                      />
                      <Typography variant="body2">Tiến</Typography>
                    </Box>{" "}
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "var(--secondary-color)",
                      }}
                      variant="body2"
                    >
                      <CalendarMonthOutlinedIcon sx={{ marginRight: 1 }} />
                      25/07/2024
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card onClick={() => navigate("/forum")} elevation={3}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://images.pexels.com/photos/4127635/pexels-photo-4127635.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: 1,
                      textOverflow: "ellipsis",
                      color: "var(--text-color)",
                      fontWeight: 600,
                    }}
                  >
                    Bạn không biết phải đi đâu?
                  </Typography>
                  <Typography
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: 3,
                      textOverflow: "ellipsis",
                      color: "var(--subtext-color)",
                      marginBottom: 2,
                    }}
                    variant="body2"
                  >
                    Mùa hè đến mang theo nắng vàng rực rỡ và thời gian rảnh rỗi,
                    nhưng đôi khi bạn lại không biết đi đâu để tận hưởng khoảng
                    thời gian này một cách trọn vẹn.
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: 2,
                      color: "var(--subtext-color)",
                      fontSize: "0.875rem",
                      borderTop: "1px solid var(--light-grey)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        alt="Tiến"
                        src="/path/to/avatar.jpg"
                        sx={{
                          width: 24,
                          height: 24,
                          marginRight: 1,
                          bgcolor: "var(--secondary-color)",
                        }}
                      />
                      <Typography variant="body2">Tiến</Typography>
                    </Box>{" "}
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "var(--secondary-color)",
                      }}
                      variant="body2"
                    >
                      <CalendarMonthOutlinedIcon sx={{ marginRight: 1 }} />
                      25/07/2024
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
export default HomeBlog;
