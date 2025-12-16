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
  },
});

const upload = multer({ storage });

/* ======================
   LOGIN
====================== */
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.json({ success: false, message: "Invalid login" });
  }

  res.json({
    success: true,
    role: user.role || "student",
    username: user.username,
  });
});

/* ======================
   USERS (ADMIN SAFE)
====================== */
app.get("/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));

  const safeUsers = users.map((u) => ({
    username: u.username,
    role: u.role || "student",
    registeredAt: u.registeredAt,
  }));

  res.json(safeUsers);
});

/* ======================
   VIDEO UPLOAD (ADMIN)
====================== */
app.post("/admin/upload-video", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No video uploaded" });
  }

  const videos = JSON.parse(fs.readFileSync(VIDEOS_FILE, "utf-8"));

  const video = {
    id: Date.now(),
    title: req.body.title,
    filename: req.file.filename,
    uploadedAt: new Date().toISOString(),
  };

  videos.push(video);
  fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2));

  res.json({ success: true, video });
});

/* ======================
   GET VIDEOS
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
