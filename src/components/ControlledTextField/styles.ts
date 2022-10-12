import styled from 'styled-components';
import { TextField as MUITextField } from '@mui/material';

export const TextField = styled(MUITextField).attrs({
  className: 'text-field'
})`
  width: 100%;
  
  input {
    color: var(--text);
  }
`;