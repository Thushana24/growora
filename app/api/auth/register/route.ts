import { RegisterUserSchema } from "@/schemas/user.schema";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { generateOTP } from "../../helpers/generateOtp";
import generateToken from "../../helpers/generateToken";
import { BUYER_PERMISSIONS } from "../../permissions";
import { TransactionClient } from "@/generated/prisma/internal/prismaNamespace";
import handleError from "../../helpers/handleError";
import { sendEmail } from "@/lib/nodemailer";
import { OtpEmail } from "@/email-templates/SendOTP";
import { render } from "@react-email/render";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = await RegisterUserSchema.parseAsync(body);

    // Check if user already exists
    const isUserExist = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { phone: validatedData.phone },
        ],
      },
    });

    if (isUserExist) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_ALREADY_EXISTS",
            message: "User already exists",
          },
        },
        { status: 409 }
      );
    }

    const { firstName, lastName, email, phone, password } = validatedData;
    const hashedPassword = await argon2.hash(password);
    const otpCode = generateOTP();

    // Create user and OTP inside a transaction
    const result = await prisma.$transaction(async (tx: TransactionClient) => {
      const newUser = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          password: hashedPassword,
        },
      });

      const otp = await tx.otp.create({
        data: {
          userId: newUser.id,
          email,
          phone,
          code: otpCode,
          purpose: "SIGNUP",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
        },
      });

      return { newUser, otp };
    });

    // Send OTP email
    if (email) {
      const htmlContent = await render(
        OtpEmail({
          username: firstName,
          otp: otpCode,
          purpose: "SIGNUP",
        }),
      );

      await sendEmail({
        to: email,
        subject: "Your OTP for Growora Signup",
        html: htmlContent, 
      });
    }
    
    // 5. Set cookie for pending verification
    const response = NextResponse.json({
      success: true,
      message: "OTP sent. Please verify.",
    }, { status: 201 });

    response.cookies.set("pending_verification", validatedData.email ?? validatedData.phone, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 10 * 60, // 10 minutes
    });

    return response;
  } catch (error: any) {
    return handleError(error, "Failed to register user");
  }
}
