import { cn } from "@/utilities/cn";
import React, { ComponentProps } from "react";

interface IInputGroup extends ComponentProps<"div"> {}
const InputGroup = ({ className, children, ...rest }: IInputGroup) => {
  return (
    <div
      role="group"
      data-slot="control"
      className={cn(
        "group relative isolate block",

        // Icon base styles
        "*:data-[slot=icon]:pointer-events-none",
        "*:data-[slot=icon]:absolute",
        "*:data-[slot=icon]:top-1/2",
        "*:data-[slot=icon]:-translate-y-1/2",
        "*:data-[slot=icon]:z-10",
        "*:data-[slot=icon]:size-5",
        "*:data-[slot=icon]:text-gray-400",
        "*:data-[slot=icon]:group-data-[disabled=true]:opacity-50",

        // Icon positioning
        "[&>[data-slot=icon]:first-child]:left-0",
        "[&>[data-slot=icon]:last-child]:right-0",

        // Focus states - icon color change
        "focus-within:*:data-[slot=icon]:text-gray-800",
        "dark:focus-within:*:data-[slot=icon]:text-white",

        // Error state
        "has-[input[data-invalid]]:*:data-[slot=icon]:text-red-500",

        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default InputGroup;