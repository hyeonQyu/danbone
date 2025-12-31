'use client';

import { usePxToRem } from '@/styles';
import { ArrowBack } from '@mui/icons-material';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { Children, cloneElement, isValidElement, KeyboardEvent, ReactElement, ReactNode, useState } from 'react';
import { FieldPath, FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';

interface StepByStepFormProps<TFieldValues extends FieldValues> {
  methods: UseFormReturn<TFieldValues>;
  onSubmit: (data: TFieldValues) => void;
  children: ReactNode;
}

interface StepProps {
  description?: string;
  children: ReactNode;
  onValidate?: () => Promise<boolean> | boolean;
}

function Step({ children }: StepProps) {
  return <>{children}</>;
}

function StepByStepForm<TFieldValues extends FieldValues>({ methods, onSubmit, children }: StepByStepFormProps<TFieldValues>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const childrenArray = Children.toArray(children);
  const totalSteps = childrenArray.length;

  const pxToRem = usePxToRem();

  const handleSubmit = methods.handleSubmit(onSubmit);

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNext = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const currentChild = childrenArray[currentStep];
      if (!isValidElement(currentChild)) return;

      const isStepChild = currentChild.type === Step;
      const stepProps = isStepChild ? (currentChild.props as StepProps) : undefined;
      const actualChild = isStepChild ? stepProps?.children : currentChild;

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
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const currentChild = childrenArray[currentStep];

  const isStepComponent = isValidElement(currentChild) && currentChild.type === Step;
  const description = isStepComponent ? (currentChild.props as StepProps).description : undefined;
  const actualChild = isStepComponent ? (currentChild.props as StepProps).children : currentChild;

  const childWithKeyDown =
    isValidElement(actualChild) && typeof actualChild.type !== 'string'
      ? cloneElement(actualChild as ReactElement<{ onKeyDown?: (e: KeyboardEvent) => void }>, {
          onKeyDown: handleKeyDown,
        })
      : actualChild;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        sx={{
          width: '100%',
          maxWidth: pxToRem(400),
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          color="primary"
          sx={{
            height: pxToRem(4),
            borderRadius: 2,
            backgroundColor: 'action.hover',
            '& .MuiLinearProgress-bar': {
              borderRadius: 2,
            },
            mb: 1,
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {description && (
              <Typography variant="h6" component="h2">
                {description}
              </Typography>
            )}
            {childWithKeyDown}
          </motion.div>
        </AnimatePresence>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          {!isFirstStep && (
            <Button
              onClick={handlePrevious}
              variant="outlined"
              startIcon={<ArrowBack />}
              sx={{ minWidth: pxToRem(100) }}
              disabled={isLoading}
            >
              이전
            </Button>
          )}
          <Button onClick={handleNext} variant="contained" fullWidth loading={isLoading}>
            {!isLastStep ? '다음' : '완료'}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
}

StepByStepForm.Step = Step;

export default StepByStepForm;
