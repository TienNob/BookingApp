import React from "react";
import { Box } from "@mui/material";
import HomeBanner from "./HomeBanner";
import HomeStep from "./HomeStep";
import HomeAmenities from "./HomeAmenities";
import HomeBlog from "./HomeBlog";
function Home() {
  return (
    <Box>
      <HomeBanner />
      <HomeStep />
      <HomeAmenities />
      <HomeBlog />
    </Box>
  );
}

export default Home;
