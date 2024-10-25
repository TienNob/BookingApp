import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Container,
} from "@mui/material";
import axios from "axios";
import ReplyIcon from "@mui/icons-material/Reply";
import { useSnackbar } from "notistack"; // Import useSnackbar
import Loadding from "../Loadding";
const TripTable = () => {
  const { id } = useParams(); // Get trip ID from URL
  const [activeStep, setActiveStep] = useState(0); // Track the current step
  const [loading, setLoading] = useState(false);
  const [actor, setActor] = useState("");
  const [locations, setLocations] = useState([]); // Store trip locations
  const [locationsOrigin, setLocationsOrigin] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); // Destructure enqueueSnackbar

  // Fetch the current state of the trip and the locations
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { state, locations, user } = response.data;
        setLocationsOrigin(locations);
        const stepsWithStartAndEnd = [
          "Bắt đầu khởi hành",
          ...locations, // Add the trip locations dynamically
          "Hoàn thành chuyến đi",
        ];
        setLocations(stepsWithStartAndEnd);
        setActor(user);
        // Set activeStep based on the state (2 to 7)
        setActiveStep(state > 1 ? state - 2 : 0);
      })
      .catch((err) => {
        console.error("Error fetching trip data:", err);
      });
  }, [id, token]);

  // Handle the step click and update the trip state
  const handleStepClick = (stepIndex) => {
    setLoading(true);
    let newState;

    // Calculate the state based on the number of locations
    if (locationsOrigin.length === 4) {
      // Case: 4 locationsOrigin -> states will be 2 (start), 3, 4, 5, 6 (for points), 7 (complete)
      newState = stepIndex + 2; // Adjust state to match step index
    } else if (locationsOrigin.length === 3) {
      // Case: 3 locationsOrigin -> states will be 2 (start), 3, 4, 5 (for points), 7 (complete)
      newState = stepIndex + 2;
      if (newState === 6) newState = 7; // Skip state 6 and directly move to 7
    } else if (locationsOrigin.length === 2) {
      // Case: 2 locationsOrigin -> states will be 2 (start), 3, 4 (for points), 7 (complete)
      newState = stepIndex + 2;
      console.log(newState);
      if (newState === 5) newState = 7; // Skip states 5 and 6
      if (newState === 6) newState = 7;
    }

    axios
      .patch(
        `http://localhost:8080/api/trips/${id}/state`,
        { state: newState },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setActiveStep(stepIndex);
        enqueueSnackbar("Cập nhật trạng thái thành công!", {
          variant: "success",
        });
      })
      .catch((error) => {
        console.error("Error updating state:", error);
        enqueueSnackbar("Có lỗi xảy ra!", { variant: "error" }); // Use enqueueSnackbar
      })
      .finally(() => {
        setLoading(false);
      });
  };
  console.log(activeStep, locations.length + 1);

  return (
    <Box
      sx={{
        pt: "100px",
        backgroundColor: "var(--bg-primary)",
        minHeight: "100vh",
      }}
    >
      <Container>
        <Typography mb={4} variant="h6">
          Cập nhật trạng thái di chuyển
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {locations.map((label, index) => (
            <Step key={label}>
              <StepLabel
                onClick={() => handleStepClick(index)} // Handle click on each step
                sx={{
                  cursor: "pointer",
                  "& .MuiStepLabel-label": {
                    color: activeStep >= index ? "green" : "inherit", // Highlight completed steps
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ my: 4, display: "flex", justifyContent: "center" }}>
          <Button
            sx={{
              ml: 1,
              borderRadius: 5,
              px: 2,
              py: 1,
              backgroundColor: "var(--light-grey)",
              "&:hover": {
                backgroundColor: "var(--bg-color)",
              },
              color: "var(--subtext-color)",
            }}
            variant="contained"
            onClick={() => {
              navigate(`/my-trips`);
            }}
          >
            <ReplyIcon /> Trở về
          </Button>
          {userId === actor._id ? (
            <Button
              sx={{
                ml: 1,
                borderRadius: 5,
                px: 3,
                py: 1,
                background: "var(--primary-color)",
                "&:hover": {
                  backgroundColor: "var(--hover-color)",
                },
              }}
              variant="contained"
              onClick={() => handleStepClick(activeStep + 1)}
              disabled={activeStep === locations.length + 1 || loading}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật trạng thái"}
            </Button>
          ) : (
            ""
          )}
        </Box>
      </Container>
      {loading && <Loadding />}
    </Box>
  );
};

export default TripTable;
