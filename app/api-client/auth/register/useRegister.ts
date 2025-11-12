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
    {
      data: {
        user: RegisterResponse;
      };
    },
    {
      data: {
        user: RegisterResponse;
      };
    }
  >({
    apiClient: jsonApiClient,
    method: "post",
    url: "/auth/register",
    errorMessage: "Failed to register user.",
    invalidateQueryKey,
    mutationOptions: {},
  });
};