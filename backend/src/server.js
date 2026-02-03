import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "50mb" })); // req.body

const normalizeUrl = (url) => url ? url.replace(/\/$/, "") : "";
const clientUrl = normalizeUrl(ENV.CLIENT_URL);
const allowedOrigins = [
  clientUrl,
  clientUrl.includes("www.") ? clientUrl.replace("www.", "") : clientUrl.replace("://", "://www."),
  "http://localhost:5173",
  "http://localhost:5174"
].filter(Boolean);

console.log("Allowed Origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || ENV.NODE_ENV === "development") {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
// make ready for deployment
// In split deployment (Render + Vercel), we don't need to serve frontend files from backend.
// if (ENV.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//
//   app.get("*", (_, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});
