// /app/api-client/auth/verifyOtp/useVerifyOtp.ts
import { useApi } from "@/providers/ApiProvider";
import { useCreateMutation } from "../../apiFactory";
import { OTPVerifyInput, OTPVerifyResponse } from "@/app/api/types";

export const useVerifyOtp = ({
      invalidateQueryKey,
    }: {
      invalidateQueryKey?: unknown[];
    }) => {
  const { jsonApiClient } = useApi();

  return useCreateMutation<
  Record<string, any>, 
  OTPVerifyInput, 
  OTPVerifyResponse, 
  OTPVerifyResponse
  >({
    apiClient: jsonApiClient,
    method: "post",
    url: "/api/auth/verify-otp",
    errorMessage: "Failed to verify OTP.",
    invalidateQueryKey,
    mutationOptions: {},
  });
};
