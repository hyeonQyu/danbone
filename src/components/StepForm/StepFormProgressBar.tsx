'use client';

import { usePxToRem } from '@/styles';
import { LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useCurrentStep, useTotalSteps } from './StepFormContext';

function StepFormProgressBar() {
  const currentStep = useCurrentStep();
  const totalSteps = useTotalSteps();
  const pxToRem = usePxToRem();

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
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
    </motion.div>
  );
}

export default StepFormProgressBar;
