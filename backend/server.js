const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, "users.json");
const VIDEOS_FILE = path.join(__dirname, "videos.json");
const UPLOAD_DIR = path.join(__dirname, "uploads");

/* ======================
   INIT FILES
====================== */
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(VIDEOS_FILE)) {
  fs.writeFileSync(VIDEOS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

/* ======================
   MULTER CONFIG
====================== */
const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

/* ======================
   LOGIN  ✅ FIXED (username)
====================== */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.json({
      success: false,
      message: "Invalid username or password"
    });
  }

  res.json({
    success: true,
    role: user.role || "student",
    username: user.username
  });
});

/* ======================
   REGISTER (ADMIN/STUDENT)
====================== */
app.post("/register", (req, res) => {
  const { username, password, role } = req.body;

  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));

  if (users.find(u => u.username === username)) {
    return res.json({ success: false, message: "User already exists" });
  }

  users.push({
    username,
    password,
    role: role || "student",
    registeredAt: new Date().toISOString()
  });

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ success: true, message: "User added successfully" });
});

/* ======================
   USERS LIST (ADMIN SAFE) ✅
====================== */
app.get("/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));

  const safeUsers = users.map(u => ({
    username: u.username,
    role: u.role || "student",
    registeredAt: u.registeredAt
  }));

  res.json(safeUsers);
});

/* ======================
   ADMIN VIDEO UPLOAD
====================== */
app.post("/admin/upload-video", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Video file missing" });
  }

  const { title } = req.body;
  const videos = JSON.parse(fs.readFileSync(VIDEOS_FILE, "utf-8"));

  const newVideo = {
    id: Date.now(),
    title,
    filename: req.file.filename,
    uploadedAt: new Date().toISOString()
  };

  videos.push(newVideo);
  fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2));

  res.json({ success: true, video: newVideo });
});

/* ======================
   GET VIDEOS (STUDENT)
====================== */
app.get("/videos", (req, res) => {
  const videos = JSON.parse(fs.readFileSync(VIDEOS_FILE, "utf-8"));
  res.json(videos);
});

/* ======================
   SERVE UPLOADS
====================== */
app.use("/uploads", express.static(UPLOAD_DIR));

/* ======================
   START SERVER
====================== */
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
