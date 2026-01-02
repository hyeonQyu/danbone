'use client';

import { usePxToRem } from '@/styles';
import { Search } from '@mui/icons-material';
import { InputAdornment, OutlinedInput, useTheme } from '@mui/material';
import { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';

export interface SearchInputFieldProps {
  value?: string;
  placeholder?: string;
  onClick?: (event: MouseEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (query: string) => void;
  readOnly?: boolean;
  autoFocus?: boolean;
  blurOnSearch?: boolean;
  disabled?: boolean;
}

function SearchInputField({
  value,
  placeholder = '검색어를 입력하세요',
  onClick,
  onChange,
  onSearch,
  readOnly = false,
  autoFocus = false,
  blurOnSearch = false,
  disabled = false,
}: SearchInputFieldProps) {
  const { palette } = useTheme();
  const pxToRem = usePxToRem();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      onSearch?.(target.value);

      if (blurOnSearch) {
        e.currentTarget.blur();
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
  };

  return (
    <OutlinedInput
      value={value}
      defaultValue={value ? undefined : ''}
      placeholder={placeholder}
      onClick={onClick}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      readOnly={readOnly}
      autoFocus={autoFocus}
      disabled={disabled}
      fullWidth
      type="search"
      startAdornment={
        <InputAdornment position="start">
          <Search sx={{ color: palette.text.secondary }} />
        </InputAdornment>
      }
      inputProps={{
        sx: {
          paddingLeft: 0,
        },
      }}
      sx={{
        backgroundColor: palette.background.paper,
        height: pxToRem(48),
        fontSize: pxToRem(16),
      }}
    />
  );
}

export default SearchInputField;
