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
}

function Step({ children }: StepProps) {
  return <>{children}</>;
}

function StepByStepForm<TFieldValues extends FieldValues>({ methods, onSubmit, children }: StepByStepFormProps<TFieldValues>) {
  const [currentStep, setCurrentStep] = useState(0);
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
    const currentChild = childrenArray[currentStep];
    if (!isValidElement(currentChild)) return;

    const actualChild = currentChild.type === Step ? (currentChild.props as StepProps).children : currentChild;

    if (!isValidElement(actualChild)) return;

    const props = actualChild.props as { formName?: FieldPath<TFieldValues> };
    if (!props.formName) return;

    const isValid = await methods.trigger(props.formName);

    if (isValid) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit();
      }
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
            <Button onClick={handlePrevious} variant="outlined" startIcon={<ArrowBack />} sx={{ minWidth: pxToRem(100) }}>
              이전
            </Button>
          )}
          <Button onClick={handleNext} variant="contained" fullWidth>
            {!isLastStep ? '다음' : '완료'}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
}

StepByStepForm.Step = Step;

export default StepByStepForm;
