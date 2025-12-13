'use client';

import '@/styles/globals.css';
import { paletteDark } from '@/styles/palette.dark';
import { paletteLight } from '@/styles/palette.light';
import { ThemeModeContext } from '@/styles/ThemeModeContext';
import { usePxToRem } from '@/styles/usePxToRem';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider as MuiThemeProvider, PaletteMode, PaletteOptions } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { ReactNode, useMemo, useState } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

const paletteByMode: Record<PaletteMode, PaletteOptions> = {
  light: paletteLight,
  dark: paletteDark,
};

function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<PaletteMode>('light');

  const pxToRem = usePxToRem();

  const theme = useMemo(
    () =>
      createTheme({
        palette: paletteByMode[mode],
        heights: {
          sm: pxToRem(32),
          md: pxToRem(48),
          lg: pxToRem(56),
        },
        typography: {
          fontFamily: [
            'Pretendard Variable',
            'Pretendard',
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            'system-ui',
            'sans-serif',
          ].join(','),
          h1: {
            fontSize: pxToRem(40),
            fontWeight: 600,
          },
          h2: {
            fontSize: pxToRem(32),
            fontWeight: 600,
          },
          h3: {
            fontSize: pxToRem(28),
            fontWeight: 600,
          },
          h4: {
            fontSize: pxToRem(24),
            fontWeight: 600,
          },
          h5: {
            fontSize: pxToRem(20),
            fontWeight: 600,
          },
          h6: {
            fontSize: pxToRem(16),
            fontWeight: 600,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              },
            },
          },
        },
      }),
    [mode, pxToRem],
  );

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>{children}</SnackbarProvider>
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export default ThemeProvider;
