"use client";

import { cn } from "@/utilities/cn";
import { ComponentProps } from "react";
import { useFieldContext } from "./Field";

interface IInput extends ComponentProps<"input"> {
  inputClass?: string;
}

const Input = ({
  className,
  inputClass: inputClass,
  disabled,
  type = "text",
  ...rest
}: IInput) => {
  const { id, form, disabled: rootDisabled, name } = useFieldContext();
  const hasError = name && !!form.formState.errors[name];

  return (
    <input
      id={id}
      type={type}
      data-slot="control"
      className={cn(
        // Base style
        "relative block w-full appearance-none",
        "border-0 border-b-[1.5px] border-gray-300 bg-transparent",
        "text-sm text-gray-800 placeholder:text-gray-400",
        "dark:border-white/20 dark:text-white dark:placeholder:text-white/50",

        // Padding - reduced for minimal look
        "px-0 py-2.5 pl-8", // pl-8 for icon space

        // Focus states - simple bottom border color change
        "focus:outline-none focus:border-gray-800 dark:focus:border-white",
        
        // Hover state
        "enabled:hover:border-gray-400 dark:enabled:hover:border-white/40",

        // Invalid state
        "data-invalid:border-red-500 focus:data-invalid:border-red-600",

        // Disabled state
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "group-data-[disabled=true]:opacity-50",

        // Transitions
        "transition-colors duration-200",

        // Custom class
        className,
        inputClass,
      )}
      disabled={form.formState.isSubmitting || disabled || rootDisabled}
      data-invalid={hasError || undefined}
      {...rest}
    />
  );
};

export default Input;