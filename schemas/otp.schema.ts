import { z } from "zod";

const verifyOtpSchema = z.object({
  code: z.string().length(6, "OTP must be 6 digits")
});


export { verifyOtpSchema };