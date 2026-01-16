import { getObjectAtPath } from '@/lib';
import { getRequiredErrorMessage } from '@/react-hook-form/form.rules.utils';
import { ReactHookFormProps } from '@/react-hook-form/form.types';
import { ChangeEventHandler } from 'react';
import { FieldError, FieldValues, useController, useFormContext } from 'react-hook-form';

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

  const {
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const { field } = useController({
    name: formName,
    rules: {
      ...rules,
      required: required ? getRequiredErrorMessage() : false,
    },
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!validator(e.target.value)) return;
    field.onChange(e);
  };

  const error = getObjectAtPath(errors, formName) as FieldError | undefined;
  const errorMessage = hideErrorMessage ? '' : ((error?.message as string) ?? ' ');

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
