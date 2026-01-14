import { usePxToRem } from '@/styles';
import { ErrorOutline } from '@mui/icons-material';
import { Box, Stack, SxProps, Theme, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface ErrorViewProps {
  title: string;
  message: string;
  icon?: ReactNode;
  sx?: SxProps<Theme>;
}

function ErrorView({ title, message, icon, sx }: ErrorViewProps) {
  const { spacing, palette } = useTheme();

  const pxToRem = usePxToRem();

  const defaultIcon = <ErrorOutline sx={{ fontSize: pxToRem(52), color: palette.error.main }} />;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: `${spacing(6)} ${spacing(2)}`,
        minHeight: pxToRem(300),
        ...sx,
      }}
    >
      <Stack
        sx={{
          maxWidth: pxToRem(500),
          width: '100%',
          p: spacing(4),
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            borderRadius: 9999,
            backgroundColor: palette.mode === 'dark' ? `${palette.error.dark}15` : `${palette.error.light}15`,
            border: `1px solid ${palette.error.main}40`,
            width: pxToRem(88),
            height: pxToRem(88),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}
        >
          {icon || defaultIcon}
        </Box>

        <Typography
          variant="h6"
          sx={{
            marginTop: spacing(3),
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: palette.text.primary,
            lineHeight: 1.6,
            marginTop: spacing(1),
          }}
        >
          {message}
        </Typography>
      </Stack>
    </Box>
  );
}

export default ErrorView;
