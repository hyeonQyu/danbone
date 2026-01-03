'use client';

import { useCallback, useState } from 'react';

const DEFAULT_BASE_FONT_SIZE = 16;

const getBaseFontSize = () => {
  if (typeof window === 'undefined') return DEFAULT_BASE_FONT_SIZE;
  const computedSize = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--base-font-size'));
  return computedSize || DEFAULT_BASE_FONT_SIZE;
};

export const usePxToRem = () => {
  const [baseFontSize] = useState(getBaseFontSize());

  return useCallback(
    (px: number) => {
      return `${px / baseFontSize}rem`;
    },
    [baseFontSize],
  );
};
