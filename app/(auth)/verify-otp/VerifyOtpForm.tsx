"use client";

import { useRegister } from "@/app/api-client/auth/register/useRegister";
import { RegisterUserSchema } from "@/schemas/user.schema";
import { IoPerson, IoMail, IoLockClosed, IoCall } from "react-icons/io5";
import Cookie from "js-cookie";
import cookieKeys from "@/configs/cookieKeys";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { CustomError } from "@/app/api/helpers/handleError";
import Form from "@/app/components/Forms/Form";
import { useAuthActions } from "@/stores/authstore";
import Field from "@/app/components/Forms/Field";
import Input from "@/app/components/Forms/Input";
import InputGroup from "@/app/components/Forms/InputGroup";
import ErrorMessage from "@/app/components/Forms/ErrorMessage";
import Button from "@/app/components/Button";
import { useRef, useTransition } from "react";
import { useVerifyOtp } from "@/app/api-client/auth/register/useVerify";
import { verifyOtpSchema } from "@/schemas/otp.schema";

const RegisterForm = () => {
  const router = useRouter();
  const { mutateAsync: verify } = useVerifyOtp({});
  const { setUser, setAuthToken } = useAuthActions();
  const [isPending, startTransition] = useTransition();

  const inputRefs = useRef<HTMLInputElement[]>([]);

  return (
    <Form
      validationSchema={verifyOtpSchema}
      className="space-y-1"
      onSubmit={async (values, methods) => {
        try {
          const response = await verify({ body: values });

          //Save auth to cookies
          Cookie.set(cookieKeys.USER_TOKEN, response.token);
          Cookie.set(cookieKeys.USER, JSON.stringify(response.user));

          // Update auth state
          setAuthToken(response.token);
          setUser(response.user);

          // Navigate smoothly
          startTransition(() => {
            router.push("/");
          });
          
        } catch (error) {
          const err = error as AxiosError;
          const errObject = err.response?.data as CustomError;
          // Handle server validation error
          methods.setError("code", { message: errObject?.error?.message || "Something went wrong" });
        }
      }}
    >
      {({ register, setValue, formState: { errors, isSubmitting } }) => {
            const setRef = (el: HTMLInputElement, index: number) => {
                  if (el) inputRefs.current[index] = el;
                };
        
                const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
                  const val = e.target.value;
                  if (!/^\d?$/.test(val)) return;
        
                  // Update form value
                  const newCode = inputRefs.current.map((input) => input.value);
                  newCode[index] = val;
                  setValue("code", newCode.join(""));
        
                  // Move focus to next input
                  if (val && index < inputRefs.current.length - 1) {
                    inputRefs.current[index + 1].focus();
                  }
                };
        
                const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
                  if (e.key === "Backspace" && !inputRefs.current[index].value && index > 0) {
                    inputRefs.current[index - 1].focus();
                  }
                };
return(
      <>
            <Field name="code">
              {() => (
                <div className="flex justify-center gap-2">
                  {[...Array(6)].map((_, i) => (
                    <InputGroup key={i}>
                      <Input
                        inputClass="w-12 h-12 text-center text-xl border-b"
                        maxLength={1}
                        type="text"
                        ref={(el) => setRef(el!, i)}
                        onChange={(e) => handleChange(e, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                      />
                    </InputGroup>
                  ))}
                </div>
              )}
            </Field>
            <ErrorMessage>{errors.code?.message}</ErrorMessage>

            <Button type="submit" isLoading={isSubmitting || isPending} className="w-full">
              Verify OTP
            </Button>
          </>
        );
       
      }
      }
    </Form>
  );
};

export default RegisterForm;
