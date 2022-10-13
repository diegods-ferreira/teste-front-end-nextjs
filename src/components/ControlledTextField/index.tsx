import { TextFieldProps } from '@mui/material';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

import * as S from './styles';

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
  helperText,
  ...controllerProps
}: ControlledTextFieldProps<T>) {
  const {
    field: { ...inputProps },
    fieldState: { error }
  } = useController(controllerProps);

  return (
    <S.TextField
      id={controllerProps.name}
      type={type}
      label={label}
      placeholder={placeholder}
      variant={variant}
      error={!!error?.message}
      helperText={error?.message}
      {...inputProps}
    />
  );
}