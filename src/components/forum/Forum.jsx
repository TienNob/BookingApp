import React from "react";
import { Box, Grid, Container } from "@mui/material";
import ForumMain from "./forumMain/ForumMain";
import ForumLeft from "./forumLeft/ForumLeft";
import ForumRight from "./forumRight/ForumRight";
function Forum() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        pt: "100px",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <Container>
        <Grid container spacing={2} sx={{ width: "100%" }}>
          <Grid item xs={3}>
            <Box
              sx={{
                position: "sticky",
                top: "90px",
                height: "calc(100vh - 90px)", // Để tính toán chiều cao khi cuộn
                width: "250px",
                overflowY: "auto",
                backgroundColor: "var(--bg-sidebar)",
              }}
            >
              <ForumLeft />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <ForumMain />
          </Grid>
          <Grid item xs={3}>
            <Box
              sx={{
                position: "sticky",
                top: 0,
                height: "100vh",
                overflowY: "auto",
                backgroundColor: "var(--bg-sidebar)",
              }}
            >
              <ForumRight />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Forum;
