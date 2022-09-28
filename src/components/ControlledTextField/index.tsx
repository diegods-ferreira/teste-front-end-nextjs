import { TextField, TextFieldProps, Typography } from '@mui/material';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

import styles from './styles.module.scss';

type Props = TextFieldProps & {
  label?: string;
  placeholder?: string;
}

type ControlledTextFieldProps<T extends FieldValues> = Props & UseControllerProps<T>;

export function ControlledTextField<T extends FieldValues>({
  label,
  placeholder,
  type,
  variant = 'outlined',
  className,
  helperText,
  ...controllerProps
}: ControlledTextFieldProps<T>) {
  const {
    field: { ...inputProps },
    fieldState: { error }
  } = useController(controllerProps);

  return (
    <TextField
      id={controllerProps.name}
      type={type}
      label={label}
      placeholder={placeholder}
      variant={variant}
      error={!!error?.message}
      helperText={error?.message}
      className={[styles.input, className].join(' ')}
      {...inputProps}
    />
  );
}