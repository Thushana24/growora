import { UserRole } from "@/generated/prisma/enums";
import jwt from "jsonwebtoken";

export interface IJWTPayload {
  id: string;
  role: UserRole; // ADMIN or BUYER
  permissions: string[]; 
}

export default function generateToken(
  payload: IJWTPayload,
  options: jwt.SignOptions = { expiresIn: "1w" }
) {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET || "", options);
    return token;
  } catch {
    throw {
      code: "error-generating-jwt",
      message: "Failed to generate JWT token",
    };
  }
}