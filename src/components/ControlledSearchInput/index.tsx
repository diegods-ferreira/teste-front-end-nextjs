import { IconButton, InputBaseProps } from '@mui/material';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

import * as S from './styles';


type Props = InputBaseProps & {
  rightButtonIcon?: React.ReactNode;
  rightButtonType?: 'submit' | 'button' | 'reset';
  disableRightButton?: boolean;
}

type ControlledSearchInputProps<T extends FieldValues> = Props & UseControllerProps<T>;

export function ControlledSearchInput<T extends FieldValues>({
  placeholder,
  rightButtonIcon,
  rightButtonType = 'submit',
  disableRightButton = false,
  ...controllerProps
}: ControlledSearchInputProps<T>) {
  const {
    field: { ...inputProps },
    fieldState: { error }
  } = useController(controllerProps);

  return (
    <S.Wrapper>
      <S.Input
        placeholder={placeholder}
        error={!!error?.message}
        {...inputProps}
      />

      {!!rightButtonIcon && (
        <IconButton type={rightButtonType} disabled={disableRightButton}>
          {rightButtonIcon}
        </IconButton>
      )}
    </S.Wrapper>
  );
}