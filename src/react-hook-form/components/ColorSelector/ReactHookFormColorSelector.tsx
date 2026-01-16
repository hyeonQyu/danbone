import { ColorSelector } from '@/components/ColorSelector';
import { ReactHookFormProps } from '@/react-hook-form/form.types';
import useReactHookFormControl from '@/react-hook-form/useReactHookFormControl';
import { FieldValues } from 'react-hook-form';

export type ReactHookFormColorSelectorProps<TFieldValues extends FieldValues> = ReactHookFormProps<TFieldValues> & {
  colors: readonly string[];
};

function ReactHookFormColorSelector<TFieldValues extends FieldValues = FieldValues>(
  props: ReactHookFormColorSelectorProps<TFieldValues>,
) {
  const { colors, ...hookFormProps } = props;

  const {
    restProps: { ...restProps },
    field,
    error,
  } = useReactHookFormControl(hookFormProps);

  const handleChange = (color: string) => {
    field.onChange(color);
  };

  return <ColorSelector {...restProps} colors={colors} value={field.value} onChange={handleChange} error={Boolean(error)} />;
}

export default ReactHookFormColorSelector;
