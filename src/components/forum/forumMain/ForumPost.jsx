import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Autocomplete,
  Grid,
} from "@mui/material";
import axios from "axios";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import DirectionsIcon from "@mui/icons-material/Directions";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useSnackbar } from "notistack";
import Loadding from "../../Loadding";

function ForumPost({ open, handleClose }) {
  const [postContent, setPostContent] = useState("");
  const [user, setUser] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tripSteps, setTripSteps] = useState([{}]); // Initialize with one empty step object
  const [availableSeats, setAvailableSeats] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCommune, setSelectedCommune] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [costPerKm, setCostPerKm] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [departureTime, setDepartureTime] = useState(null); // State for date-time picker
  const [totalSeats, setTotalSeats] = useState(null);
  const userId = localStorage.getItem("userId");

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://esgoo.net/api-tinhthanh/1/0.htm"
        );
        setProvinces(response.data.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts based on selected province
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(
            `https://esgoo.net/api-tinhthanh/2/${selectedProvince.id}.htm`
          );
          setDistricts(response.data.data);
          setSelectedDistrict(null); // Clear selected district
          setCommunes([]); // Clear communes as well
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]); // Clear districts if no province is selected
    }
  }, [selectedProvince]);

  // Fetch communes based on selected district
  useEffect(() => {
    if (selectedDistrict) {
      const fetchCommunes = async () => {
        try {
          const response = await axios.get(
            `https://esgoo.net/api-tinhthanh/3/${selectedDistrict.id}.htm`
          );
          setCommunes(response.data.data);
        } catch (error) {
          console.error("Error fetching communes:", error);
        }
      };
      fetchCommunes();
    } else {
      setCommunes([]); // Clear communes if no district is selected
    }
  }, [selectedDistrict]);

  const calculateCost = async (tripSteps, costPerKm) => {
    try {
      // Helper function to get coordinates from a trip step
      const getCoordinates = (step) => {
        if (step.commune && step.commune.latitude && step.commune.longitude) {
          return {
            latitude: step.commune.latitude,
            longitude: step.commune.longitude,
          };
        }
        if (
          step.district &&
          step.district.latitude &&
          step.district.longitude
        ) {
          return {
            latitude: step.district.latitude,
            longitude: step.district.longitude,
          };
        }
        if (
          step.province &&
          step.province.latitude &&
          step.province.longitude
        ) {
          return {
            latitude: step.province.latitude,
            longitude: step.province.longitude,
          };
        }
        return { latitude: null, longitude: null };
      };

      // Extract coordinates from trip steps
      const coordinates = tripSteps
        .map(getCoordinates)
        .filter((coord) => coord.latitude && coord.longitude);

      console.log(coordinates);
      if (coordinates.length < 2) {
        console.error("Insufficient coordinates for distance calculation");
        return 0;
      }

      // Helper function to get distance and duration between two coordinates
      const getDistanceAndDuration = async (origin, destination) => {
        try {
          const response = await axios.get(
            `https://router.hereapi.com/v8/routes?transportMode=car&origin=${origin}&destination=${destination}&return=summary&apiKey=DUi4_fy4Uw4c8MONR4XMEFgT7njEAZ0f9hsARG1WNIU`
          );

          if (response.data.routes && response.data.routes.length > 0) {
            const section = response.data.routes[0].sections[0];
            if (section && section.summary) {
              return {
                distance: section.summary.length / 1000, // Convert to kilometers
                duration: section.summary.duration / 60, // Convert to minutes
              };
            } else {
              console.error("Invalid section summary in response");
              return { distance: 0, duration: 0 };
            }
          } else {
            console.error("No routes found in response");
            return { distance: 0, duration: 0 };
          }
        } catch (error) {
          console.error("Error fetching distance data:", error);
          return { distance: 0, duration: 0 };
        }
      };

      let totalCost = [];

      // Iterate over each pair of coordinates
      for (let i = 0; i < coordinates.length; i++) {
        for (let j = i + 1; j < coordinates.length; j++) {
          const origin = `${coordinates[i].latitude},${coordinates[i].longitude}`;
          const destination = `${coordinates[j].latitude},${coordinates[j].longitude}`;
          const { distance } = await getDistanceAndDuration(
            origin,
            destination
          );
          const cost = distance * costPerKm;
          totalCost.push(cost);
        }
      }

      console.log(`Total Cost: $${totalCost}`);
      return totalCost;
    } catch (error) {
      console.error("Error calculating cost:", error);
      return 0;
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (!postContent.trim()) {
      enqueueSnackbar("Nội dung bài viết không được để trống", {
        variant: "error",
      });
      return;
    }

    if (showTripDetails) {
      if (!availableSeats || !costPerKm || !departureTime || !totalSeats) {
        enqueueSnackbar("Vui lòng nhập đầy đủ thông tin chuyến đi", {
          variant: "error",
        });
        return;
      }
      if (tripSteps.length === 1) {
        enqueueSnackbar("Phải có ít nhất 2 điểm trong chuyến đi", {
          variant: "error",
        });
        return;
      }

      if (parseInt(availableSeats) > parseInt(totalSeats)) {
        enqueueSnackbar("số ghế trống không được lớn hơn tổng số ghế", {
          variant: "error",
        });
        return;
      }
    }

    try {
      let tripId = null;

      if (showTripDetails) {
        // Calculate total cost
        const totalCost = await calculateCost(tripSteps, costPerKm);

        // Prepare trip data
        const tripData = {
          locations: tripSteps.map((step) => {
            const { commune, district, province } = step;

            // Combine names into a single string
            return [
              commune ? commune.name : "",
              district ? district.name : "",
              province ? province.name : "",
            ]
              .filter((name) => name)
              .join(", "); // Join names with a comma
          }),
          costPerKm: costPerKm,
          prices: totalCost,
          seatsAvailable: availableSeats,
          totalSeats: totalSeats,
          departureTime: departureTime.toISOString(),
          userId: userId,
        };

        // Post the trip data first
        const tripResponse = await axios.post(
          "http://localhost:8080/api/trips",
          tripData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (tripResponse.status === 201) {
          tripId = tripResponse.data._id;
        } else {
          enqueueSnackbar("Đăng chuyến đi thất bại", { variant: "error" });
          return;
        }
      }

      // Prepare post data
      const formData = new FormData();
      formData.append("postContent", postContent);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (tripId) {
        formData.append("trip", tripId);
      }

      // Post the main post data
      const postResponse = await axios.post(
        "http://localhost:8080/api/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (postResponse.status === 201) {
        enqueueSnackbar("Bài viết đã được đăng thành công", {
          variant: "success",
        });

        window.addEventListener("beforeunload", () => {
          setLoading(true);
        });

        // Reset form
        setPostContent("");
        setImageFile(null);
        setTripSteps([{}]);
        setAvailableSeats("");
        setActiveStep(0);
        setDepartureTime(null);
        setTotalSeats(null);
        setShowImageInput(false);
        setShowTripDetails(false);
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSelectedCommune(null);
        handleClose();
        window.location.reload();
      } else {
        enqueueSnackbar("Đăng bài viết thất bại", { variant: "error" });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setLoading(false);
      enqueueSnackbar("Đã xảy ra lỗi trong quá trình xử lý", {
        variant: "error",
      });
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleTripStepChange = (index, field, value) => {
    const updatedSteps = [...tripSteps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [field]: value,
      latitude: value?.latitude || updatedSteps[index].latitude, // Include lat
      longitude: value?.longitude || updatedSteps[index].longitude, // Include lng
    };
    setTripSteps(updatedSteps);
  };

  const handleAddStep = () => {
    setTripSteps([...tripSteps, {}]);
    setActiveStep(tripSteps.length); // Set active step to new step
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/users/${userId}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data.");
      });
  }, [userId]);
  const handleShowTripDetail = () => {
    if (user.cccd === undefined || user.cccd === "") {
      enqueueSnackbar(
        "Vui lòng cập nhật thông tin CCCD trước khi tạo chuyến đi!",
        {
          variant: "warning",
        }
      );
    } else {
      setShowTripDetails(!showTripDetails);
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Tạo bài viết mới</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          sx={{ mt: 2 }}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Viết những gì bạn muốn"
          required
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        <Box mt={2} display="flex">
          <Button
            sx={{
              borderRadius: "8px",
              backgroundColor: showImageInput ? "var(--primary-color)" : "#fff",
              border: showImageInput
                ? "none"
                : `1px solid var(--primary-color)`,
              color: showImageInput ? "#fff" : "var(--primary-color)",
              "&:hover": {
                backgroundColor: showImageInput
                  ? "var(--hover-color)"
                  : "var(--hover-color-light)",
                border: showImageInput
                  ? "none"
                  : `1px solid var(--hover-color)`,
              },
            }}
            variant={showImageInput ? "contained" : "outlined"}
            startIcon={<ImageIcon />}
            onClick={() => setShowImageInput(!showImageInput)}
          >
            Thêm hình ảnh
          </Button>
          <Button
            sx={{
              ml: 2,
              borderRadius: "8px",
              backgroundColor: showTripDetails
                ? "var(--primary-color)"
                : "#fff",
              border: showTripDetails
                ? "none"
                : `1px solid var(--primary-color)`,
              color: showTripDetails ? "#fff" : "var(--primary-color)",
              "&:hover": {
                backgroundColor: showTripDetails
                  ? "var(--hover-color)"
                  : "var(--hover-color-light)",
                border: showTripDetails
                  ? "none"
                  : `1px solid var(--hover-color)`,
              },
            }}
            variant={showTripDetails ? "contained" : "outlined"}
            startIcon={<DirectionsIcon />}
            onClick={handleShowTripDetail}
          >
            Thêm chuyến đi
          </Button>
        </Box>
        {showImageInput && (
          <Box mt={2}>
            <Button
              sx={{
                borderRadius: "8px",
                backgroundColor: "var(--primary-color)",
                "&:hover": {
                  backgroundColor: "var(--hover-color)",
                },
              }}
              variant="contained"
              component="label"
            >
              <FileUploadIcon />
              Chọn hình ảnh từ file
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
            {imageFile && (
              <Box mt={2} textAlign="center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}
          </Box>
        )}
        {showTripDetails && (
          <Box mt={2}>
            <Grid mt={2} container spacing={2} mb={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Số chỗ trống"
                  variant="outlined"
                  value={availableSeats}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value < 0) {
                      setAvailableSeats(0);
                    } else {
                      setAvailableSeats(value);
                    }
                  }}
                  error={availableSeats < 0}
                  helperText={
                    availableSeats < 0 ? "Số chỗ trống không thể nhỏ hơn 0" : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Tổng số ghế"
                  variant="outlined"
                  value={totalSeats}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value < 0) {
                      setTotalSeats(0);
                    } else {
                      setTotalSeats(value);
                    }
                  }}
                  error={totalSeats < 0}
                  helperText={
                    totalSeats < 0 ? "Số chỗ không thể nhỏ hơn 0" : ""
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Giá tiền mỗi km (VND)"
                  variant="outlined"
                  value={costPerKm}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value < 0) {
                      setCostPerKm(0);
                    } else {
                      setCostPerKm(value);
                    }
                  }}
                  error={costPerKm < 0}
                  helperText={
                    costPerKm < 0 ? "Giá tiền mỗi km không thể nhỏ hơn 0" : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    sx={{ width: "100%" }}
                    label="Ngày giờ xuất phát"
                    value={departureTime}
                    onChange={(newValue) => setDepartureTime(newValue)}
                    minDateTime={new Date()}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ mt: 2 }}
                        fullWidth
                        variant="outlined"
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 2 }}>
              {tripSteps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>
                    {step.province
                      ? `${step.province.name}, ${
                          step.district ? step.district.name : ""
                        }, ${step.commune ? step.commune.name : ""}`
                      : `Điểm ${index + 1}`}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box mt={2}>
              {tripSteps[activeStep] && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      options={provinces}
                      getOptionLabel={(option) => option.name}
                      value={tripSteps[activeStep].province || null}
                      onChange={(event, value) => {
                        handleTripStepChange(activeStep, "province", value);
                        setSelectedProvince(value); // Update province
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Tỉnh" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      options={districts}
                      getOptionLabel={(option) => option.name}
                      value={tripSteps[activeStep].district || null}
                      onChange={(event, value) => {
                        handleTripStepChange(activeStep, "district", value);
                        setSelectedDistrict(value); // Update district
                      }}
                      disabled={!tripSteps[activeStep].province}
                      renderInput={(params) => (
                        <TextField {...params} label="Quận/Huyện" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      options={communes}
                      getOptionLabel={(option) => option.name}
                      value={tripSteps[activeStep].commune || null}
                      onChange={(event, value) =>
                        handleTripStepChange(activeStep, "commune", value)
                      }
                      disabled={!tripSteps[activeStep].district}
                      renderInput={(params) => (
                        <TextField {...params} label="Phường/Xã" />
                      )}
                    />
                  </Grid>
                </Grid>
              )}
              <Box mt={2} display="flex" justifyContent="space-between">
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  color="primary"
                >
                  Trở về
                </Button>
                <Button
                  onClick={
                    activeStep === tripSteps.length - 1
                      ? handleAddStep
                      : handleNext
                  }
                  color="primary"
                >
                  {activeStep === tripSteps.length - 1
                    ? "Thêm điểm đến"
                    : "Tiếp tục"}
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            borderRadius: "8px",
            backgroundColor: "var(--grey)",
            "&:hover": {
              backgroundColor: "var(--subtext-color)",
            },
          }}
          variant="contained"
          onClick={handleClose}
        >
          Huỷ
        </Button>
        <Button
          sx={{
            borderRadius: "8px",
            backgroundColor: "var(--primary-color)",
            "&:hover": {
              backgroundColor: "var(--hover-color)",
            },
          }}
          variant="contained"
          onClick={handleSubmit}
          color="primary"
        >
          Đăng bài
        </Button>
      </DialogActions>
      {loading && <Loadding />}
    </Dialog>
  );
}

export default ForumPost;
