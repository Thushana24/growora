import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 
import { verifyOtpSchema } from "@/schemas/otp.schema";
import handleError from "../../helpers/handleError";
import generateToken from "../../helpers/generateToken";
import { BUYER_PERMISSIONS } from "../../permissions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = verifyOtpSchema.parse(body);

    const emailOrPhone = request.cookies.get("pending_verification")?.value;
    if (!emailOrPhone) {
      return NextResponse.json(
        { 
          success: false, message: "Verification expired" 
        }, 
        { 
          status: 400 
        }
      );
    }

    //Find OTP record
    const otpRecord = await prisma.otp.findFirst({
      where: {
        code,
        isVerified: false,
        expiresAt: { gt: new Date() },
        OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
      include: { user: true },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    const updated = await prisma.otp.updateMany({
      where: { id: otpRecord.id, isVerified: false },
      data: { isVerified: true },
    });

    //Mark OTP as verified
    if (updated.count === 0) {
      return NextResponse.json(
        { success: false, message: "OTP already used or expired" },
        { status: 400 }
      );
    }

    if (!otpRecord.user) {
      return NextResponse.json(
        { success: false, message: "User not found for OTP" },
        { status: 400 }
      );
    }

    const token = generateToken({
      id: otpRecord.user.id,
      role: otpRecord.user.role,
      permissions: BUYER_PERMISSIONS,
    });


    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: otpRecord.user.id,
        firstName: otpRecord.user.firstName,
        lastName: otpRecord.user.lastName,
        email: otpRecord.user.email,
        phone: otpRecord.user.phone,
        role: otpRecord.user.role,
      },
      message: "OTP verified successfully.",
    });

    response.cookies.delete({ name: "pending_verification", path: "/" });

    return response;
  } catch (error) {
      return handleError(error, "Failed to verify OTP");
  }
}
