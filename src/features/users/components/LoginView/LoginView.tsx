'use client';

import { Logo } from '@/components/Logo';
import { login } from '@/features/users';
import type { LoginData } from '@/features/users/users.types';
import { TypedLink, useRedirect } from '@/routes';
import { usePxToRem } from '@/styles';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ChangeEvent, FormEvent, useState } from 'react';

interface LoginViewProps {
  defaultEmail?: string;
  redirectTo?: string;
}

function LoginView({ defaultEmail, redirectTo }: LoginViewProps) {
  const redirectAfterLogin = useRedirect(redirectTo);

  const { palette, spacing, typography, heights } = useTheme();
  const [formData, setFormData] = useState<LoginData>({
    email: defaultEmail ?? '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pxToRem = usePxToRem();

  const handleInputChange = (field: keyof LoginData) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(formData);
      redirectAfterLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: pxToRem(400),
        display: 'flex',
        flexDirection: 'column',
        gap: spacing(3),
      }}
    >
      <Logo />

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="이메일"
        type="email"
        value={formData.email}
        onChange={handleInputChange('email')}
        disabled={loading}
        fullWidth
        required
        autoComplete="email"
      />

      <TextField
        label="비밀번호"
        type="password"
        value={formData.password}
        onChange={handleInputChange('password')}
        disabled={loading}
        fullWidth
        required
        autoComplete="current-password"
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        fullWidth
        sx={{
          ...typography.h6,
          height: heights.lg,
        }}
      >
        {loading ? <CircularProgress size={24} /> : '로그인'}
      </Button>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: spacing(2),
          marginTop: spacing(1),
        }}
      >
        <Typography variant="body2" color="textSecondary">
          계정이 없으신가요?
        </Typography>

        <TypedLink href="/signup" passHref>
          <Typography
            variant="body2"
            sx={{
              color: palette.primary.main,
              textDecoration: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            회원가입
          </Typography>
        </TypedLink>
      </Box>
    </Box>
  );
}

export default LoginView;
