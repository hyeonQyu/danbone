'use client';

import { Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { KeyboardEvent, ReactNode } from 'react';
import { useCurrentStep, useHandleNext } from './StepFormContext';

export interface StepFormStepProps {
  description?: string;
  children: ReactNode;
  onValidate?: () => Promise<boolean> | boolean;
  stepIndex?: number;
}

function StepFormStep({ description, children, stepIndex }: StepFormStepProps) {
  const currentStep = useCurrentStep();
  const handleNext = useHandleNext();

  const isActive = stepIndex === currentStep;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  if (!isActive) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        onKeyDown={handleKeyDown}
      >
        {description && (
          <Typography variant="h6" component="h2">
            {description}
          </Typography>
        )}
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default StepFormStep;
