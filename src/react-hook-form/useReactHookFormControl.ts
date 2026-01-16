import { getRequiredErrorMessage } from '@/react-hook-form/form.rules.utils';
import { ReactHookFormProps } from '@/react-hook-form/form.types';
import { ChangeEventHandler } from 'react';
import { FieldValues, useController } from 'react-hook-form';

export type UseReactHookFormControlParams<
  TFieldValues extends FieldValues,
  ReactHookFormComponentProps extends ReactHookFormProps<TFieldValues>,
> = ReactHookFormComponentProps;

export const useReactHookFormControl = <
  TFieldValues extends FieldValues,
  ReactHookFormComponentProps extends ReactHookFormProps<TFieldValues>,
>(
  params: UseReactHookFormControlParams<TFieldValues, ReactHookFormComponentProps>,
) => {
  const { formName, rules, validator = () => true, label: originLabel, required, hideErrorMessage, ...restProps } = params;

  const { field, fieldState, formState } = useController({
    name: formName,
    rules: {
      ...rules,
      required: rules?.required ? rules.required : required ? getRequiredErrorMessage() : false,
    },
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!validator(e.target.value)) return;
    field.onChange(e);
  };

  const touched = Boolean(formState.touchedFields[formName]);
  const submitted = formState.isSubmitted;
  const shouldShowError = touched || submitted;

  const error = shouldShowError ? fieldState.error : undefined;
  const errorMessage = hideErrorMessage ? '' : error ? (error.message as string) : shouldShowError ? ' ' : undefined;

  const label = originLabel ? `${originLabel}${required ? ' *' : ''}` : originLabel;

  return {
    restProps,
    field,
    label,
    error,
    errorMessage,
    handleChange,
  };
};

export default useReactHookFormControl;
