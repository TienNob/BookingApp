const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { log } = require("console");
// Route để điều hướng người dùng đến Zalo
router.get("/zalo", (req, res) => {
  const { codeVerifier, codeChallenge } = generateCodeChallenge();
  console.log(codeVerifier, codeChallenge);

  // Lưu codeVerifier vào session để sử dụng sau này
  req.session.codeVerifier = codeVerifier;

  const redirectUri = process.env.ZALO_REDIRECT_URI;
  const authUrl = `https://oauth.zaloapp.com/v4/permission?app_id=${process.env.ZALO_APP_ID}&redirect_uri=${redirectUri}&code_challenge=${codeChallenge}&state=your_unique_state_value`;

  res.redirect(authUrl);
  console.log("Redirecting to Zalo: ", authUrl);
});
// Callback để nhận mã code từ Zalo
router.get("/zalo/callback", async (req, res) => {
  const { code } = req.query;
  req.session.codeVerifier = generateCodeVerifier();
  const codeVerifier = req.session.codeVerifier; // Lấy codeVerifier từ session

  if (!code) {
    return res.status(400).send("No code provided");
  }

  try {
    const accessToken = await getAccessToken(code, codeVerifier);
    console.log(accessToken);

    // Gửi accessToken đến /zalo-login
    return await handleZaloLogin(accessToken, res);
  } catch (error) {
    res.status(500).send("Failed to get access token");
  }
});
const generateCodeVerifier = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Cập nhật hàm getAccessToken
async function getAccessToken(code, codeVerifier) {
  try {
    const response = await axios.post(
      "https://oauth.zaloapp.com/v4/access_token",
      {
        params: {
          app_id: process.env.ZALO_APP_ID,
          app_secret: process.env.ZALO_APP_SECRET,
          code: code,
          redirect_uri: process.env.ZALO_REDIRECT_URI,
          grant_type: "authorization_code",
          code_verifier: codeVerifier, // Thêm code_verifier vào đây
        },
      }
    );
    console.log({
      app_id: process.env.ZALO_APP_ID,
      app_secret: process.env.ZALO_APP_SECRET,
      code: code,
      redirect_uri: process.env.ZALO_REDIRECT_URI,
      grant_type: "authorization_code",
      code_verifier: codeVerifier, // Thêm code_verifier vào đây
    });
    // Kiểm tra xem access_token có được trả về không
    if (response.data.access_token) {
      return response.data.access_token;
    } else {
      throw new Error("Failed to retrieve access token");
    }
  } catch (error) {
    console.error("Error retrieving access token:", error.message);
    throw error; // Để xử lý lỗi ở callback
  }
}

// Tạo code challenge từ code verifier
function generateCodeChallenge() {
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  // Đảm bảo rằng codeVerifier được sử dụng để tạo codeChallenge
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");
  return { codeVerifier, codeChallenge };
}

// Xử lý đăng nhập qua Zalo
const handleZaloLogin = async (accessToken, res) => {
  try {
    const zaloResponse = await axios.get("https://graph.zalo.me/v2.0/me", {
      params: {
        access_token: accessToken,
        fields: "id,name,picture",
      },
    });

    const zaloUser = zaloResponse.data;
    if (!zaloUser.id)
      return res.status(400).send({ message: "Invalid Zalo access token" });

    // Kiểm tra xem người dùng đã tồn tại trong DB; nếu không, tạo người dùng mới
    let user = await User.findOne({ zaloId: zaloUser.id });
    if (!user) {
      user = new User({
        firstName: zaloUser.name.split(" ")[0],
        lastName: zaloUser.name.split(" ").slice(1).join(" "),
        zaloId: zaloUser.id,
        avatar: zaloUser.picture.data.url,
      });
      await user.save();
    }

    // Tạo JWT token cho người dùng
    const token = jwt.sign({ _id: user._id }, process.env.JWTPRIVATEKEY);
    const { password, ...userWithoutPassword } = user._doc;

    res.status(200).send({
      data: { ...userWithoutPassword, token },
      message: "Logged in successfully with Zalo",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ phone: req.body.phone });
    if (!user)
      return res.status(401).send({ message: "Invalid Phone or Password" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Phone or Password" });

    const token = jwt.sign({ _id: user._id }, process.env.JWTPRIVATEKEY);

    const { password, ...userWithoutPassword } = user._doc;
    res.status(200).send({
      data: { ...userWithoutPassword, token },
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    phone: Joi.string()
      .pattern(new RegExp("^[0-9]{10,15}$"))
      .required()
      .label("Phone"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = router;
