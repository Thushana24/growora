"use client";

import { cn } from "@/utilities/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ComponentProps,
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useForm, UseFormProps, UseFormReturn, Resolver } from "react-hook-form";
import { z } from "zod";

/** ---------------------------
 * MultiStepForm Context
 * --------------------------- */
interface MultiStepFormContextType<T extends z.ZodType<any, any>> {
  methods: UseFormReturn<z.infer<T>>;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToStep: (step: number) => void;
}

const MultiStepFormContext = createContext<MultiStepFormContextType<any> | null>(null);

export const useMultiStepForm = <T extends z.ZodType<any, any>>() => {
  const context = useContext(MultiStepFormContext) as MultiStepFormContextType<T> | null;
  if (!context) throw new Error("useMultiStepForm must be used within a MultiStepForm");
  return context;
};

/** ---------------------------
 * Props
 * --------------------------- */
interface MultiStepFormProps<T extends z.ZodType<any, any>>
  extends Omit<ComponentProps<"form">, "onSubmit"> {
  children: ReactNode;
  validationSchema: T;
  defaultValues?: z.infer<T>;
  onSubmit: (values: z.infer<T>) => void | Promise<void>;
  formOptions?: Omit<UseFormProps<z.infer<T>>, "resolver">;
  setFormMethod?: Dispatch<SetStateAction<UseFormReturn<z.infer<T>, any, undefined> | null>>;
}

/** ---------------------------
 * MultiStepForm Component
 * --------------------------- */
export const MultiStepForm = <T extends z.ZodType<any, any>>({
  children,
  validationSchema,
  defaultValues,
  onSubmit,
  formOptions = { mode: "onSubmit" },
  className,
  setFormMethod,
  ...rest
}: MultiStepFormProps<T>) => {
  // Use z.infer<T> everywhere
  const methods = useForm<z.infer<T>>({
    resolver: zodResolver(validationSchema) as unknown as Resolver<z.infer<T>>,
    defaultValues,
    ...formOptions,
  });

  const [currentStep, setCurrentStep] = useState(0);

  // Count FormStep children
  let totalSteps = 0;
  if (children) {
    const formSteps = Array.isArray(children)
      ? children.find((c) => c && typeof c === "object" && "type" in c && c.type === FormSteps)
      : children && typeof children === "object" && "type" in children && children.type === FormSteps
      ? children
      : null;

    if (formSteps && "props" in formSteps && formSteps.props.children) {
      const stepChildren = Array.isArray(formSteps.props.children)
        ? formSteps.props.children
        : [formSteps.props.children];
      totalSteps = stepChildren.filter(
        (child: ReactNode) => child && typeof child === "object" && "type" in child && child.type === FormStep
      ).length;
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) setCurrentStep(step);
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const handleSubmit = methods.handleSubmit((values) => {
    if (!isLastStep) return nextStep();
    onSubmit(values);
  });

  useEffect(() => {
    if (setFormMethod) setFormMethod(methods);
  }, [methods, setFormMethod]);

  return (
    <MultiStepFormContext.Provider
      value={{ methods, currentStep, totalSteps, nextStep, prevStep, isFirstStep, isLastStep, goToStep }}
    >
      <form onSubmit={handleSubmit} className={cn("group", className)} noValidate {...rest}>
        {children}
      </form>
    </MultiStepFormContext.Provider>
  );
};

/** ---------------------------
 * FormStep Component
 * --------------------------- */
export const FormStep = ({ children }: { children: ReactNode }) => <>{children}</>;

/** ---------------------------
 * FormSteps Component
 * --------------------------- */
export const FormSteps = ({ children }: { children: ReactNode }) => {
  const { currentStep } = useMultiStepForm();
  const steps = Array.isArray(children)
    ? children.filter((c) => c && typeof c === "object" && "type" in c && c.type === FormStep)
    : children && typeof children === "object" && "type" in children && children.type === FormStep
    ? [children]
    : [];
  return <>{steps[currentStep]}</>;
};
