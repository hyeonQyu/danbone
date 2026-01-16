import { ReactHookFormProps } from '@/react-hook-form/form.types';
import useReactHookFormControl from '@/react-hook-form/useReactHookFormControl';
import { TextField, TextFieldProps } from '@mui/material';
import { FieldValues } from 'react-hook-form';

export type ReactHookFormTextFieldProps<TFieldValues extends FieldValues> = ReactHookFormProps<TFieldValues> &
  Omit<TextFieldProps, 'onChange' | 'label' | 'required'>;

function ReactHookFormTextField<TFieldValues extends FieldValues = FieldValues>(props: ReactHookFormTextFieldProps<TFieldValues>) {
  const {
    restProps: { ...restProps },
    field,
    label,
    error,
    errorMessage,
    handleChange,
  } = useReactHookFormControl(props);

  const { error: errorFromProps, helperText } = props;

  const shouldShowError = errorFromProps ?? Boolean(error);
  const helperTextToShow = !shouldShowError && helperText ? helperText : (errorMessage ?? ' ');

  return (
    <>
      <TextField
        {...field}
        {...restProps}
        label={label}
        onChange={handleChange}
        error={shouldShowError}
        helperText={helperTextToShow}
      />
    </>
  );
}

export default ReactHookFormTextField;
