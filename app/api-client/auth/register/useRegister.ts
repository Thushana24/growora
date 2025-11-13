import { useApi } from "@/providers/ApiProvider";
import { useCreateMutation } from "../../apiFactory";
import { RegisterInput, RegisterResponse } from "@/app/api/types";

export const useRegister = ({
  invalidateQueryKey,
}: {
  invalidateQueryKey?: unknown[];
}) => {
  const { jsonApiClient } = useApi();
  return useCreateMutation<
    Record<string, any>,
    RegisterInput,
    RegisterResponse,
    RegisterResponse
  >({
    apiClient: jsonApiClient,
    method: "post",
    url: "api/auth/register",
    errorMessage: "Failed to register user.",
    invalidateQueryKey,
    mutationOptions: {},
  });
};