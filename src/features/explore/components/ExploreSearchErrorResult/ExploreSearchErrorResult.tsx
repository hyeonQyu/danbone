import { usePxToRem } from '@/styles';
import { ErrorOutline } from '@mui/icons-material';
import { Box, Stack, Typography, useTheme } from '@mui/material';

interface ExploreSearchErrorResultProps {
  error: Error | unknown;
}

function ExploreSearchErrorResult({ error }: ExploreSearchErrorResultProps) {
  const { spacing, palette } = useTheme();

  const pxToRem = usePxToRem();

  const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.\n다시 시도해주세요.';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: `${spacing(6)} ${spacing(2)}`,
        minHeight: pxToRem(300),
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
          <ErrorOutline sx={{ fontSize: pxToRem(52), color: palette.error.main }} />
        </Box>

        <Typography
          variant="h6"
          sx={{
            marginTop: spacing(3),
          }}
        >
          검색에 실패했습니다
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: palette.text.primary,
            lineHeight: 1.6,
            marginTop: spacing(1),
          }}
        >
          {errorMessage}
        </Typography>
      </Stack>
    </Box>
  );
}

export default ExploreSearchErrorResult;
