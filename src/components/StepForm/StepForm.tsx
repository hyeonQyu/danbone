'use client';

import { usePxToRem } from '@/styles';
import { Box } from '@mui/material';
import { Children, cloneElement, isValidElement, ReactElement, ReactNode } from 'react';
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';
import { useHandleNext } from './StepFormContext';
import StepFormNavigationButtons from './StepFormNavigationButtons';
import StepFormProgressBar from './StepFormProgressBar';
import StepFormProvider from './StepFormProvider';
import StepFormStep, { StepFormStepProps } from './StepFormStep';

interface StepFormProps<TFieldValues extends FieldValues> {
  methods: UseFormReturn<TFieldValues>;
  onSubmit: (data: TFieldValues) => void | Promise<void>;
  children: ReactElement<StepFormStepProps> | ReactElement<StepFormStepProps>[];
}

function StepFormContent({ children }: { children: ReactNode }) {
  const handleNext = useHandleNext();
  const pxToRem = usePxToRem();

  const childrenWithIndex = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child;
    const reactChild = child as ReactElement<StepFormStepProps>;
    if (reactChild.type === StepFormStep) {
      return cloneElement(reactChild, { ...reactChild.props, stepIndex: index });
    }
    return child;
  });

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
      sx={{
        width: '100%',
        maxWidth: pxToRem(400),
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <StepFormProgressBar />

      {childrenWithIndex}

      <StepFormNavigationButtons />
    </Box>
  );
}

function StepForm<TFieldValues extends FieldValues>({ methods, onSubmit, children }: StepFormProps<TFieldValues>) {
  return (
    <FormProvider {...methods}>
      <StepFormProvider onSubmit={onSubmit} steps={children}>
        <StepFormContent>{children}</StepFormContent>
      </StepFormProvider>
    </FormProvider>
  );
}

StepForm.Step = StepFormStep;

export default StepForm;
