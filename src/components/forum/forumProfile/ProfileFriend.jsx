import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  CardActionArea,
} from "@mui/material";

const ProfileFriend = ({ friends, onViewProfile }) => {
  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Grid container spacing={2} mt={1}>
          {friends.map((friend) => (
            <Grid item xs={4} md={3} lg={3} key={friend._id}>
              <Card onClick={() => onViewProfile(friend._id)}>
                <CardActionArea>
                  <Avatar
                    sx={{ width: "100%", height: 200, borderRadius: 0 }}
                    alt={`${friend.firstName} ${friend.lastName}`}
                    src={
                      friend.avatar
                        ? `http://localhost:8080${friend.avatar}`
                        : undefined
                    }
                  />
                  <CardContent>
                    <Typography variant="p" component="div" align="center">
                      {friend.firstName} {friend.lastName}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProfileFriend;
