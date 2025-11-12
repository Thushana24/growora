import { Prisma } from "@/generated/prisma/client";
import { RegisterUserSchema } from "@/schemas/user.schema";
import z from "zod";

export type RegisterInput = z.infer<typeof RegisterUserSchema>;

export type RegisterUserResponse = Prisma.UserGetPayload<{
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
        phone: true;
        role: true;
      };
    }>;
    
export interface RegisterResponse {
      success: boolean;
      data: {
        user: RegisterUserResponse;
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
    