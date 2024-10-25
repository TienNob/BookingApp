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
        overflow: "visible", // Ensure scrolling behavior is not restricted
      }}
    >
      <Container sx={{ padding: { xs: "0 16px", md: "0" } }}>
        {" "}
        {/* Add padding for smaller screens */}
        <Grid container spacing={2} sx={{ width: "100%" }}>
          {/* Left Sidebar */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: { xs: "none", md: "block" }, // Hide on small screens
            }}
          >
            <Box
              sx={{
                position: "fixed", // Fix it to the screen
                top: "100px", // Distance from the top of the screen
                left: 0, // Align to the left
                width: "25%", // Set a fixed width for the sidebar
                height: "calc(100vh - 100px)", // Full height minus the top offset
                overflowY: "auto", // Scroll within the sidebar if content is longer
                backgroundColor: "var(--bg-sidebar)", // Sidebar styling
                paddingLeft: "32px", // Space between the sidebar and the main content
                paddingRight: "16px", // Space between the sidebar and the main content
              }}
            >
              <ForumLeft />
            </Box>
          </Grid>

          {/* Main Content */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              marginLeft: { md: "25%" }, // Align with left sidebar
              marginRight: { md: "25%" }, // Align with right sidebar
              padding: { xs: "0", md: "0 16px" }, // Padding for main content on smaller screens
            }}
          >
            <ForumMain />
          </Grid>

          {/* Right Sidebar */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: { xs: "none", md: "block" }, // Hide on small screens
            }}
          >
            <Box
              sx={{
                position: "fixed", // Fix it to the screen
                top: "100px", // Distance from the top of the screen
                right: 0, // Align to the right
                width: "26%", // Set a fixed width for the sidebar
                height: "calc(100vh - 100px)", // Full height minus the top offset
                overflowY: "auto", // Scroll within the sidebar if content is longer
                backgroundColor: "var(--bg-sidebar)", // Sidebar styling
                paddingRight: "32px", // Space between the sidebar and the main content
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
