import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  console.log("Setting cookie. NODE_ENV:", ENV.NODE_ENV);
  const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: ENV.NODE_ENV === "development" ? "lax" : "none",
    secure: ENV.NODE_ENV !== "development",
  };
  console.log("Cookie Options:", cookieOptions);

  res.cookie("jwt", token, cookieOptions);

  return token;
};

// http://localhost
// https://dsmakmk.com
