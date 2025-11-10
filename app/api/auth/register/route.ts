import { RegisterUserSchema } from "@/schemas/user.schema";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { generateOTP } from '../../helpers/generateOtp';
import generateToken from '../../helpers/generateToken';
import { BUYER_PERMISSIONS } from '../../permissions';
import { TransactionClient } from "@/generated/prisma/internal/prismaNamespace";
import handleError from "../../helpers/handleError";

export async function POST(request:NextRequest) {
      try {
            const body = await request.json();
            const validatedData = await RegisterUserSchema.parseAsync(body);

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
                    message: "User is already exist",
                  },
                },
                { status: 409 }
              );
            }

            const { firstName, lastName, email,phone, password} = validatedData;

            const hashedPassword = await argon2.hash(password);

            const result = await prisma.$transaction(
              async (tx:TransactionClient) => {
                const newUser = await tx.user.create({
                  data: {
                    firstName,
                    lastName,
                    email,
                    phone,
                    password: hashedPassword,
                  },
                });

                const otpCode = generateOTP();
                const otp = await tx.otp.create({
                  data: {
                    userId: newUser.id,
                    email,
                    phone,
                    code: otpCode,
                    purpose: "SIGNUP",
                    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 min
                  },
                });
                return { newUser, otp };
              }
            );

            const token = generateToken({
                  id: result.newUser.id,
                  role: result.newUser.role,
                  permissions: BUYER_PERMISSIONS,
            });

            const { password: _, ...userResponse } = result.newUser;
            const{...otpResponse} = result.otp;

            return NextResponse.json(
              {
                success: true,
                data: {
                  user: {
                    ...userResponse,
                  },
                  otp: otpResponse,
                },
                token,
                message: "User created successfully.",
              },
              { status: 201 }
            );
      } catch (error:any) {
            return handleError(error, "Failed to register user");
      }
}