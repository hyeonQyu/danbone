'use client';

import { usePxToRem } from '@/styles';
import { Search } from '@mui/icons-material';
import { InputAdornment, OutlinedInput, useTheme } from '@mui/material';
import { MouseEvent } from 'react';

interface SearchInputFieldProps {
  value?: string;
  placeholder?: string;
  onClick?: (event: MouseEvent<HTMLInputElement>) => void;
}

function SearchInputField({ value = '', placeholder = '검색어를 입력하세요', onClick }: SearchInputFieldProps) {
  const { palette } = useTheme();
  const pxToRem = usePxToRem();

  return (
    <OutlinedInput
      value={value}
      placeholder={placeholder}
      onClick={onClick}
      readOnly
      fullWidth
      startAdornment={
        <InputAdornment position="start">
          <Search sx={{ color: palette.text.secondary }} />
        </InputAdornment>
      }
      sx={{
        backgroundColor: palette.background.paper,
        height: pxToRem(48),
        fontSize: pxToRem(16),
      }}
    />
  );
}

export default SearchInputField;
