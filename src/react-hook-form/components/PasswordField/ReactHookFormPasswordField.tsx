import { ReactHookFormTextField, ReactHookFormTextFieldProps } from '@/react-hook-form/components/TextField';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { FieldValues } from 'react-hook-form';

export type ReactHookFormPasswordFieldProps<TFieldValues extends FieldValues> = Omit<ReactHookFormTextFieldProps<TFieldValues>, 'type'>;

function ReactHookFormPasswordField<TFieldValues extends FieldValues = FieldValues>(props: ReactHookFormPasswordFieldProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <ReactHookFormTextField
      {...props}
      type={showPassword ? 'text' : 'password'}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export default ReactHookFormPasswordField;
