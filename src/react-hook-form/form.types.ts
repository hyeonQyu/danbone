import { FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';

export interface ReactHookFormProps<TFieldValues extends FieldValues = FieldValues> {
  formName: FieldPath<TFieldValues>;
  rules?: Exclude<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>;
  validator?: (value: string) => boolean;
  label?: string;
  required?: boolean;
  hideErrorMessage?: boolean;
}
