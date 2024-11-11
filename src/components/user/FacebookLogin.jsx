import React, { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import { auth, facebookProvider, signInWithPopup } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Loadding from "../Loadding";
const FacebookLogin = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(auth, facebookProvider);
      const token = await result.user.getIdToken();

      // Send token to your backend
      const response = await fetch(
        "http://localhost:8080/api/auth/facebook-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar("Đăng nhập thành công!", { variant: "success" });
        const { firstName, lastName, avatar, role, _id } = data.data.user;

        localStorage.setItem(
          "user",
          JSON.stringify({ firstName, lastName, avatar, role })
        );
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userId", _id);
        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 1000);
      } else {
        console.error("Error with Facebook login:", data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error with Facebook login:", error);
      setLoading(false);
      enqueueSnackbar("Đăng nhập thất bại. Vui lòng thử lại.", {
        variant: "error",
      });
    }
  };

  return (
    <>
      <Tooltip title="Đăng nhập với Facebook">
        <Button onClick={handleFacebookLogin}>
          <FacebookRoundedIcon sx={{ mr: 1, fontSize: 25 }} />
        </Button>
      </Tooltip>
      {loading && <Loadding />}
    </>
  );
};

export default FacebookLogin;
