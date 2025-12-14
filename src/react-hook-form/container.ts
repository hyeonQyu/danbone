import { ReactHookFormTextField, ReactHookFormTextFieldProps } from '@/react-hook-form/components';
import { JSXElementConstructor } from 'react';
import { FieldValues } from 'react-hook-form';

export const getReactHookFormComponents = <TFieldValues extends FieldValues = FieldValues>(): {
  TextField: JSXElementConstructor<ReactHookFormTextFieldProps<TFieldValues>>;
} => {
  return {
    TextField: ReactHookFormTextField,
  };
};
