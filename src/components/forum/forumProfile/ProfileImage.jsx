import { useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import ImagePreview from "../../ImagePreview";

const ProfileImage = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };
  const handleCloseModalImage = () => {
    setOpenModal(false);
    setSelectedImage("");
  };
  return (
    <Box>
      {images.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          Người dùng này chưa có hình ảnh.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {images.map((image, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Box
                onClick={() =>
                  handleImageClick(`http://localhost:8080${image}`)
                }
                component="img"
                src={`http://localhost:8080${image}`}
                alt={`User Image ${index + 1}`}
                sx={{
                  objectFit: "cover",
                  width: "100%",
                  height: "250px",
                  borderRadius: 1,
                  boxShadow: "0 0 5px rgba(0,0,0,0.15)",
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <ImagePreview
        open={openModal}
        imageUrl={selectedImage}
        onClose={handleCloseModalImage}
      />
    </Box>
  );
};

export default ProfileImage;
