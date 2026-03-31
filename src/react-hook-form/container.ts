import {
  ReactHookFormPasswordField,
  ReactHookFormPasswordFieldProps,
  ReactHookFormTextField,
  ReactHookFormTextFieldProps,
} from '@/react-hook-form/components';
import { JSXElementConstructor } from 'react';
import { FieldValues } from 'react-hook-form';

export const getReactHookFormComponents = <TFieldValues extends FieldValues = FieldValues>(): {
  TextField: JSXElementConstructor<ReactHookFormTextFieldProps<TFieldValues>>;
  PasswordField: JSXElementConstructor<ReactHookFormPasswordFieldProps<TFieldValues>>;
} => {
  return {
    TextField: ReactHookFormTextField,
    PasswordField: ReactHookFormPasswordField,
  };
};
