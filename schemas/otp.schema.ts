import { z } from "zod";

const verifyOtpSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  code: z.string().length(6, "OTP must be 6 digits"),
  purpose: z.string(), // e.g. "SIGNUP", "PASSWORD_RESET"
});


export { verifyOtpSchema };