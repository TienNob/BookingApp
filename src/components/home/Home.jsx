import React from "react";
import { Box } from "@mui/material";
import HomeBanner from "./HomeBanner";
import HomeStep from "./HomeStep";
import HomeAmenities from "./HomeAmenities";
function Home() {
  return (
    <Box>
      <HomeBanner />
      <HomeStep />
      <HomeAmenities />
    </Box>
  );
}

export default Home;
