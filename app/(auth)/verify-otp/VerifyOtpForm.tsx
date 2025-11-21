"use client";

import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Cookie from "js-cookie";
import { useTransition, useState } from "react";
import Form from "@/app/components/Forms/Form";
import Field from "@/app/components/Forms/Field";
import Input from "@/app/components/Forms/Input";
import ErrorMessage from "@/app/components/Forms/ErrorMessage";
import Button from "@/app/components/Button";
import cookieKeys from "@/configs/cookieKeys";
import { useVerifyOtp } from "@/app/api-client/auth/register/useVerify";
import { verifyOtpSchema } from "@/schemas/otp.schema";
import { useAuthActions } from "@/stores/authstore";
import { CustomError } from "@/app/api/helpers/handleError";

const OTPVerifyForm = () => {
  const router = useRouter();
  const { mutateAsync: verify } = useVerifyOtp({});
  const { setUser, setAuthToken } = useAuthActions();
  const [isPending, startTransition] = useTransition();

  const [otp, setOtp] = useState(Array(6).fill(""));

  // Helper to move focus forward/backward
  const moveFocus = (
    element: HTMLInputElement | null,
    direction: "next" | "prev",
  ) => {
    if (!element) return;

    const parent = element.closest("[data-otp-group]");
    if (!parent) return;

    const inputs = Array.from(parent.querySelectorAll("input"));

    const index = inputs.indexOf(element);
    const nextIndex = direction === "next" ? index + 1 : index - 1;

    if (inputs[nextIndex]) {
      (inputs[nextIndex] as HTMLInputElement).focus();
    }
  };

  return (
    <Form
      validationSchema={verifyOtpSchema}
      className="space-y-4"
      onSubmit={async (_, methods) => {
        try {
          const code = otp.join("");

          const response = await verify({ body: { code } });

          Cookie.set(cookieKeys.USER_TOKEN, response.token);
          Cookie.set(cookieKeys.USER, JSON.stringify(response.user));

          setAuthToken(response.token);
          setUser(response.user);

          startTransition(() => router.push("/"));
        } catch (error) {
          const errObj = (error as AxiosError).response?.data as CustomError;
          methods.setError("code", { message: errObj?.error?.message });
        }
      }}
    >
      {({ formState: { errors, isSubmitting } }) => {
        const handleChange = (value: string, index: number, e: any) => {
          if (!/^\d?$/.test(value)) return;

          const updated = [...otp];
          updated[index] = value;
          setOtp(updated);

          if (value) moveFocus(e.target, "next");
        };

        const handleKeyDown = (e: any, index: number) => {
          if (e.key === "Backspace" && !otp[index]) {
            moveFocus(e.target, "prev");
          }
        };

        const handlePaste = (e: any) => {
          e.preventDefault();
          const pasted = e.clipboardData.getData("text").replace(/\D/g, "");

          if (pasted.length !== 6) return;

          const digits = pasted.split("").slice(0, 6);
          setOtp(digits);

          const group = e.target.closest("[data-otp-group]");
          if (!group) return;

          const inputs = Array.from(group.querySelectorAll("input"));
          inputs.forEach((input, i) => {
            (input as HTMLInputElement).value = digits[i];
          });

          moveFocus(inputs[5] as HTMLInputElement, "next");
        };

        return (
          <>
            <Field name="code">
              {() => (
                <div
                  data-otp-group
                  className="mx-auto flex w-full max-w-xs justify-center gap-2"
                >
                  {otp.map((val, i) => (
                    <Input
                      key={i}
                      maxLength={1}
                      value={val}
                      inputClass="w-12 h-12 text-center text-xl border-b"
                      onChange={(e) => handleChange(e.target.value, i, e)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      onPaste={handlePaste}
                    />
                  ))}
                </div>
              )}
            </Field>

            <ErrorMessage>{errors.code?.message}</ErrorMessage>

            <Button
              type="submit"
              isLoading={isSubmitting || isPending}
              className="w-full"
            >
              Verify OTP
            </Button>
          </>
        );
      }}
    </Form>
  );
};

export default OTPVerifyForm;
