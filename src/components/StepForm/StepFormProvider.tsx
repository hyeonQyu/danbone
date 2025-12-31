'use client';

import { Children, isValidElement, ReactNode, useCallback, useMemo, useState } from 'react';
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import { StepFormContext } from './StepFormContext';

interface StepProps {
  description?: string;
  children: ReactNode;
  onValidate?: () => Promise<boolean> | boolean;
}

interface StepFormProviderProps<TFieldValues extends FieldValues> {
  onSubmit: (data: TFieldValues) => void;
  steps: ReactNode;
  children: ReactNode;
}

function StepFormProvider<TFieldValues extends FieldValues>({ onSubmit, steps, children }: StepFormProviderProps<TFieldValues>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useFormContext<TFieldValues>();

  const stepsArray = Children.toArray(steps);
  const totalSteps = stepsArray.length;

  const handleSubmit = methods.handleSubmit(onSubmit);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleNext = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const currentChild = stepsArray[currentStep];
      if (!isValidElement(currentChild)) return;

      const stepProps = currentChild.props as StepProps;
      const actualChild = stepProps?.children;

      if (!isValidElement(actualChild)) return;

      const props = actualChild.props as { formName?: FieldPath<TFieldValues> };
      if (!props.formName) return;

      const isValid = await methods.trigger(props.formName);
      if (!isValid) return;

      if (stepProps?.onValidate) {
        const canProceed = await stepProps.onValidate();
        if (!canProceed) return;
      }

      if (currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, stepsArray, currentStep, methods, totalSteps, handleSubmit]);

  const contextValue = useMemo(
    () => ({
      currentStep,
      totalSteps,
      isLoading,
      handleNext,
      handlePrevious,
    }),
    [currentStep, totalSteps, isLoading, handleNext, handlePrevious],
  );

  return <StepFormContext.Provider value={contextValue}>{children}</StepFormContext.Provider>;
}

export default StepFormProvider;
