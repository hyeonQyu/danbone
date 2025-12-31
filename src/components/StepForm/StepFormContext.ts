'use client';

import { createContext, useContext } from 'react';

interface StepFormContextValue {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  handleNext: () => Promise<void>;
  handlePrevious: () => void;
}

export const StepFormContext = createContext<StepFormContextValue | undefined>(undefined);

const useStepFormContext = () => {
  const context = useContext(StepFormContext);
  if (!context) {
    throw new Error('StepByStepForm Context를 사용하기 전에 StepByStepFormProvider로 감싸주세요.');
  }
  return context;
};

export const useCurrentStep = () => {
  const { currentStep } = useStepFormContext();
  return currentStep;
};

export const useTotalSteps = () => {
  const { totalSteps } = useStepFormContext();
  return totalSteps;
};

export const useIsStepLoading = () => {
  const { isLoading } = useStepFormContext();
  return isLoading;
};

export const useHandleNext = () => {
  const { handleNext } = useStepFormContext();
  return handleNext;
};

export const useHandlePrevious = () => {
  const { handlePrevious } = useStepFormContext();
  return handlePrevious;
};
