import { RegisterUserSchema } from "@/schemas/user.schema";
import z from "zod";

export type RegisterInput = z.infer<typeof RegisterUserSchema>;

export interface RegisterResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string;
      phone?: string;
      role: string;
    };
    otp: {
      id: string;
      code: string;
      expiresAt: string;
      purpose: string;
    };
  };
  token: string;
  message: string;
}
