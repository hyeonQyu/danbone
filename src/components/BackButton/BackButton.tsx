'use client';

import { ArrowBack } from '@mui/icons-material';
import { IconButton, useTheme } from '@mui/material';

interface BackButtonProps {
  onBack: () => void;
}

function BackButton({ onBack }: BackButtonProps) {
  const { palette, spacing } = useTheme();

  return (
    <IconButton onClick={onBack} sx={{ padding: spacing(1) }}>
      <ArrowBack sx={{ color: palette.text.primary }} />
    </IconButton>
  );
}

export default BackButton;
