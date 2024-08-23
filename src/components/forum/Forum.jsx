import React from "react";
import { Box, Grid, Container } from "@mui/material";
import ForumMain from "./forumMain/ForumMain";
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
                top: 0,
                height: "100vh",
                overflowY: "auto",
              }}
            >
              {/* Left fixed content */}
              <Box>Left Fixed Content</Box>
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
              }}
            >
              {/* Right fixed content */}
              <Box>Right Fixed Content</Box>s
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Forum;
