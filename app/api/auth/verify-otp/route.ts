import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 
import { verifyOtpSchema } from "@/schemas/otp.schema";
import handleError from "../../helpers/handleError";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, code, purpose } = verifyOtpSchema.parse(body);

    if (!email && !phone) {
      return NextResponse.json(
        { success: false, message: "Email or phone required" },
        { status: 400 }
      );
    }
    //Find OTP record
    const otpRecord = await prisma.otp.findFirst({
      where: {
        code,
        purpose,
        isVerified: false,
        expiresAt: { gt: new Date() },
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {}),
      },
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

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
      return handleError(error, "Failed to verify OTP");
  }
}
