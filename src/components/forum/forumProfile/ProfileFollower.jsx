import React from "react";
import {
  Grid,
  Card,
  CardActionArea,
  Avatar,
  Typography,
  CardContent,
} from "@mui/material";

const ProfileFollower = ({ followers, handleViewProfile }) => {
  return (
    <Grid container spacing={2} mt={1}>
      {followers.map((follower) => (
        <Grid item xs={4} md={3} lg={3} key={follower._id}>
          <Card onClick={() => handleViewProfile(follower._id)}>
            <CardActionArea>
              <Avatar
                sx={{ width: "100%", height: 140, borderRadius: 0 }}
                alt={`${follower.firstName} ${follower.lastName}`}
                src={
                  follower.avatar
                    ? `http://localhost:8080${follower.avatar}`
                    : undefined
                }
              />
              <CardContent>
                <Typography variant="p" component="div" align="center">
                  {follower.firstName} {follower.lastName}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProfileFollower;
