import React from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ImagePreviewDialog = ({ open, imageUrl, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose} // This will close the modal when clicking outside the image
      fullScreen
      PaperProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.8)", padding: "0" },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose} // Close button inside the dialog
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          color: "#fff",
          zIndex: 1,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: "0 !important",
        }}
        onClick={onClose}
      >
        <img
          src={imageUrl}
          alt="Preview"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
