"use client";

import { useRegister } from "@/app/api-client/auth/register/useRegister";
import { RegisterUserSchema } from "@/schemas/user.schema";
import { IoPerson, IoMail, IoLockClosed, IoCall } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { CustomError } from "@/app/api/helpers/handleError";
import Form from "@/app/components/Forms/Form";
import Field from "@/app/components/Forms/Field";
import Input from "@/app/components/Forms/Input";
import InputGroup from "@/app/components/Forms/InputGroup";
import ErrorMessage from "@/app/components/Forms/ErrorMessage";
import Button from "@/app/components/Button";
import { useTransition } from "react";

const RegisterForm = () => {
  const router = useRouter();
  const { mutateAsync: register } = useRegister({});
  const [isPending, startTransition] = useTransition();

  return (
    <Form
      validationSchema={RegisterUserSchema}
      className="space-y-1"
      onSubmit={async (values, methods) => {
        try {
          const response = await register({ body: values });

          // Save auth to cookies
          // Cookie.set(cookieKeys.USER_TOKEN, response.token);
          // Cookie.set(cookieKeys.USER, JSON.stringify(response.data.user));

          // // Update auth state
          // setAuthToken(response.token);
          // setUser(response.data.user);

          // Navigate smoothly
          startTransition(() => {
            router.push("/verify-otp");
          });
          
        } catch (error) {
          const err = error as AxiosError;
          const errObject = err.response?.data as CustomError;
          // Handle server validation error
          methods.setError("email", { message: errObject?.error?.message || "Something went wrong" });
        }
      }}
    >
      {({ register, formState: { errors, isSubmitting } }) => (
        <>
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
         <Field>
            <InputGroup>
              <IoPerson data-slot="icon" />
              <Input
                placeholder="Your first name"
                aria-invalid={!!errors.firstName}
                {...register("firstName")}
              />
            </InputGroup>
            <ErrorMessage>{errors.firstName?.message}</ErrorMessage>
          </Field>

          <Field>
            <InputGroup>
              <IoPerson data-slot="icon" />
              <Input
                placeholder="Your last name"
                aria-invalid={!!errors.lastName}
                {...register("lastName")}
              />
            </InputGroup>
            <ErrorMessage>{errors.lastName?.message}</ErrorMessage>
          </Field>
         </div>
          
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
         <Field>
            <InputGroup>
              <IoMail data-slot="icon" />
              <Input
                placeholder="Your email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </InputGroup>
            <ErrorMessage>{errors.email?.message}</ErrorMessage>
          </Field>

          <Field>
            <InputGroup>
              <IoCall  data-slot="icon" />
              <Input
                placeholder="Your phone number"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
            </InputGroup>
            <ErrorMessage>{errors.phone?.message}</ErrorMessage>
          </Field>
         </div>
        
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <InputGroup>
              <IoLockClosed data-slot="icon" />
              <Input
                type="password"
                placeholder="Password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
            </InputGroup>
            <ErrorMessage>{errors.password?.message}</ErrorMessage>
          </Field>

          <Field>
            <InputGroup>
              <IoLockClosed data-slot="icon" />
              <Input
                type="password"
                placeholder="Confirm Password"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
            </InputGroup>
            <ErrorMessage>{errors.confirmPassword?.message}</ErrorMessage>
          </Field>
          </div>
          <Button type="submit" isLoading={isSubmitting || isPending} className="w-full">
            Register
          </Button>
        </>
      )}
    </Form>
  );
};

export default RegisterForm;
