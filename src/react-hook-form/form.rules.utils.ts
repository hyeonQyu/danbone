import { isEmail } from '@/lib';
import { Message } from 'react-hook-form';

export const getMaxLengthPlaceholder = (maxLength: number) => `${maxLength}자까지 입력 가능합니다.`;

export const getRequiredErrorMessage = () => '필수 입력 항목이에요.';

export const getMaxLengthErrorMessage = (maxLength: number) => `${maxLength}자 이하로 입력해 주세요.`;

export const getMinLengthErrorMessage = (minLength: number) => `${minLength}자 이상 입력해 주세요.`;

export const getLengthErrorMessage = (length: number, prefix = '') => `${prefix} ${length}자로 입력해 주세요.`.trim();

export const getAlphabetLengthErrorMessage = (length: number) => `영문 ${length}자로 입력해 주세요.`;

export const getMaxRule = (max: number, message?: Message | ((max: number) => Message)) => ({
  max: {
    value: max,
    message: message ? (typeof message === 'function' ? message(max) : message) : getMaxLengthErrorMessage(max),
  },
});

export const getMaxLengthRule = (maxLength: number, message?: Message | ((maxLength: number) => Message)) => ({
  maxLength: {
    value: maxLength,
    message: message ? (typeof message === 'function' ? message(maxLength) : message) : getMaxLengthErrorMessage(maxLength),
  },
});

export const getMinRule = (min: number, message?: Message | ((min: number) => Message)) => ({
  min: {
    value: min,
    message: message ? (typeof message === 'function' ? message(min) : message) : getMaxLengthErrorMessage(min),
  },
});

export const getMinLengthRule = (minLength: number, message?: Message | ((minLength: number) => Message)) => ({
  minLength: {
    value: minLength,
    message: message ? (typeof message === 'function' ? message(minLength) : message) : getMinLengthErrorMessage(minLength),
  },
});

export const getEmailValidateRule = () => ({
  validate: (value: string) => {
    if (!value || isEmail(value)) return true;
    return '이메일 형식이 유효하지 않습니다.';
  },
});

export const getDuplicateValidator =
  <T>(fields: T[], valueGetter: (field: T) => string, index: number, duplicatedErrorMessage = '중복된 값입니다.') =>
  (value: string) => {
    const duplicated = fields.some((field, i) => valueGetter(field) === value && i !== index);
    if (duplicated) return duplicatedErrorMessage;
    return true;
  };
