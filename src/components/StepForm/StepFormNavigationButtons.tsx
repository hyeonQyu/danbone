'use client';

import { usePxToRem } from '@/styles';
import { ArrowBack } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useCurrentStep, useHandleNext, useHandlePrevious, useIsStepLoading, useTotalSteps } from './StepFormContext';

function StepFormNavigationButtons() {
  const currentStep = useCurrentStep();
  const totalSteps = useTotalSteps();
  const isLoading = useIsStepLoading();
  const handlePrevious = useHandlePrevious();
  const handleNext = useHandleNext();
  const pxToRem = usePxToRem();

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      sx={{ display: 'flex', gap: 2, mt: 2 }}
    >
      {!isFirstStep && (
        <Button onClick={handlePrevious} variant="outlined" startIcon={<ArrowBack />} sx={{ minWidth: pxToRem(100) }} disabled={isLoading}>
          이전
        </Button>
      )}
      <Button onClick={handleNext} variant="contained" fullWidth loading={isLoading}>
        {!isLastStep ? '다음' : '완료'}
      </Button>
    </Box>
  );
}

export default StepFormNavigationButtons;
