'use client';

import { useInterval } from '@/hooks';
import { TIME_UNIT } from '@/lib';
import { usePxToRem } from '@/styles';
import { Theme } from '@emotion/react';
import { Box, CircularProgress, SxProps, Typography, keyframes, useTheme } from '@mui/material';
import { useState } from 'react';

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

const defaultLoadingMessages = ['데이터를 불러오는 중...', '잠시만 기다려주세요...', '처리 중입니다...'];

interface LoadingProps {
  messages?: string[];
  sx?: SxProps<Theme>;
}

function Loading({ messages = defaultLoadingMessages, sx }: LoadingProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const theme = useTheme();

  const pxToRem = usePxToRem();

  useInterval(() => {
    setMessageIndex((prev) => (prev + 1) % messages.length);
  }, TIME_UNIT.unitOfMs.asSecond * 3);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: pxToRem(400),
        gap: 3,
        ...sx,
      }}
    >
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="circularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.palette.text.primary} />
            <stop offset="50%" stopColor={theme.palette.text.secondary} />
            <stop offset="100%" stopColor={theme.palette.text.disabled} />
          </linearGradient>
          <linearGradient id="circularGradientInner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.palette.text.secondary} stopOpacity="0.3" />
            <stop offset="100%" stopColor={theme.palette.text.disabled} stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: `${pulseAnimation} 2s ease-in-out infinite`,
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            '& .MuiCircularProgress-circle': {
              stroke: 'url(#circularGradient)',
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress
            size={40}
            thickness={4}
            sx={{
              '& .MuiCircularProgress-circle': {
                stroke: 'url(#circularGradientInner)',
              },
            }}
            variant="indeterminate"
          />
        </Box>
      </Box>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          animation: `${fadeIn} 0.5s ease-in-out`,
          textAlign: 'center',
        }}
      >
        {messages[messageIndex]}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: 'text.primary',
              animation: `${bounce} 1.4s infinite ease-in-out both`,
              animationDelay: `${index * 0.16}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default Loading;
